// Client side of the AI agents. Every call has a scripted fallback so the demo never fails:
// no key, an error, a refusal or more than 12 seconds -> the scripted result.
export type AgentName = "bankFile" | "legal" | "story" | "valuation" | "subsidy";

export async function runAgent<T>(agent: AgentName, input: unknown, scripted: () => T, opts: { mode: "live" | "scripted" }): Promise<{ data: T; source: "live" | "scripted" }> {
  if (opts.mode === "scripted") return { data: scripted(), source: "scripted" };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12_000);
  try {
    const res = await fetch("/api/bottega/agent", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ agent, input }),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(String(res.status));
    const body = (await res.json()) as { data?: T };
    if (!body.data) throw new Error("empty");
    return { data: body.data, source: "live" };
  } catch {
    return { data: scripted(), source: "scripted" };
  } finally {
    clearTimeout(timer);
  }
}

/** Runs the visible "agent working" steps; resolves when both the steps and the work are done. */
export async function withSteps<T>(steps: string[], onStep: (i: number) => void, work: Promise<T>, stepMs = 550): Promise<T> {
  const anim = (async () => {
    for (let i = 0; i < steps.length; i++) {
      onStep(i);
      await new Promise((r) => setTimeout(r, stepMs));
    }
  })();
  const [, out] = await Promise.all([anim, work]);
  onStep(steps.length);
  return out;
}
