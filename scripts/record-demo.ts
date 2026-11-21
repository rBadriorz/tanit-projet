// Records the René demo as 3 short mobile videos (Karim, Alex, Léa) with Playwright.
// Usage: bun scripts/record-demo.ts            (app on http://localhost:8080, `bun run dev`)
//        BASE=https://... bun scripts/record-demo.ts
//        ONLY=2 bun scripts/record-demo.ts      (record one scenario)
// Output: demo-videos/1-karim.webm, 2-alex.webm, 3-lea.webm, clicks-<scenario>.json, durations.json
// The address is never shown: the videos only contain the page (no browser bar).
import { chromium, type Browser, type Locator, type Page } from "@playwright/test";
import { mkdirSync, readdirSync, renameSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const BASE = (process.env.BASE ?? "http://localhost:8080").replace(/\/+$/, "");
const OUT = "demo-videos";
const SPEED = Number(process.env.SPEED ?? 1); // < 1 = shorter pauses
const KEY = "bottega-demo-v2";
mkdirSync(OUT, { recursive: true });

type Log = { failed: string[]; clicks: number[] };

/** Pre-filled app state: scripted AI answers (no API key needed), plus optional extra state. */
function seed(extra: Record<string, unknown> = {}) {
  return JSON.stringify({ contributions: [], extraShops: [], shopPatches: {}, posts: [], applications: [], backerBumps: {}, aiMode: "scripted", ...extra });
}

class Rec {
  t0 = Date.now();
  log: Log = { failed: [], clicks: [] };
  constructor(public page: Page, public name: string) {}

  pause = (ms: number) => this.page.waitForTimeout(Math.round(ms * SPEED));

  /** Round "tap" dot at the click position, logged for the click sounds, then the click. */
  async tap(loc: Locator, label: string, after = 1000) {
    try {
      const el = loc.first();
      await el.waitFor({ state: "visible", timeout: 8000 });
      await el.scrollIntoViewIfNeeded();
      const b = await el.boundingBox();
      if (b) {
        const x = b.x + b.width / 2, y = b.y + b.height / 2;
        await this.page.evaluate(([x, y]) => {
          const d = document.createElement("div");
          d.style.cssText = `position:fixed;left:${x - 22}px;top:${y - 22}px;width:44px;height:44px;border-radius:50%;` +
            "background:rgba(139,90,43,.35);border:3px solid rgba(139,90,43,.9);z-index:99999;pointer-events:none;" +
            "transform:scale(.4);opacity:1;transition:transform .35s ease-out,opacity .5s ease-out .25s";
          document.body.appendChild(d);
          requestAnimationFrame(() => { d.style.transform = "scale(1)"; d.style.opacity = "0"; });
          setTimeout(() => d.remove(), 900);
        }, [x, y]);
        await this.page.waitForTimeout(260);
      }
      this.log.clicks.push(Date.now() - this.t0);
      await el.click({ timeout: 5000 });
      await this.pause(after);
      return true;
    } catch (e) {
      this.log.failed.push(`${label}: ${(e as Error).message.split("\n")[0]}`);
      console.warn(`  ! ${this.name}: ${label} failed`);
      if (process.env.DEBUG) await this.page.screenshot({ path: join(OUT, `_fail-${this.name}-${label.replace(/\W+/g, "_")}.png`) }).catch(() => {});
      return false;
    }
  }

  async type(loc: Locator, text: string, label: string, delay = 60) {
    try {
      const el = loc.first();
      await el.waitFor({ state: "visible", timeout: 8000 });
      await el.fill("");
      await el.type(text, { delay: Math.round(delay * SPEED) });
      await this.pause(600);
    } catch (e) {
      this.log.failed.push(`${label}: ${(e as Error).message.split("\n")[0]}`);
    }
  }

  /** Smooth scroll of the main scrollable area (the largest visible one). */
  async scroll(dy: number, ms = 1200) {
    await this.page.evaluate(async ([dy, ms]) => {
      const els = [...document.querySelectorAll<HTMLElement>("*")].filter((e) => {
        const s = getComputedStyle(e);
        return /(auto|scroll)/.test(s.overflowY) && e.scrollHeight > e.clientHeight + 10 && e.getBoundingClientRect().height > 200;
      });
      const el = els.sort((a, b) => b.clientHeight * b.clientWidth - a.clientHeight * a.clientWidth)[0];
      if (!el) return;
      const start = el.scrollTop, t0 = performance.now();
      await new Promise<void>((done) => {
        const step = (t: number) => {
          const k = Math.min(1, (t - t0) / ms);
          el.scrollTop = start + dy * (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
          if (k < 1) requestAnimationFrame(step); else done();
        };
        requestAnimationFrame(step);
      });
    }, [dy, Math.round(ms * SPEED)] as const);
    await this.pause(300);
  }

  /** Sets a React-controlled range input. */
  async setRange(loc: Locator, value: number, label: string) {
    try {
      await loc.first().evaluate((el, v) => {
        const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
        set.call(el, String(v));
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }, value);
      await this.pause(900);
    } catch (e) {
      this.log.failed.push(`${label}: ${(e as Error).message.split("\n")[0]}`);
    }
  }
}

async function scenario(browser: Browser, file: string, path: string, state: string, run: (r: Rec) => Promise<void>) {
  const tmp = join(OUT, "_tmp-" + file);
  rmSync(tmp, { recursive: true, force: true });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: false, locale: "en-GB",
    acceptDownloads: true, recordVideo: { dir: tmp, size: { width: 390, height: 844 } },
  });
  await ctx.addInitScript(([k, v]) => { try { if (!sessionStorage.getItem("seeded")) { localStorage.setItem(k, v); sessionStorage.setItem("seeded", "1"); } } catch { /* */ } }, [KEY, state] as const);
  const page = await ctx.newPage();
  const r = new Rec(page, file);
  console.log(`> ${file}`);
  await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
  try { await run(r); } catch (e) { r.log.failed.push("scenario stopped: " + (e as Error).message.split("\n")[0]); }
  const duration = (Date.now() - r.t0) / 1000;
  await page.close();
  await ctx.close();
  const vid = readdirSync(tmp).find((f) => f.endsWith(".webm"));
  if (vid) renameSync(join(tmp, vid), join(OUT, file + ".webm"));
  rmSync(tmp, { recursive: true, force: true });
  writeFileSync(join(OUT, `clicks-${file}.json`), JSON.stringify(r.log.clicks));
  console.log(`  ${file}.webm ≈ ${duration.toFixed(1)} s, ${r.log.clicks.length} taps${r.log.failed.length ? ", failed: " + r.log.failed.join("; ") : ""}`);
  return { file: file + ".webm", seconds: Math.round(duration * 10) / 10, failed: r.log.failed };
}

