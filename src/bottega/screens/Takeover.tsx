import { motion } from "framer-motion";
import { useState } from "react";
import { Check, Loader2, FileDown } from "lucide-react";
import type { Screen, Shop } from "../types";
import { Btn, Card, Page, Trust } from "../components/ui";
import { Donut } from "../components/Donut";
import { ShopFront, TYPE_LABEL } from "../components/ShopArt";
import { euro, useStore } from "../store";
import { runAgent, withSteps } from "../lib/agent";
import { scriptedBankFile, scriptedValuation, type BankFileOpts, type BankFileResult, type ValuationResult } from "../data/scripted";
import { P } from "../theme";

const STEPS = [
  "Reading the shop accounts…",
  "Estimating the value (3 methods)",
  "Building the financing plan",
  "Stress-testing the repayments",
  "Writing the executive summary",
  "Formatting for the bank",
];
const COLORS = [P.primaryDark, P.primary, P.warning, P.brown2, P.text2, P.closed, P.brown3];
export const planColor = (i: number): string => COLORS[i % COLORS.length] ?? P.text2;

export function DscrGauge({ value }: { value: number }) {
  const color = value >= 1.5 ? P.primaryDark : value >= 1.2 ? P.warning : P.primary;
  const label = value >= 1.5 ? "Comfortable" : value >= 1.2 ? "Tight" : "Too low";
  const w = Math.min(100, (value / 2.5) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted">Debt service coverage</span>
        <span className="serif text-2xl font-semibold" style={{ color }}>{value.toFixed(1)}</span>
      </div>
      <div className="relative mt-2 h-3 rounded-full" style={{ background: `linear-gradient(90deg,${P.danger} 0 48%,${P.warning} 48% 60%,${P.success} 60%)` }}>
        <motion.div className="absolute -top-1 h-5 w-1.5 rounded bg-ink" initial={{ left: 0 }} animate={{ left: `${w}%` }} transition={{ duration: 0.9 }} />
      </div>
      <p className="mt-1 text-xs font-semibold" style={{ color }}>{label} · banks usually want 1.2 or more</p>
    </div>
  );
}

function Field({ label, value, onChange, step = 1000 }: { label: string; value: number; onChange: (n: number) => void; step?: number }) {
  return (
    <label className="block">
      <span className="text-sm text-muted">{label}</span>
      <input type="number" inputMode="numeric" step={step} value={value} onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1 h-12 w-full rounded-2xl border border-line bg-surface px-4 text-lg" />
    </label>
  );
}

