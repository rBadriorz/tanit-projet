import { motion } from "framer-motion";
import type { Screen } from "../types";
import { Card, Page } from "../components/ui";
import { euro, useStore } from "../store";
import { STATS } from "../data/stats";

const MONTHS = [["Jun", 2], ["Jul", 3], ["Aug", 2], ["Sep", 5], ["Oct", 7], ["Nov", 9]] as const;

export default function Impact(_p: { screen: Screen }) {
  const { contributions } = useStore();
  const big = [
    { label: "Shops saved", value: STATS.shopsSaved.toLocaleString("en-GB") },
    { label: "Jobs kept", value: STATS.jobsKept.toLocaleString("en-GB") },
    { label: "Neighbours co-owners", value: (STATS.coOwners + contributions.filter((c) => c.status === "approved").length).toLocaleString("en-GB") },
    { label: "Raised locally", value: euro(STATS.raisedLocally + contributions.filter((c) => c.status === "approved").reduce((a, c) => a + c.amount, 0)) },
  ];
  const max = Math.max(...MONTHS.map((m) => m[1]));
  return (
    <Page title="Impact">
      <div className="grid grid-cols-2 gap-3">
        {big.map((b) => (
          <Card key={b.label}>
            <div className="serif text-[26px] font-semibold text-primary">{b.value}</div>
            <div className="text-xs text-muted">{b.label}</div>
          </Card>
        ))}
      </div>
      <Card className="mt-3">
        <div className="font-semibold">Takeovers per month</div>
        <div className="mt-3 flex h-32 items-end gap-3">
          {MONTHS.map(([m, v], i) => (
            <div key={m} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs font-semibold text-primary">{v}</span>
              <motion.div className="w-full rounded-t-lg bg-primary" initial={{ height: 0 }} animate={{ height: `${(v / max) * 88}px` }} transition={{ delay: i * 0.08 }} />
              <span className="text-[11px] text-muted">{m}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card className="mt-3 !bg-page">
        <p className="serif text-lg leading-snug">More than 500,000 French businesses will need to be handed over within the decade.</p>
        <p className="mt-1 text-xs text-muted">DGE, 2025 · {STATS.seekingInDepartment} shops looking for a successor in Ille-et-Vilaine (demo)</p>
      </Card>
      <Card className="mt-3">
        <div className="font-semibold">Revenue per takeover · Boulangerie de Marcel</div>
        <table className="mt-2 w-full text-sm">
          <tbody>
            <tr className="border-b border-line"><td className="py-2">Raise fee 5% × €40,000</td><td className="text-right font-semibold">€2,000</td></tr>
            <tr className="border-b border-line"><td className="py-2">Bank referral 1% × €110,000</td><td className="text-right font-semibold">€1,100</td></tr>
            <tr><td className="py-2">Shared services €150 × 12</td><td className="text-right font-semibold">€1,800 / year</td></tr>
          </tbody>
        </table>
      </Card>
    </Page>
  );
}
