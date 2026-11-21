import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Check, X, Loader2, Landmark, Info } from "lucide-react";
import type { Screen } from "../types";
import { APP_NAME } from "../config";
import { Btn, Card, Page, Trust } from "../components/ui";
import { Donut } from "../components/Donut";
import { euro, useStore } from "../store";
import { runAgent, withSteps } from "../lib/agent";
import { dscrOf, monthly, scriptedBankFile, scriptedSubsidies, type SubsidyResult } from "../data/scripted";
import { DscrGauge, planColor } from "./Takeover";
import { P } from "../theme";

const BANKS = [
  { id: "A", name: "Banque Partenaire A", rate: 3.4, years: 7, max: 120000, cond: "Raise at 60% or more, Bpifrance guarantee" },
  { id: "B", name: "Banque Partenaire B", rate: 3.6, years: 7, max: 140000, cond: "Business account moved to the bank" },
  { id: "C", name: "Banque Partenaire C", rate: 3.9, years: 10, max: 150000, cond: "Longer duration, lower monthly cost" },
];
const MARKET_RATE = 4.2;
const SEARCH_STEPS = ["Searching French and EU schemes…", "Checking eligibility", "Estimating amounts"];
const TYPE_LABEL = { grant: "Grant", honour_loan: "Honour loan", guarantee: "Guarantee", tax_relief: "Tax relief", loan: "Loan" } as const;

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${on ? "bg-primary" : "bg-line"}`}>
      <motion.span layout className="absolute top-1 h-6 w-6 rounded-full bg-white shadow" style={{ left: on ? 28 : 4 }} />
    </button>
  );
}

export default function Gap({ screen }: { screen: Screen }) {
  const store = useStore();
  const shop = store.shop(screen.name === "gap" ? screen.shopId : "marche");
  const [bankId, setBankId] = useState("A");
  const [pre, setPre] = useState<Record<string, boolean>>({});
  const [extend, setExtend] = useState(false);
  const [seller, setSeller] = useState(false);
  const [subs, setSubs] = useState<SubsidyResult | null>(null);
  const [searching, setSearching] = useState(0);
  const [included, setIncluded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!shop) return;
    let alive = true;
    const input = { shopType: shop.type, town: shop.town, street: shop.street, leadBuyer: shop.leadBuyer, amountNeeded: (shop.price ?? 150000) * 1.083, cooperative: shop.legalForm === "SCIC" };
    void withSteps(SEARCH_STEPS, (i) => alive && setSearching(i), runAgent("subsidy", input, () => scriptedSubsidies(shop), { mode: store.aiMode }), 600).then((r) => {
      if (!alive) return;
      store.setAiLast(r.source);
      setSubs(r.data);
      setIncluded(Object.fromEntries(r.data.matches.map((m) => [m.name, m.estimatedAmount > 0])));
    });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shop?.id]);

  const calc = useMemo(() => {
    if (!shop) return null;
    const base = scriptedBankFile(shop);
    const price = shop.price ?? 150000;
    const need = base.financingPlan.reduce((a, f) => a + f.amount, 0);
    const equity = base.financingPlan[0]?.amount ?? 0;
    const target = shop.raise?.target ?? Math.round(price * 0.22 / 1000) * 1000;
    const raised = shop.raise?.raised ?? 0;
    const daysLeft = shop.raise?.daysLeft ?? 45;
    const elapsed = Math.max(1, 45 - daysLeft);
    // Conservative: raises slow down after launch, so the pace is halved for the remaining days.
    const pace = (raised / elapsed) * 0.5;
    const projected = Math.min(target, Math.round(raised + pace * daysLeft + (extend ? pace * 15 : 0)));
    const gap = Math.max(0, target - projected);
    const grants = (subs?.matches ?? []).filter((m) => included[m.name] && m.estimatedAmount > 0);
    const grantsTotal = grants.reduce((a, m) => a + m.estimatedAmount, 0);
    const honour = grants.filter((m) => m.type === "honour_loan").reduce((a, m) => a + m.estimatedAmount, 0);
    const sellerCredit = seller ? Math.round(price * 0.1) : 0;
    const bank = BANKS.find((b) => b.id === bankId) ?? BANKS[0]!;
    const wanted = Math.max(0, need - equity - projected - grantsTotal - sellerCredit);
    const loan = Math.min(bank.max, wanted);
    const missing = wanted - loan;
    const m = Math.round(monthly(loan, bank.rate, bank.years));
    const plan = [
      { label: "Lead buyer's equity", value: equity },
      { label: "Neighbours (projected)", value: projected },
      ...grants.map((g) => ({ label: (g.name.split(/[:(]/)[0] ?? g.name).trim(), value: g.estimatedAmount })),
      ...(sellerCredit ? [{ label: "Seller credit (3 years)", value: sellerCredit }] : []),
      { label: `${bank.name} loan`, value: loan },
      ...(missing > 0 ? [{ label: "Still to find", value: missing }] : []),
    ].map((p, i, all) => ({ ...p, color: p.label === "Still to find" ? P.border : planColor(i), last: i === all.length - 1 }));
    return {
      need, target, raised, daysLeft, projected, gap, plan, loan, missing, bank, monthly: m,
      marketMonthly: Math.round(monthly(loan, MARKET_RATE, bank.years)),
      dscr: dscrOf(shop.ebitda ?? 35000, m, honour, 6000, sellerCredit),
      fee: Math.round(target * 0.05), referral: Math.round(loan * 0.01),
    };
  }, [shop, subs, included, extend, seller, bankId]);

  if (!shop || !calc) return <Page title="Close the gap">No shop found.</Page>;

  return (
    <Page title="Close the gap">
      <Card>
        <div className="text-sm text-muted">{shop.name}</div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          <div><div className="serif text-xl font-semibold">{euro(calc.target)}</div><div className="text-xs text-muted">target</div></div>
          <div><div className="serif text-xl font-semibold text-primary">{euro(calc.raised)}</div><div className="text-xs text-muted">raised</div></div>
          <div><div className="serif text-xl font-semibold">{calc.daysLeft}</div><div className="text-xs text-muted">days left</div></div>
        </div>
        <div className={`mt-3 rounded-2xl p-3 text-sm ${calc.gap > 0 ? "bg-primary-dark/10" : "bg-primary/10"}`}>
          {calc.gap > 0
            ? <>At the current pace, this project may miss its target by <b className="text-primary-dark">{euro(calc.gap)}</b>. Here's how to close it.</>
            : <>At the current pace, the raise should reach its target. The levers below can still lower the loan.</>}
        </div>
      </Card>

      <Card className="mt-3">
        <h3 className="serif text-lg font-semibold">Your financing plan · {euro(calc.need)}</h3>
        <div className="my-2 flex justify-center"><Donut data={calc.plan} size={170} legend={false} /></div>
        <ul className="space-y-1 text-sm">
          {calc.plan.map((p) => (
            <li key={p.label} className="flex justify-between gap-2">
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: p.color }} />{p.label}</span>
              <b className={p.label === "Still to find" ? "text-primary-dark" : ""}>{euro(p.value)}</b>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between text-sm"><span>Monthly repayment</span><b className="text-primary">{euro(calc.monthly)}</b></div>
        <div className="text-xs text-muted">vs {euro(calc.marketMonthly)} at the {MARKET_RATE}% market rate</div>
        <div className="mt-3"><DscrGauge value={calc.dscr} /></div>
      </Card>

      <h3 className="serif mt-5 text-xl font-semibold">1. Partner bank, preferential loan</h3>
      <p className="text-sm text-muted">The neighbours' raise proves demand and adds equity, so partner banks offer a better rate.</p>
      <div className="mt-2 space-y-2">
        {BANKS.map((b) => (
          <Card key={b.id} onClick={() => setBankId(b.id)} className={bankId === b.id ? "ring-2 ring-primary" : ""}>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-page"><Landmark size={20} className="text-primary" /></div>
              <div className="flex-1">
                <div className="font-semibold">{b.name}</div>
                <div className="text-xs text-muted">{b.cond}</div>
              </div>
              <div className="text-right"><div className="serif text-xl font-semibold text-primary">{b.rate}%</div><div className="text-xs text-muted">{b.years} y · max {euro(b.max)}</div></div>
            </div>
            {bankId === b.id && (
              pre[b.id]
                ? <div className="mt-3 rounded-xl bg-primary/10 p-2 text-center text-sm font-semibold text-primary">Pre-approval in 48h</div>
                : <Btn kind="ghost" className="mt-3 w-full" onClick={() => setPre({ ...pre, [b.id]: true })}>Request a pre-approval (simulated)</Btn>
            )}
          </Card>
        ))}
      </div>
      <div className="mt-2 flex gap-2 rounded-2xl bg-warning/20 p-3 text-xs"><Info size={16} className="shrink-0" />{APP_NAME} is paid a referral fee by the partner bank. It does not change your rate.</div>

      <h3 className="serif mt-5 text-xl font-semibold">2. Public grants and honour loans</h3>
      {!subs ? (
        <Card className="mt-2">
          <ul className="space-y-2">
            {SEARCH_STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-2 text-sm" style={{ opacity: i <= searching ? 1 : 0.35 }}>
                {i < searching ? <Check size={18} className="text-primary" /> : <Loader2 size={18} className={i === searching ? "animate-spin text-primary-dark" : ""} />}{s}
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <div className="mt-2 space-y-2">
          <p className="text-sm text-muted">You may be eligible for:</p>
          {subs.matches.map((m) => (
            <Card key={m.name}>
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-1 text-[11px] font-semibold">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{TYPE_LABEL[m.type]}</span>
                    <span className="rounded-full bg-page px-2 py-0.5">{m.level === "EU" ? "EU" : m.level.charAt(0).toUpperCase() + m.level.slice(1)}</span>
                  </div>
                  <div className="mt-1 font-semibold leading-snug">{m.name}</div>
                  <div className="text-sm text-primary-dark">{m.range}</div>
                </div>
                {m.estimatedAmount > 0 && <Toggle label={`Include ${m.name}`} on={!!included[m.name]} onChange={(v) => setIncluded({ ...included, [m.name]: v })} />}
              </div>
              <p className="mt-2 text-sm">{m.why}</p>
              <ul className="mt-2 space-y-1 text-xs">
                {m.eligibility.map((e) => <li key={e.criterion} className="flex items-center gap-1.5">{e.met ? <Check size={14} className="text-success" /> : <X size={14} className="text-danger" />}{e.criterion}</li>)}
              </ul>
              <details className="mt-2 text-xs"><summary className="cursor-pointer font-semibold text-primary">How to apply</summary><ol className="mt-1 list-decimal pl-4">{m.howToApply.map((h) => <li key={h}>{h}</li>)}</ol></details>
            </Card>
          ))}
          <p className="text-xs text-muted">{subs.caveat}</p>
        </div>
      )}

      <h3 className="serif mt-5 text-xl font-semibold">3. More time, or a seller credit</h3>
      <Card className="mt-2 space-y-4">
        <div className="flex items-center gap-3"><div className="flex-1"><div className="font-semibold">Extend the raise (+15 days)</div><div className="text-xs text-muted">More neighbours can join.</div></div><Toggle label="Extend the raise" on={extend} onChange={setExtend} /></div>
        <div className="flex items-center gap-3"><div className="flex-1"><div className="font-semibold">Seller credit</div><div className="text-xs text-muted">{shop.owner.firstName} lends 10% of the price, paid back over 3 years.</div></div><Toggle label="Seller credit" on={seller} onChange={setSeller} /></div>
      </Card>

      <Card className="mt-5">
        <h3 className="serif text-lg font-semibold">Revenue per takeover</h3>
        <table className="mt-2 w-full text-sm"><tbody>
          <tr className="border-t border-line"><td className="py-1.5">Raise fee 5% × {euro(calc.target)}</td><td className="text-right font-semibold">{euro(calc.fee)}</td></tr>
          <tr className="border-t border-line"><td className="py-1.5">Bank referral 1% × {euro(calc.loan)}</td><td className="text-right font-semibold">{euro(calc.referral)}</td></tr>
          <tr className="border-t border-line"><td className="py-1.5">Shared services €150 × 12</td><td className="text-right font-semibold">€1,800/year</td></tr>
        </tbody></table>
      </Card>
      <Trust className="mt-4" />
    </Page>
  );
}