const btn = (p: Page, name: string | RegExp) => p.getByRole("button", typeof name === "string" ? { name, exact: true } : { name });

// ---------------- Scenario 1: Karim, 70, the baker ----------------
async function karim(r: Rec) {
  const p = r.page;
  await r.pause(3000); // splash logo, then home logo
  await r.tap(btn(p, "I'm looking for a successor"), "successor button", 1100);
  await r.tap(btn(p, "Bakery"), "bakery", 800);
  await r.tap(btn(p, "More than 40 years"), "years", 800);
  await r.tap(btn(p, "Within a year"), "when", 800);
  await r.tap(btn(p, "Yes, an employee"), "who", 1200);
  await r.pause(1800); // valuation result
  await r.tap(btn(p, "Put my shop on the map"), "put on map", 1400);
  await r.tap(btn(p, "Make a poster"), "make a poster", 1200);
  try { await p.locator("select").first().selectOption({ label: "Le Fournil de Karim · Cannes-sur-Mer" }); await r.pause(900); }
  catch { r.log.failed.push("poster: choose Le Fournil de Karim"); }
  await r.tap(btn(p, "Bold brown"), "poster style", 900);
  await r.scroll(-3000, 900);
  await r.pause(1800); // poster with its QR code
  await r.tap(btn(p, "Back"), "back to result", 700);
  await r.tap(btn(p, "Back"), "back to home", 800);
  if (process.env.NO_CHAT_1) return;
  await r.tap(p.getByRole("button", { name: /^Ask/ }), "Ask René", 900);
  // Suggested question: the scripted assistant has a precise answer for it.
  await r.tap(btn(p, "What happens to Karim's employees?"), "staff question", 3600);
}

