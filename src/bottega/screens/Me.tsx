import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { Screen } from "../types";
import { Avatar, Card } from "../components/ui";
import { euro, useStore } from "../store";

const PREFILLED = [
  { shopId: "marche", name: "Café du Marché", amount: 100, share: "#212", note: "Perk: a coffee each Saturday", status: "Raising" },
  { shopId: "zinc", name: "Le Petit Zinc", amount: 250, share: "#97", note: "Reopened · perk used: 4 coffees", status: "Taken over" },
];

export default function Me(_p: { screen: Screen }) {
  const st = useStore();
  const [notif, setNotif] = useState(true);
  const mine = st.contributions.map((c) => ({
    shopId: c.shopId, name: st.shop(c.shopId)?.name ?? c.shopId, amount: c.amount, share: `#${c.share}`,
    note: st.shop(c.shopId)?.raise?.perks?.[0] ? `Perk: ${st.shop(c.shopId)!.raise!.perks[0]}` : "Co-owner", status: "Raising",
  }));
  const wallet = [...mine, ...PREFILLED];
  const total = wallet.reduce((a, w) => a + w.amount, 0);
  const badges = ["First takeover", "Street saver", ...(mine.length ? ["Founder of a cooperative"] : [])];

  return (
    <div className="no-scrollbar absolute inset-0 overflow-y-auto px-4 pb-6">
      <div className="flex items-center gap-3 pt-2">
        <Avatar name="Léa" size={56} color="#C8623E" />
        <div><h1 className="serif text-3xl font-semibold">Léa</h1><p className="text-sm text-muted">rue de Fougères, Rennes</p></div>
      </div>

      <h2 className="serif mt-6 text-xl font-semibold">My shares</h2>
      <p className="text-sm text-muted">{wallet.length} shops · {euro(total)} invested</p>
      <div className="mt-3 space-y-2">
        {wallet.map((w, i) => (
          <Card key={w.shopId + i} onClick={() => st.go({ name: "shop", id: w.shopId })} className="flex items-center gap-3 !p-3">
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold">{w.name}</div>
              <div className="truncate text-xs text-muted">Share {w.share} · {w.note}</div>
            </div>
            <div className="text-right"><div className="font-bold text-fir">{euro(w.amount)}</div><div className="text-[11px] text-muted">{w.status}</div></div>
          </Card>
        ))}
      </div>

      <h2 className="serif mt-6 text-xl font-semibold">Badges</h2>
      <div className="mt-2 flex flex-wrap gap-2">
        {badges.map((b) => <span key={b} className="rounded-full bg-sun px-3 py-1.5 text-sm font-semibold">★ {b}</span>)}
      </div>

      <h2 className="serif mt-6 text-xl font-semibold">Settings</h2>
      <Card className="mt-2 divide-y divide-line !p-0">
        <Row label="Language" value="English · Français (coming soon)" />
        <Toggle label="Notifications" on={notif} onClick={() => setNotif(!notif)} />
        <Toggle label="Live AI (off = scripted demo answers)" on={st.aiMode === "live"} onClick={() => st.setAiMode(st.aiMode === "live" ? "scripted" : "live")} />
      </Card>
      <Card className="mt-3 divide-y divide-line !p-0">
        <Link label="Create a poster" onClick={() => st.go({ name: "poster", shopId: "martin", kind: "successor" })} />
        <Link label="Impact" onClick={() => st.go({ name: "impact" })} />
        <Link label="About & risks" onClick={() => st.go({ name: "about" })} />
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex min-h-[52px] items-center justify-between gap-3 px-4 text-sm"><span>{label}</span><span className="text-right text-muted">{value}</span></div>;
}
function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button role="switch" aria-checked={on} onClick={onClick} className="flex min-h-[52px] w-full items-center justify-between gap-3 px-4 text-left text-sm">
      <span>{label}</span>
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition ${on ? "bg-fir" : "bg-line"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${on ? "left-6" : "left-1"}`} /></span>
    </button>
  );
}
function Link({ label, onClick }: { label: string; onClick: () => void }) {
  return <button onClick={onClick} className="flex min-h-[52px] w-full items-center justify-between px-4 text-left text-sm font-medium">{label}<ChevronRight size={18} className="text-muted" /></button>;
}
