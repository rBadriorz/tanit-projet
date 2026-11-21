import { useState } from "react";
import type { Screen, Shop, ShopType } from "../types";
import { Btn, Page } from "../components/ui";
import { useStore } from "../store";
import { TYPE_LABEL } from "../components/ShopArt";

const REASONS = ["The owner told me they're retiring", "For sale sign", "Closed for weeks"];
const TYPES: ShopType[] = ["bakery", "cafe", "butcher", "grocery", "restaurant", "bookshop", "bar"];

export default function Flag(_p: { screen: Screen }) {
  const st = useStore();
  const [reason, setReason] = useState<string>(REASONS[0]!);
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [type, setType] = useState<ShopType>("bakery");
  const [msg, setMsg] = useState("");

  const submit = () => {
    const id = "flag-" + Date.now().toString(36);
    const shop: Shop = {
      id, name: name.trim() || `${TYPE_LABEL[type]} on ${street.trim() || "my street"}`, type, status: "flagged",
      town: "Rennes", street: street.trim() || "rue Saint-Georges",
      lat: 48.112 + (Math.random() - 0.5) * 0.003, lng: -1.679 + (Math.random() - 0.5) * 0.003,
      owner: { firstName: "", age: 0, yearsInShop: 0, quote: msg.trim() || reason },
      flaggedBy: 1, colors: { awning: "#E9B949", facade: "#f6ecd2" },
    };
    st.addShop(shop);
    st.notify("Flagged by you. Neighbours can now tap “I'd join too”.");
    st.tab({ name: "map" });
  };

  return (
    <Page title="Flag a shop">
      <p className="text-base text-muted">A shop near you might close? Tell the neighbourhood.</p>
      <div className="mt-4 text-sm font-semibold text-muted">Why?</div>
      <div className="mt-2 grid gap-2">
        {REASONS.map((r) => (
          <button key={r} onClick={() => setReason(r)} aria-pressed={reason === r}
            className={`press min-h-[52px] rounded-2xl px-4 text-left ${reason === r ? "bg-sun font-semibold" : "border border-line bg-paper"}`}>{r}</button>
        ))}
      </div>
      <div className="mt-4 text-sm font-semibold text-muted">Type of shop</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button key={t} onClick={() => setType(t)} className={`press min-h-[44px] rounded-full px-4 text-sm ${type === t ? "bg-fir text-white" : "bg-paper shadow-sm"}`}>{TYPE_LABEL[t]}</button>
        ))}
      </div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Shop name (optional)" className="mt-4 min-h-[50px] w-full rounded-2xl border border-line bg-paper px-4" />
      <input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Street" className="mt-3 min-h-[50px] w-full rounded-2xl border border-line bg-paper px-4" />
      <textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="A message for the neighbours (optional)" rows={3} className="mt-3 w-full rounded-2xl border border-line bg-paper p-4" />
      <Btn kind="accent" className="mt-5 w-full" onClick={submit}>Flag this shop</Btn>
    </Page>
  );
}