// ---------------- Scenario 2: Alex, 30, sous-chef ----------------
async function alex(r: Rec) {
  const p = r.page;
  await r.pause(2200);
  await r.tap(btn(p, "I'm taking over"), "taking over", 1800);
  await r.tap(p.getByLabel("Search shops by name, town or type"), "search field", 300);
  await r.type(p.getByLabel("Search shops by name, town or type"), "fournil", "search", 60);
  await r.tap(p.getByRole("listbox").getByRole("button", { name: /Le Fournil de Karim/ }), "search result", 2200);
  await r.tap(p.getByText("Le Fournil de Karim", { exact: true }).last(), "shop card", 1500);
  await r.scroll(620, 1400); // Karim's profile and quote
  await r.pause(1200);
  await r.tap(btn(p, "I want to be the lead buyer"), "lead buyer", 1000);
  await r.tap(btn(p, "Next"), "next (shop picked)", 900);
  await r.tap(btn(p, /I have a manager/), "I have a manager", 900);
  await r.type(p.locator("input[type=text]").first(), "Alex", "manager name", 60);
  await r.tap(btn(p, "Me"), "role me", 500);
  await r.tap(btn(p, "Save the manager"), "save manager", 900);
  await r.tap(btn(p, "Next"), "next (manager)", 900);
  await r.setRange(p.locator("input[type=range]"), 10000, "contribution 10000");
  await r.tap(btn(p, "Next"), "next (about you)", 900);
  await r.pause(600); // shop numbers prefilled
  await r.tap(btn(p, "Next"), "next (numbers)", 600);
  await r.tap(btn(p, "Generate my bank file"), "generate bank file", 4200); // the AI team steps
  await r.pause(800);
  for (let i = 0; i < 4; i++) await r.scroll(520, 1300); // valuation, plan, stress test, summary
  await r.tap(btn(p, /Download bank file/), "download PDF", 900);
  if (!process.env.NO_GAP) {
    await r.tap(btn(p, /Close the gap/), "close the gap", 1500);
    await r.scroll(700, 1500);
    await r.pause(1000);
    await r.scroll(700, 1500);
    await r.pause(800);
  }
  // Back to a tab screen for the assistant.
  for (let i = 0; i < 5 && !(await btn(p, "Projects").isVisible()); i++) await r.tap(btn(p, "Back"), "back", 450);
  await r.tap(btn(p, "Projects"), "projects tab", 700);
  await r.tap(p.getByRole("button", { name: /^Ask/ }), "Ask René", 900);
  await r.tap(btn(p, "SAS or cooperative (SCIC) for my bakery?"), "legal question", 3800);
}

// ---------------- Scenario 3: Léa, a neighbour ----------------
async function lea(r: Rec) {
  const p = r.page;
  await r.pause(2600); // shutter animation and funding gauge
  await r.scroll(450, 1300);
  await r.pause(900);
  await r.scroll(900, 1800); // neighbourhood wall
  await r.pause(800);
  await r.tap(btn(p, "Join from €100"), "join", 1000);
  await r.tap(btn(p, "€250"), "€250", 900);
  await r.tap(btn(p, "Continue"), "continue 1", 800);
  await r.tap(btn(p, "Continue"), "continue 2", 800);
  await r.tap(p.getByLabel("I understand"), "I understand", 600);
  await r.tap(btn(p, "Continue"), "continue 3", 800);
  await r.tap(btn(p, /Send my request/), "send request", 2600); // Request sent / pending
  await r.tap(p.getByTestId("presenter-toggle"), "presenter", 700);
  await r.tap(btn(p, /Approve pending requests/), "approve", 300);
  await r.tap(p.getByRole("button", { name: "Close", exact: true }).last(), "close presenter", 2600); // confetti + co-owner card
  await r.tap(btn(p, "Close"), "close card", 600);
  await r.tap(btn(p, "Back to the shop"), "back to shop", 600);
  await r.tap(btn(p, "Back"), "back home", 900);
  await r.tap(btn(p, "Map"), "map tab", 1800);
  try {
    await p.mouse.move(195, 330);
    for (let i = 0; i < 3; i++) { await p.mouse.wheel(0, 260); await r.pause(700); }
  } catch { r.log.failed.push("map zoom out"); }
  await r.pause(1500);
}

const LEA_STATE = seed({
  // The raise Alex opened at the end of his takeover (same data the app writes).
  shopPatches: {
    "fournil-de-karim": {
      status: "raising", timelineStep: 4,
      leadBuyer: { firstName: "Alex", age: 30, role: "employee", yearsExperience: 9, stakePct: 60, contribution: 10000 },
      manager: { name: "Alex", role: "me", years: 9, pitch: "Sous-chef, I want to keep the bread of the place du Marché." },
      raise: { target: 40000, raised: 27300, backers: 96, daysLeft: 21, minTicket: 100, perks: ["A coffee each Saturday", "Your name on the wall of founders", "A vote at the yearly meeting"] },
    },
  },
});

const browser = await chromium.launch();
const only = process.env.ONLY;
const results = [];
if (!only || only === "1") results.push(await scenario(browser, "1-karim", "/", seed(), karim));
if (!only || only === "2") results.push(await scenario(browser, "2-alex", "/", seed(), alex));
if (!only || only === "3") results.push(await scenario(browser, "3-lea", "/shop/fournil-de-karim?presenter", LEA_STATE, lea));
await browser.close();
const file = join(OUT, "durations.json");
const prev = existsSync(file) ? JSON.parse(await Bun.file(file).text()) : {};
for (const x of results) prev[x.file] = x;
writeFileSync(file, JSON.stringify(prev, null, 2));
console.log(JSON.stringify(results, null, 2));