export default function Takeover({ screen }: { screen: Screen }) {
  const store = useStore();
  const initialId = screen.name === "takeover" && screen.shopId ? screen.shopId : "marcel";
  const [step, setStep] = useState(0);
  const [shopId, setShopId] = useState(initialId);
  const shop = store.shop(shopId) ?? store.shops.find((s) => s.price);
  const [role, setRole] = useState<"employee" | "resident" | "other">(shop?.leadBuyer?.role ?? "employee");
  const [years, setYears] = useState(shop?.leadBuyer?.yearsExperience ?? 9);
  const [contribution, setContribution] = useState(shop?.leadBuyer?.contribution ?? 15000);
  const [salary, setSalary] = useState(2200);
  const [nums, setNums] = useState(() => ({ price: shop?.price ?? 150000, revenue: shop?.revenue ?? 250000, ebitda: shop?.ebitda ?? 35000, rent: shop?.rent ?? 1400, staff: shop?.staff ?? 3 }));
  const [running, setRunning] = useState<number | null>(null);
  const [bank, setBank] = useState<BankFileResult | null>(null);
  const [val, setVal] = useState<ValuationResult | null>(null);
  const [target, setTarget] = useState(shop?.raise?.target ?? 40000);
  const [days, setDays] = useState(45);
  const [perks, setPerks] = useState("A coffee each Saturday, your name on the wall of founders, a vote at the yearly meeting");

  if (!shop) return <Page title="Start a takeover">No shop found.</Page>;
  const candidates = store.shops.filter((s) => s.price && (s.status === "seeking" || s.status === "raising"));

  const pick = (s: Shop) => {
    setShopId(s.id);
    setNums({ price: s.price ?? 150000, revenue: s.revenue ?? 250000, ebitda: s.ebitda ?? 35000, rent: s.rent ?? 1400, staff: s.staff ?? 3 });
    if (s.leadBuyer) { setRole(s.leadBuyer.role); setYears(s.leadBuyer.yearsExperience); setContribution(s.leadBuyer.contribution); }
    setTarget(s.raise?.target ?? Math.round((s.price ?? 150000) * 0.22 / 1000) * 1000);
    setBank(null); setVal(null);
  };

  const generate = async () => {
    setRunning(0);
    const opts: BankFileOpts = { ...nums, contribution, salary, role, years };
    const input = { shop: { name: shop.name, type: shop.type, town: shop.town, street: shop.street, owner: shop.owner, leadBuyer: shop.leadBuyer, raise: shop.raise, legalForm: shop.legalForm }, numbers: nums, leadBuyer: { role, years, contribution, monthlySalaryTarget: salary }, matchedGrants: ["Honour loan €20k at 0%", "Regional support €10k"] };
    const work = Promise.all([
      runAgent("bankFile", input, () => scriptedBankFile(shop, opts), { mode: store.aiMode }),
      runAgent("valuation", { shop: input.shop, numbers: nums }, () => scriptedValuation(shop, opts), { mode: store.aiMode }),
    ]);
    const [b, v] = await withSteps(STEPS, setRunning, work);
    store.setAiLast(b.source === "live" && v.source === "live" ? "live" : "scripted");
    setBank(b.data); setVal(v.data); setRunning(null);
  };

  const openRaise = () => {
    store.patchShop(shop.id, {
      status: "raising", timelineStep: 4,
      leadBuyer: shop.leadBuyer ?? { firstName: "You", age: 34, role, yearsExperience: years, stakePct: 60, contribution },
      raise: { target, raised: shop.raise?.raised ?? 0, backers: shop.raise?.backers ?? 0, daysLeft: days, minTicket: 100, perks: perks.split(",").map((p) => p.trim()).filter(Boolean) },
    });
    store.notify(`The raise for ${shop.name} is open!`);
    store.go({ name: "shop", id: shop.id });
  };

  const titles = ["Pick the shop", "About you", "The shop", "Your bank file", "Open the raise"];
  return (
    <Page title="Start a takeover">
      <div className="mb-4 flex items-center justify-center gap-2" aria-label={`Step ${step + 1} of 5`}>
        {titles.map((t, i) => <span key={t} className={`h-2.5 rounded-full transition-all ${i === step ? "w-8 bg-primary-dark" : i < step ? "w-2.5 bg-primary" : "w-2.5 bg-line"}`} />)}
      </div>
      <h2 className="serif mb-3 text-2xl font-semibold">{titles[step]}</h2>

      {step === 0 && (
        <div className="space-y-2">
          {candidates.map((s) => (
            <Card key={s.id} onClick={() => pick(s)} className={`flex items-center gap-3 !p-3 ${s.id === shop.id ? "ring-2 ring-primary" : ""}`}>
              <ShopFront type={s.type} status={s.status} name={s.name} colors={s.colors} className="h-14 w-18 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{s.name}</div>
                <div className="text-xs text-muted">{TYPE_LABEL[s.type]} · {s.street}, {s.town}</div>
              </div>
              {s.id === shop.id && <Check className="text-primary" />}
            </Card>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <span className="text-sm text-muted">Your role</span>
            <div className="mt-1 flex gap-2">
              {(["employee", "resident", "other"] as const).map((r) => (
                <button key={r} onClick={() => setRole(r)} className={`press min-h-[44px] flex-1 rounded-full border-2 capitalize ${role === r ? "border-primary bg-primary text-white" : "border-line bg-surface"}`}>{r}</button>
              ))}
            </div>
          </div>
          <Field label="Years of experience in the trade" value={years} onChange={setYears} step={1} />
          <label className="block">
            <span className="text-sm text-muted">Personal contribution: <b className="text-ink">{euro(contribution)}</b></span>
            <input type="range" min={0} max={80000} step={1000} value={contribution} onChange={(e) => setContribution(Number(e.target.value))} className="mt-2 w-full accent-[var(--primary-dark)]" />
          </label>
          <Field label="Monthly salary target (net, €)" value={salary} onChange={setSalary} step={100} />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <p className="text-sm text-muted">Prefilled from the shop's accounts. Edit if needed.</p>
          <Field label="Asking price (€)" value={nums.price} onChange={(price) => setNums({ ...nums, price })} />
          <Field label="Yearly revenue (€)" value={nums.revenue} onChange={(revenue) => setNums({ ...nums, revenue })} />
          <Field label="EBITDA (€)" value={nums.ebitda} onChange={(ebitda) => setNums({ ...nums, ebitda })} />
          <Field label="Monthly rent (€)" value={nums.rent} onChange={(rent) => setNums({ ...nums, rent })} step={50} />
          <Field label="Staff" value={nums.staff} onChange={(staff) => setNums({ ...nums, staff })} step={1} />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          {!bank && running === null && (
            <Card>
              <p>The AI co-pilot reads the accounts, values the shop and writes a file your banker can read in five minutes.</p>
              <Btn kind="accent" className="mt-4 w-full" onClick={generate}>Generate my bank file</Btn>
            </Card>
          )}
          {running !== null && (
            <Card>
              <ul className="space-y-3">
                {STEPS.map((s, i) => (
                  <motion.li key={s} initial={{ opacity: 0.35 }} animate={{ opacity: i <= running ? 1 : 0.35 }} className="flex items-center gap-3">
                    {i < running ? <Check size={20} className="text-primary" /> : i === running ? <Loader2 size={20} className="animate-spin text-primary-dark" /> : <span className="h-5 w-5 rounded-full border-2 border-line" />}
                    <span className={i === running ? "font-semibold" : ""}>{s}</span>
                  </motion.li>
                ))}
              </ul>
            </Card>
          )}
          {bank && <BankFileView shop={shop} bank={bank} val={val} />}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-3">
          <Field label="Raise target (€)" value={target} onChange={setTarget} />
          <Field label="Duration (days)" value={days} onChange={setDays} step={1} />
          <label className="block">
            <span className="text-sm text-muted">Perks for co-owners (comma separated)</span>
            <textarea value={perks} onChange={(e) => setPerks(e.target.value)} rows={3} className="mt-1 w-full rounded-2xl border border-line bg-surface p-3" />
          </label>
          <Btn kind="accent" className="w-full" onClick={openRaise}>Open the raise</Btn>
          <Trust />
        </div>
      )}

      <div className="sticky -bottom-28 -mx-4 mt-6 flex gap-3 border-t border-line bg-page/95 px-4 pb-8 pt-3 backdrop-blur">
        {step > 0 && <Btn kind="light" className="flex-1" onClick={() => { setStep(step - 1); document.querySelector(".no-scrollbar.flex-1")?.scrollTo({ top: 0 }); }}>Back</Btn>}
        {step < 4 && <Btn className="flex-1" disabled={step === 3 && !bank} onClick={() => { setStep(step + 1); document.querySelector(".no-scrollbar.flex-1")?.scrollTo({ top: 0 }); }}>Next</Btn>}
      </div>
    </Page>
  );
}

export function BankFileView({ shop, bank, val }: { shop: Shop; bank: BankFileResult; val: ValuationResult | null }) {
  const { go } = useStore();
  const total = bank.financingPlan.reduce((a, f) => a + f.amount, 0);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      {val && (
        <Card>
          <h3 className="serif text-lg font-semibold">Valuation</h3>
          <ul className="mt-2 space-y-2">
            {val.methods.map((m) => (
              <li key={m.name}>
                <div className="flex justify-between font-semibold"><span>{m.name}</span><span>{euro(m.value)}</span></div>
                <p className="text-xs text-muted">{m.explanation}</p>
              </li>
            ))}
          </ul>
          <div className="mt-3 rounded-2xl bg-page p-3">
            <div className="flex justify-between"><span>Recommended price</span><b className="text-primary">{euro(val.recommendedPrice)}</b></div>
            <div className="text-sm text-muted">Range {euro(val.range.low)} – {euro(val.range.high)}</div>
            <p className="mt-1 text-sm">{val.comment}</p>
          </div>
        </Card>
      )}
      <Card>
        <h3 className="serif text-lg font-semibold">Financing plan · {euro(total)}</h3>
        <div className="my-2 flex justify-center">
          <Donut data={bank.financingPlan.map((f, i) => ({ label: f.source, value: f.amount, color: planColor(i) }))} size={170} />
        </div>
        <table className="w-full text-sm">
          <tbody>
            {bank.financingPlan.map((f, i) => (
              <tr key={f.source} className="border-t border-line">
                <td className="py-2"><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: planColor(i) }} />{f.source}<div className="text-xs text-muted">{f.note}</div></td>
                <td className="py-2 text-right font-semibold">{euro(f.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card>
        <div className="flex justify-between"><span>Bank loan</span><b>{euro(bank.loan.amount)} · {bank.loan.years} y · {bank.loan.rate}%</b></div>
        <div className="mt-1 flex justify-between"><span>Monthly repayment</span><b className="text-primary">{euro(bank.loan.monthly)}</b></div>
        <div className="mt-3"><DscrGauge value={bank.dscr} /></div>
      </Card>
      <Card>
        <h3 className="serif text-lg font-semibold">Strengths</h3>
        <ul className="mt-2 space-y-2">{bank.strengths.map((s) => <li key={s} className="flex gap-2 text-sm"><Check size={18} className="shrink-0 text-primary" />{s}</li>)}</ul>
        <h3 className="serif mt-4 text-lg font-semibold">Risks and mitigations</h3>
        <ul className="mt-2 space-y-2">{bank.risks.map((r) => <li key={r.risk} className="text-sm"><b>{r.risk}.</b> <span className="text-muted">{r.mitigation}</span></li>)}</ul>
      </Card>
      <Card>
        <h3 className="serif text-lg font-semibold">Executive summary for the banker</h3>
        <p className="mt-2 text-sm leading-relaxed">{bank.executiveSummary}</p>
      </Card>
      <Btn className="flex w-full items-center justify-center gap-2" onClick={() => void import("../lib/pdf").then((m) => m.downloadBankFilePdf(shop, bank, val))}>
        <FileDown size={18} /> Download bank file (PDF)
      </Btn>
      <button onClick={() => go({ name: "gap", shopId: shop.id })} className="press min-h-[44px] w-full rounded-2xl text-center font-semibold text-primary-dark underline">
        Funding gap? Close the gap
      </button>
    </motion.div>
  );
}
