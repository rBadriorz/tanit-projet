import { createFileRoute } from "@tanstack/react-router";
import { EFFORT, common, errorCode, hasKey, json, rateLimited, streamMessages } from "@/lib/anthropic.server";

type Msg = { role: "user" | "assistant"; content: string };

function cleanMessages(m: unknown): Msg[] | null {
  if (!Array.isArray(m) || m.length < 1 || m.length > 20) return null;
  let total = 0;
  for (const x of m) {
    if (!x || (x.role !== "user" && x.role !== "assistant") || typeof x.content !== "string") return null;
    total += x.content.length;
  }
  if (total > 40_000 || m[0].role !== "user" || m[m.length - 1].role !== "user") return null;
  return m.map(({ role, content }) => ({ role, content }));
}

export const Route = createFileRoute("/api/sample")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (rateLimited(request, "sample")) return json({ error: "rate_limited" }, 429);
        if (!hasKey()) return json({ error: "other" }, 503);
        const body = (await request.json().catch(() => null)) as { messages?: unknown; tier?: string } | null;
        const messages = cleanMessages(body?.messages);
        if (!messages) return json({ error: "other" }, 400);
        const effort = EFFORT[body?.tier ?? ""] || "low";
        const ac = new AbortController();
        request.signal.addEventListener("abort", () => ac.abort());
        const enc = new TextEncoder();

        const stream = new ReadableStream({
          async start(ctrl) {
            const send = (o: unknown) => ctrl.enqueue(enc.encode(JSON.stringify(o) + "\n"));
            try {
              let stop: string | null = null;
              for await (const ev of streamMessages({ ...common(effort), messages }, ac.signal)) {
                if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") send({ text: ev.delta.text });
                if (ev.type === "message_delta" && ev.delta?.stop_reason) stop = ev.delta.stop_reason;
              }
              if (stop === "refusal") send({ error: "other" });
            } catch (err) {
              if (!ac.signal.aborted) send({ error: errorCode(err) });
            }
            ctrl.close();
          },
          cancel() {
            ac.abort();
          },
        });
        return new Response(stream, {
          headers: {
            "Content-Type": "application/x-ndjson; charset=utf-8",
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
          },
        });
      },
    },
  },
});
