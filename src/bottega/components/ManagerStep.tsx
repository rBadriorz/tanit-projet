import { motion } from "framer-motion";
import { useState } from "react";
import { Check, ChevronRight, Printer, Search, UserRound } from "lucide-react";
import { APP_NAME } from "../config";
import { CANDIDATES } from "../data/candidates";
import { useStore } from "../store";
import type { Manager, ManagerWanted, Shop } from "../types";
import { TYPE_LABEL } from "./ShopArt";
import { Avatar, Btn, Card } from "./ui";
import { Mark } from "./Logo";

const ROLES: { id: Manager["role"]; label: string }[] = [
  { id: "me", label: "Me" },
  { id: "colleague", label: "A colleague" },
  { id: "family", label: "A family member" },
];

/** Speech bubble from the assistant (the app's friendly explainer). */
export function AssistantSays({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-white" aria-hidden><Mark size={26} /></span>
      <div className="rounded-2xl rounded-tl-md border border-line bg-primary-light px-3 py-2 text-sm">
        <b>{APP_NAME}</b> · {children}
      </div>
    </div>
  );
}

/** Banks lend to a person as much as to a shop: shown when the manager is still to recruit. */
export const BANK_MANAGER_NOTE =
  "Banks want to know who will run the shop before they lend. The loan is approved once the manager is recruited, so this step stays pending until then.";

function Input({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-sm text-muted">{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-12 w-full rounded-2xl border border-line bg-surface px-4" />
    </label>
  );
}

