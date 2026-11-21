// Claude API calls, server side only: the key never leaves the server.
import Anthropic from "@anthropic-ai/sdk";

export const MODEL = () => process.env["CLAUDE_MODEL"] || "claude-opus-5-5";
export const hasKey = () => Boolean(process.env["ANTHROPIC_API_KEY"]);

let _client: Anthropic | null = null;
/** Reads ANTHROPIC_API_KEY (Lovable secret). Short timeout, no retries: the client falls back to scripted results. */
export function client(): Anthropic {
  if (!_client) _client = new Anthropic({ apiKey: process.env["ANTHROPIC_API_KEY"], timeout: 11_000, maxRetries: 0 });
  return _client;
}

// Protects the key against abuse: 20 requests per minute per visitor.
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
