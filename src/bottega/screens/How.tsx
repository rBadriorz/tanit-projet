import { useState } from "react";
import type { Screen } from "../types";
import { Btn, Page } from "../components/ui";
import { useStore } from "../store";
import { PARTNER } from "../config";

const CARDS = [
  { n: "1", title: "Find the shops about to close", text: "The map shows shops whose owners are retiring with no successor, and the ones neighbours have flagged.", color: "#C2452D" },
  { n: "2", title: "Take over with your neighbours", text: `A lead buyer keeps the majority and runs the shop. Residents join the capital from €100 through ${PARTNER}. One company per shop, not a fund.`, color: "#1B2A4A" },
  { n: "3", title: "AI builds the bank file", text: "Our co-pilot values the shop, builds the financing plan, finds grants and writes the file the bank needs.", color: "#E9B949" },
];

export default function How(_p: { screen: Screen }) {
  const st = useStore();
  const [i, setI] = useState(0);
  return (
    <Page title="How it works">
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2"
        onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / (e.currentTarget.clientWidth * 0.86)))}>
        {CARDS.map((c) => (
          <div key={c.n} className="flex h-[420px] w-[86%] shrink-0 snap-center flex-col rounded-[28px] p-6 text-white" style={{ background: c.color }}>
            <div className="serif text-7xl font-semibold opacity-60">{c.n}</div>
            <h2 className="serif mt-auto text-3xl font-semibold leading-tight" style={{ color: c.color === "#E9B949" ? "#1E1E1E" : undefined }}>{c.title}</h2>
            <p className="mt-3 text-base leading-snug" style={{ color: c.color === "#E9B949" ? "#1E1E1E" : undefined }}>{c.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-2">{CARDS.map((c, k) => <span key={c.n} className={`h-2 rounded-full ${k === i ? "w-6 bg-fir" : "w-2 bg-line"}`} />)}</div>
      <Btn kind="primary" className="mt-6 w-full" onClick={() => st.tab({ name: "map" })}>Open the map</Btn>
    </Page>
  );
}