/** "Who will run the shop?" step of the takeover wizard. Calls onReady once the choice is saved. */
export function ManagerStep({ shop, onReady }: { shop: Shop; onReady: () => void }) {
  const st = useStore();
  const trade = TYPE_LABEL[shop.type].toLowerCase();
  const [mode, setMode] = useState<"choose" | "have" | "looking" | "listed">(shop.manager ? "have" : shop.managerWanted ? "listed" : "choose");

  // "I have a manager"
  const [m, setM] = useState<Manager>(shop.manager ?? { name: shop.leadBuyer?.firstName ?? "", role: "me", years: shop.leadBuyer?.yearsExperience ?? 5, pitch: "" });
  const [saved, setSaved] = useState(!!shop.manager);
  // "I'm looking for a manager"
  const [w, setW] = useState<ManagerWanted>(shop.managerWanted ?? {
    trade: shop.type === "bakery" ? "Baker" : TYPE_LABEL[shop.type], experience: "3+ years in the trade",
    hours: "Full time, 5 days a week", salary: "€2,000 – €2,400 net / month", canBeShareholder: true,
  });

  const saveManager = () => {
    st.patchShop(shop.id, { manager: { ...m, name: m.name.trim() || "Me" }, managerWanted: undefined });
    setSaved(true);
    st.notify(`${m.name.trim() || "You"} will run ${shop.name}`);
    onReady();
  };
  const publish = () => {
    st.patchShop(shop.id, { managerWanted: w, manager: undefined });
    setMode("listed");
    st.notify(`"Wanted: manager" listing published for ${shop.name}`);
    onReady();
  };

  if (mode === "choose") {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted">Someone has to open the shop every morning. Tell us who.</p>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => setMode("have")} className="w-full rounded-3xl bg-primary p-5 text-left text-white">
          <span className="flex items-center gap-2 text-xl font-semibold"><UserRound size={22} /> I have a manager</span>
          <span className="mt-1 block text-sm opacity-90">Me or someone I know will run it day to day.</span>
        </motion.button>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => setMode("looking")} className="w-full rounded-3xl bg-primary-dark p-5 text-left text-white">
          <span className="flex items-center gap-2 text-xl font-semibold"><Search size={22} /> I'm looking for a manager</span>
          <span className="mt-1 block text-sm opacity-90">I want to save this shop and invest, but someone else should run it.</span>
        </motion.button>
      </div>
    );
  }

  if (mode === "have") {
    return (
      <div className="space-y-3">
        <button onClick={() => setMode("choose")} className="text-sm text-primary underline">Change my answer</button>
        <Input label="Manager's name" value={m.name} onChange={(name) => { setM({ ...m, name }); setSaved(false); }} placeholder="e.g. Karim" />
        <div>
          <span className="text-sm text-muted">Role</span>
          <div className="mt-1 flex gap-2">
            {ROLES.map((r) => (
              <button key={r.id} onClick={() => { setM({ ...m, role: r.id }); setSaved(false); }}
                className={`press min-h-[44px] flex-1 rounded-full border-2 text-sm ${m.role === r.id ? "border-primary bg-primary text-white" : "border-line bg-surface"}`}>{r.label}</button>
            ))}
          </div>
        </div>
        <Input label={`Years of experience as a ${trade} worker`} type="number" value={String(m.years)} onChange={(v) => { setM({ ...m, years: Number(v) || 0 }); setSaved(false); }} />
        <Input label="One-line pitch" value={m.pitch} onChange={(pitch) => { setM({ ...m, pitch }); setSaved(false); }} placeholder="e.g. Nine years at this oven, I know every regular." />
        <Btn className="w-full" disabled={!m.name.trim()} onClick={saveManager}>{saved ? <span className="flex items-center justify-center gap-2"><Check size={18} /> Saved, tap Next</span> : "Save the manager"}</Btn>
        <p className="text-xs text-muted">The manager appears in the bank file and on the shop page ("Run by …").</p>
      </div>
    );
  }

  if (mode === "looking") {
    return (
      <div className="space-y-3">
        <button onClick={() => setMode("choose")} className="text-sm text-primary underline">Change my answer</button>
        <Input label="Trade" value={w.trade} onChange={(trade) => setW({ ...w, trade })} />
        <Input label="Experience wanted" value={w.experience} onChange={(experience) => setW({ ...w, experience })} />
        <Input label="Hours" value={w.hours} onChange={(hours) => setW({ ...w, hours })} />
        <Input label="Salary range" value={w.salary} onChange={(salary) => setW({ ...w, salary })} />
        <label className="flex min-h-[52px] items-center justify-between rounded-2xl bg-surface px-4 text-sm">
          The manager can also become a shareholder
          <input type="checkbox" checked={w.canBeShareholder} onChange={(e) => setW({ ...w, canBeShareholder: e.target.checked })} className="h-6 w-6 accent-[var(--primary)]" />
        </label>
        <Btn className="w-full" onClick={publish}>Publish the "Wanted: manager" listing</Btn>
      </div>
    );
  }

  // Listed: listing summary, poster, candidates, and the pending step.
  const wanted = shop.managerWanted ?? w;
  return (
    <div className="space-y-3">
      <Card className="border-2 border-warning">
        <div className="text-xs font-semibold uppercase tracking-wide text-primary-dark">Wanted: manager · on the map</div>
        <div className="serif mt-1 text-lg font-semibold">{shop.name} is looking for its next manager</div>
        <ul className="mt-2 space-y-1 text-sm">
          <li>{wanted.trade} · {wanted.experience}</li>
          <li>{wanted.hours} · {wanted.salary}</li>
          <li>{wanted.canBeShareholder ? "Can also become a shareholder" : "Salaried role"}</li>
        </ul>
        <div className="mt-3 flex gap-2">
          <Btn kind="light" className="flex flex-1 items-center justify-center gap-2 text-sm" onClick={() => st.go({ name: "poster", shopId: shop.id, kind: "manager" })}><Printer size={16} /> QR poster</Btn>
          <Btn kind="light" className="flex-1 text-sm" onClick={() => setMode("looking")}>Edit</Btn>
        </div>
      </Card>

      <h3 className="serif pt-1 text-lg font-semibold">{CANDIDATES.length} people answered</h3>
      {CANDIDATES.map((c) => (
        <Card key={c.id} className="!p-3">
          <div className="flex items-start gap-3">
            <Avatar name={c.name} size={48} color={c.color} />
            <div className="min-w-0 flex-1">
              <div className="font-semibold">{c.name}, {c.age}</div>
              <div className="text-xs text-muted">{c.trade} · {c.years} years</div>
              <p className="mt-1 text-sm">"{c.message}"</p>
            </div>
          </div>
          <Btn kind="ghost" className="mt-2 w-full text-sm" onClick={() => st.notify(`Message sent to ${c.name} (simulated)`)}>Contact</Btn>
        </Card>
      ))}

      <Card className="flex items-center gap-3 !p-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-warning text-white"><ChevronRight size={18} /></span>
        <div className="flex-1">
          <div className="text-sm font-semibold">Manager to recruit</div>
          <div className="text-xs text-muted">Pending · the plan continues meanwhile</div>
        </div>
        <span className="rounded-full bg-warning px-2 py-0.5 text-[11px] font-semibold text-white">Pending</span>
      </Card>
      <AssistantSays>{BANK_MANAGER_NOTE}</AssistantSays>
    </div>
  );
}
