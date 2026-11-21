import { createFileRoute } from "@tanstack/react-router";
import Anthropic from "@anthropic-ai/sdk";
import { client, hasKey, json, MODEL, rateLimited } from "@/lib/anthropic.server";
import { APP_NAME } from "@/bottega/config";

// One endpoint for every agent. The browser picks an agent name, never a schema or a prompt.
const str = { type: "string" };
const num = { type: "number" };
const obj = (properties: Record<string, unknown>) => ({
  type: "object", properties, required: Object.keys(properties), additionalProperties: false,
});
const arr = (items: unknown) => ({ type: "array", items });

const COMMON = `You work inside ${APP_NAME}, an app where neighbours take over local shops whose owners retire. ` +
  "A lead buyer (often an employee or a resident) keeps the majority; residents join from €100 through our licensed crowdfunding partner. " +
  "One company (SAS or SCIC) per shop; it is not a fund. Never name a crowdfunding platform or a real bank. All data is fictional demo data. Write plain, short English.";

const AGENTS: Record<string, { system: string; schema: object }> = {
  valuation: {
    system: COMMON + " You are a small-business valuation advisor in France. Value the shop with exactly 3 methods: EBITDA multiple, share of revenue, assets plus goodwill. Be conservative. Amounts in euros as plain numbers.",
    schema: obj({
      methods: arr(obj({ name: str, value: num, explanation: str })),
      recommendedPrice: num,
      range: obj({ low: num, high: num }),
      comment: str,
    }),
  },
  bankFile: {
    system: COMMON + " You are a small-business financing advisor in France helping an employee or resident take over a local shop with neighbours' participation through a licensed crowdfunding partner. Be concrete, conservative, and readable by a bank. Never invent legal guarantees. Include the matched grants and honour loans given in the input in the financing plan. Exactly 3 strengths and 3 risks with mitigations. The loan rate is a percentage number (e.g. 4.2). dscr is a number (e.g. 1.9). Output only the JSON schema.",
    schema: obj({
      executiveSummary: str,
      financingPlan: arr(obj({ source: str, amount: num, note: str })),
      loan: obj({ amount: num, years: num, rate: num, monthly: num }),
      dscr: num,
      strengths: arr(str),
      risks: arr(obj({ risk: str, mitigation: str })),
      nextSteps: arr(str),
    }),
  },
  legal: {
    system: COMMON + " You are a legal information assistant scoped to takeovers of small shops in France: SAS vs SCIC, shareholders' agreements, commercial lease transfer (bail commercial), staff transfer (the buyer keeps the employment contracts when the business is transferred), the EU ECSP crowdfunding rules and licensed platforms, and tax points. Answer in 80 to 140 words, plain English. If the question is outside this scope, say so briefly. Always end with: \"This is general information, not legal advice. Our partner lawyer can review your case.\"",
    schema: obj({ answer: str }),
  },
  story: {
    system: COMMON + " You write the shop's story for its project page: warm, local, human, a bit nostalgic, never salesy. 3 short paragraphs (2-3 sentences each), a pull quote from the owner, and a poster subline under 25 words.",
    schema: obj({ title: str, paragraphs: arr(str), pullQuote: str, posterSubline: str }),
  },
  subsidy: {
    system: COMMON + " You find public support for a small-shop takeover. List only schemes that plausibly exist for a small-shop takeover in France or through EU programmes. Give generic, verifiable names. Never invent precise amounts as certain; give ranges and say they are indicative. estimatedAmount is a conservative cash value in euros (0 for guarantees and tax relief); range is the indicative range as text. Phrase as 'may be eligible'.",
    schema: obj({
      matches: arr(obj({
        name: str,
        type: { type: "string", enum: ["grant", "honour_loan", "guarantee", "tax_relief", "loan"] },
        level: { type: "string", enum: ["local", "regional", "national", "EU"] },
        estimatedAmount: num,
        range: str,
        why: str,
        eligibility: arr(obj({ criterion: str, met: { type: "boolean" } })),
        howToApply: arr(str),
      })),
      totalEstimated: num,
      caveat: str,
    }),
  },
};

export const Route = createFileRoute("/api/bottega/agent")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (rateLimited(request, "agent")) return json({ error: "rate_limited" }, 429);
        if (!hasKey()) return json({ error: "no_key" }, 503);
        const body = (await request.json().catch(() => null)) as { agent?: string; input?: unknown } | null;
        const spec = body?.agent ? AGENTS[body.agent] : undefined;
        const input = JSON.stringify(body?.input ?? {});
        if (!spec || input.length > 20_000) return json({ error: "bad_request" }, 400);
        try {
          const res = await client().beta.messages.create({
            model: MODEL(),
            max_tokens: 4000,
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
            output_config: { effort: "low", format: { type: "json_schema", schema: spec.schema as Record<string, unknown> } },
            system: spec.system,
            messages: [{ role: "user", content: `Input (JSON):\n${input}` }],
          } as Anthropic.Beta.MessageCreateParamsNonStreaming);
          if (res.stop_reason === "refusal" || res.stop_reason === "max_tokens") return json({ error: res.stop_reason }, 502);
          const text = res.content.map((b) => (b.type === "text" ? b.text : "")).join("");
          return json({ data: JSON.parse(text) });
        } catch (err) {
          if (err instanceof Anthropic.RateLimitError) return json({ error: "rate_limited" }, 429);
          console.error("[agent]", err instanceof Anthropic.APIError ? err.status : "", err instanceof Error ? err.message : err);
          return json({ error: "other" }, 502);
        }
      },
    },
  },
});
