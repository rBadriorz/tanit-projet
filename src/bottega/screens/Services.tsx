import { useState } from "react";
import { Calculator, Scale, Users, ShoppingBasket, Vote, Check } from "lucide-react";
import type { Screen } from "../types";
import { Btn, Card } from "../components/ui";
import { useStore } from "../store";
import { APP_NAME } from "../config";
import { P } from "../theme";

const INCLUDED = [
  { Icon: Calculator, title: "Accounting", text: "Monthly close, VAT returns" },
  { Icon: Scale, title: "Legal assistant", text: "AI answers + human lawyer hotline" },
  { Icon: Users, title: "Mentor network", text: "Retired owners like Marcel coach the new ones" },
  { Icon: ShoppingBasket, title: "Group purchasing", text: "Flour, coffee, energy at shared prices" },
  { Icon: Vote, title: "Annual general meeting", text: "Votes for all co-owners, in the app" },
];
const TODO = ["Send Q4 figures to the co-owners", "Order flour (group price ends Friday)", "Prepare the AGM agenda", "Mentor session with Marcel, Tuesday 3pm"];

export default function Services(_p: { screen: Screen }) {
  const st = useStore();
  const [done, setDone] = useState<Record<number, boolean>>({ 0: true });
  return (
    <div className="no-scrollbar absolute inset-0 overflow-y-auto px-4 pb-6">
      <h1 className="serif pt-2 text-3xl font-semibold">Services</h1>
      <p className="text-sm text-muted">For shops that have been taken over</p>

      <Card className="mt-4 !bg-primary text-white">
        <div className="text-sm opacity-80">Subscription</div>
        <div className="serif text-2xl font-semibold">{APP_NAME} Services</div>
        <div className="mt-1 text-3xl font-bold">€150<span className="text-base font-normal opacity-80"> / month</span></div>
        <div className="mt-3 rounded-2xl bg-success p-3 text-sm text-white">Group purchasing: <b>saved €2,140 this year</b></div>
      </Card>

      <div className="mt-4 space-y-2">
        {INCLUDED.map(({ Icon, title, text }) => (
          <Card key={title} className="flex items-center gap-3 !p-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-page text-primary"><Icon size={22} /></div>
            <div><div className="font-semibold">{title}</div><div className="text-sm text-muted">{text}</div></div>
          </Card>
        ))}
      </div>
      <Btn kind="accent" className="mt-4 w-full" onClick={() => st.go({ name: "legal" })}>Ask the legal assistant</Btn>

      <h2 className="serif mt-7 text-xl font-semibold">Karim's bakery, this month</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Card><div className="text-xs text-muted">Revenue, November</div><div className="text-2xl font-bold text-primary">€27,900</div><div className="text-xs text-primary">+6% vs last year</div></Card>
        <Card><div className="text-xs text-muted">Co-owners</div><div className="text-2xl font-bold text-primary">188</div><div className="text-xs text-muted">Next AGM 14 Mar 2027</div></Card>
      </div>
      <Card className="mt-3">
        <svg viewBox="0 0 300 80" className="w-full" role="img" aria-label="Revenue this year versus last year">
          {[22, 24, 23, 25, 26, 24, 27, 26, 25, 27, 28].map((v, i) => (
            <g key={i}><rect x={i * 27 + 4} y={80 - (v - 15) * 5} width="10" height={(v - 15) * 5} rx="2" fill={P.primaryDark} />
              <rect x={i * 27 + 15} y={80 - (v - 16.5) * 5} width="8" height={(v - 16.5) * 5} rx="2" fill={P.border} /></g>
          ))}
        </svg>
        <div className="mt-1 flex gap-4 text-xs text-muted"><span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-primary" />2026</span><span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-line" />2025</span></div>
      </Card>
      <Card className="mt-3">
        <div className="font-semibold">To do</div>
        <ul className="mt-2 space-y-1">
          {TODO.map((t, i) => (
            <li key={t}>
              <button onClick={() => setDone({ ...done, [i]: !done[i] })} className="flex min-h-[44px] w-full items-center gap-3 text-left text-sm">
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 ${done[i] ? "border-primary bg-primary text-white" : "border-line"}`}>{done[i] && <Check size={14} />}</span>
                <span className={done[i] ? "text-muted line-through" : ""}>{t}</span>
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
