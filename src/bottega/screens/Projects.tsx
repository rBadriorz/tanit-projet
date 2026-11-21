import { useMemo, useState } from "react";
import type { Screen, Shop } from "../types";
import { useStore } from "../store";
import { ShopCard } from "../components/ShopCard";
import { Btn } from "../components/ui";

const SEGMENTS: { label: string; test: (s: Shop) => boolean }[] = [
  { label: "Raising", test: (s) => s.status === "raising" },
  { label: "Looking for a lead buyer", test: (s) => s.status === "seeking" || s.status === "flagged" },
  { label: "Saved", test: (s) => s.status === "taken_over" },
];

export default function Projects(_p: { screen: Screen }) {
  const { shops, go } = useStore();
  const [seg, setSeg] = useState(0);
  const list = useMemo(() => shops.filter(SEGMENTS[seg]!.test), [shops, seg]);
  return (
    <div className="no-scrollbar absolute inset-0 overflow-y-auto px-4 pb-8">
      <h1 className="serif pt-3 text-3xl font-semibold">Projects</h1>
      <div className="mt-3 flex gap-1 rounded-2xl bg-paper p-1 shadow-sm" role="tablist">
        {SEGMENTS.map((s, i) => (
          <button key={s.label} role="tab" aria-selected={seg === i} onClick={() => setSeg(i)}
            className={`press min-h-[44px] flex-1 rounded-xl px-2 text-xs font-semibold leading-tight ${seg === i ? "bg-fir text-white" : "text-muted"}`}>
            {s.label}
          </button>
        ))}
      </div>
      <Btn kind="accent" className="mt-4 w-full" onClick={() => go({ name: "takeover" })}>Start a takeover</Btn>
      <div className="mt-4 space-y-3">
        {list.length === 0 && <p className="py-8 text-center text-muted">No projects here yet.</p>}
        {list.map((s) => <ShopCard key={s.id} shop={s} onOpen={() => go({ name: "shop", id: s.id })} />)}
      </div>
    </div>
  );
}
