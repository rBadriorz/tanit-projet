import { motion } from "framer-motion";
import { useState } from "react";
import type { Screen, Shop, ShopType } from "../types";
import { Btn, Card, Page } from "../components/ui";
import { euro, useStore } from "../store";
import { TYPE_LABEL } from "../components/ShopArt";

const TYPES: ShopType[] = ["bakery", "cafe", "butcher", "restaurant", "grocery", "bookshop", "florist", "hairdresser", "cheese", "bar"];
const YEARS = ["Less than 10 years", "10 to 25 years", "25 to 40 years", "More than 40 years"];
const WHEN = ["Within a year", "In 1 to 3 years", "In 3 to 5 years", "I don't know yet"];
const WHO = ["Yes, an employee", "Yes, a family member", "No, nobody yet"];
// Typical small-shop EBITDA by trade (indicative, demo).
const EBITDA: Partial<Record<ShopType, number>> = { bakery: 48000, cafe: 39000, butcher: 61000, restaurant: 42000, grocery: 21000, bookshop: 18000, florist: 19000, hairdresser: 22000, cheese: 33000, bar: 27000 };

export default function Owner(_p: { screen: Screen }) {
  const st = useStore();
  const [step, setStep] = useState(0);
  const [a, setA] = useState<{ type?: ShopType; years?: number; when?: number; who?: number }>({});
  const [placed, setPlaced] = useState<string | null>(null);

  const questions = [
    { q: "What kind of shop do you run?", opts: TYPES.map((t) => TYPE_LABEL[t]), pick: (i: number) => setA({ ...a, type: TYPES[i]! }) },
    { q: "How long have you run it?", opts: YEARS, pick: (i: number) => setA({ ...a, years: i }) },
    { q: "When would you like to retire?", opts: WHEN, pick: (i: number) => setA({ ...a, when: i }) },
    { q: "Do you have someone in mind?", opts: WHO, pick: (i: number) => setA({ ...a, who: i }) },
  ];

  if (step < 4) {
    const Q = questions[step]!;
    return (
      <Page title="Find a successor">
        <div className="mb-5 flex gap-2">{[0, 1, 2, 3].map((i) => <div key={i} className={`h-2 flex-1 rounded-full ${i <= step ? "bg-terracotta" : "bg-line"}`} />)}</div>
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="serif text-[28px] font-semibold leading-tight">{Q.q}</h2>
          <p className="mt-1 text-base text-muted">Question {step + 1} of 4. Take your time.</p>
          <div className="mt-5 grid gap-3">
            {Q.opts.map((o, i) => (
              <button key={o} onClick={() => { Q.pick(i); setStep(step + 1); }}
                className="press min-h-[60px] rounded-2xl border border-line bg-paper px-5 text-left text-lg font-medium">{o}</button>
            ))}
          </div>
        </motion.div>
      </Page>
    );
  }

  const type = a.type ?? "bakery";
  const e = EBITDA[type] ?? 30000;
  const low = Math.round((e * 3) / 1000) * 1000;
  const high = Math.round((e * 4) / 1000) * 1000;
  const years = [6, 18, 32, 42][a.years ?? 2] ?? 32;

  const put = () => {
    const id = "my-shop-" + Date.now().toString(36);
    const shop: Shop = {
      id, name: `My ${TYPE_LABEL[type].toLowerCase()}`, type, status: "seeking", town: "Rennes", street: "rue de la Visitation",
      lat: 48.1131, lng: -1.6772,
      owner: { firstName: "You", age: 67, yearsInShop: years, quote: "I want my shop to stay open after me." },
      ebitda: e, revenue: e * 6, price: Math.round((low + high) / 2), staff: 2,
      colors: { awning: "#C8623E", facade: "#f3e3cf" }, timelineStep: 1,
    };
    st.addShop(shop);
    st.notify("Your shop is on the map");
    setPlaced(id);
  };

  return (
    <Page title="Your result">
      <h2 className="serif text-[28px] font-semibold leading-tight">Good news: your shop has a future.</h2>
      <Card className="mt-4">
        <p className="text-lg"><b className="text-terracotta">37 neighbours</b> already flagged shops like yours nearby.</p>
      </Card>
      <Card className="mt-3">
        <div className="text-sm text-muted">Estimated value of your {TYPE_LABEL[type].toLowerCase()}</div>
        <div className="serif mt-1 text-3xl font-semibold text-fir">{euro(low)} – {euro(high)}</div>
        <p className="mt-1 text-sm text-muted">A first estimate. Our AI co-pilot refines it with your accounts.</p>
      </Card>
      <Card className="mt-3">
        <div className="text-lg font-semibold">Next steps</div>
        <ol className="mt-2 space-y-2 text-base">
          <li>1. We'll help you find a successor among your staff and your customers.</li>
          <li>2. Your neighbours can join the capital from €100.</li>
          <li>3. We prepare the bank file with your successor.</li>
        </ol>
        {a.who === 0 && <p className="mt-3 rounded-2xl bg-cream p-3 text-base">You have an employee in mind: that is the best start.</p>}
      </Card>
      {!placed ? (
        <Btn kind="accent" className="mt-5 w-full text-lg" onClick={put}>Put my shop on the map</Btn>
      ) : (
        <div className="mt-5 grid gap-3">
          <Btn kind="accent" className="w-full text-lg" onClick={() => st.go({ name: "poster", shopId: placed, kind: "successor" })}>Make a poster</Btn>
          <Btn kind="ghost" className="w-full" onClick={() => st.tab({ name: "map" })}>See it on the map</Btn>
        </div>
      )}
    </Page>
  );
}
