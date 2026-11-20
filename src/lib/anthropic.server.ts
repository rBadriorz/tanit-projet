// Appels à l'API Claude d'Anthropic (côté serveur uniquement : la clé ne quitte jamais le serveur).
// Reprend les paramètres du serveur Node d'origine (server/index.js).

export const MODEL = () => process.env["CLAUDE_MODEL"] || "claude-opus-5-5";
export const hasKey = () => Boolean(process.env["ANTHROPIC_API_KEY"]);

// « quick » = réponses courtes (explications) ; « default » = dossier et analyse décideurs.
export const EFFORT: Record<string, string> = { quick: "low", default: "medium" };

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function common(effort: string) {
  return {
    model: MODEL(),
    max_tokens: 8000,
    output_config: { effort } as Record<string, unknown>,
    fallbacks: "default",
  };
}

/** Lance un appel en streaming et rend les événements SSE un par un. */
export async function* streamMessages(body: Record<string, unknown>, signal?: AbortSignal) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env["ANTHROPIC_API_KEY"] ?? "",
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "server-side-fallback-2026-07-01",
    },
    body: JSON.stringify({ ...body, stream: true }),
    signal: signal ?? null,
  });
  if (!res.ok || !res.body) {
    const txt = await res.text().catch(() => "");
    throw new ApiError(res.status, txt.slice(0, 500));
  }
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buf = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += value;
    let i;
    while ((i = buf.indexOf("\n\n")) >= 0) {
      const chunk = buf.slice(0, i);
      buf = buf.slice(i + 2);
      const data = chunk
        .split("\n")
        .filter((l) => l.startsWith("data:"))
        .map((l) => l.slice(5).trim())
        .join("");
      if (!data) continue;
      const ev = JSON.parse(data);
      if (ev.type === "error") throw new ApiError(ev.error?.type === "rate_limit_error" ? 429 : 500, JSON.stringify(ev.error));
      yield ev;
    }
  }
}

export function errorCode(err: unknown): string {
  if (err instanceof ApiError && err.status === 429) return "rate_limited";
  if (err instanceof DOMException && err.name === "AbortError") return "cancelled";
  console.error("[api]", err instanceof ApiError ? err.status : "", err instanceof Error ? err.message : err);
  return "other";
}

// Protège la clé contre les abus : 20 demandes par minute et par personne.
const hits = new Map<string, number[]>();
export function rateLimited(request: Request, bucket: string): boolean {
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "local";
  const key = bucket + ":" + ip;
  const now = Date.now();
  const list = (hits.get(key) || []).filter((t) => now - t < 60_000);
  list.push(now);
  hits.set(key, list);
  return list.length > 20;
}

export const json = (obj: unknown, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });
