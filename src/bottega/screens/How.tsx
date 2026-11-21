import { useState } from "react";
import type { Screen } from "../types";
import { Btn, Page } from "../components/ui";
import { useStore } from "../store";
import { PARTNER } from "../config";
import { AI_PITCH, AiTeam } from "../components/AiTeam";
import { P } from "../theme";

const CARDS = [
  { n: "1", title: "Find the shops about to close", text: "The map shows shops whose owners are retiring with no successor, and the ones neighbours have flagged.", color: P.primary },
  { n: "2", title: "Take over with your neighbours", text: `A lead buyer keeps the majority and runs the shop. Residents join the capital from €100 through ${PARTNER}. One company per shop, not a fund.`, color: P.primaryDark },
  { n: "3", title: AI_PITCH, text: "Meet your AI takeover team below.", color: P.warning },
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
            <h2 className={`serif mt-auto font-semibold leading-tight ${c.title.length > 60 ? "text-2xl" : "text-3xl"}`} style={{ color: c.color === P.warning ? P.text : undefined }}>{c.title}</h2>
            <p className="mt-3 text-base leading-snug" style={{ color: c.color === P.warning ? P.text : undefined }}>{c.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-2">{CARDS.map((c, k) => <span key={c.n} className={`h-2 rounded-full ${k === i ? "w-6 bg-primary" : "w-2 bg-line"}`} />)}</div>
      <AiTeam className="mt-6" />
      <Btn kind="primary" className="mt-6 w-full" onClick={() => st.tab({ name: "map" })}>Open the map</Btn>
    </Page>
  );
}
