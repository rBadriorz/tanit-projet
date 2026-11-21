import { useState } from "react";
import { Check, Clock, Circle } from "lucide-react";
import { APP_NAME, PARTNER } from "../config";
import { euro, useStore } from "../store";
import type { Contribution, Shop } from "../types";
import { Btn, Sheet, Trust } from "./ui";

const AMOUNTS = [100, 250, 500, 1000];

export function JoinSheet({ shop, open, onClose }: { shop: Shop; open: boolean; onClose: () => void }) {
  const { contribute } = useStore();
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(250);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("Léa");
  const [nearby, setNearby] = useState(true);
  const [ok, setOk] = useState(false);
  const [done, setDone] = useState<Contribution | null>(null);

  const close = () => { onClose(); setTimeout(() => { setStep(0); setOk(false); setDone(null); }, 300); };
  const price = shop.price || 100000;
  const share = ((amount / price) * 100).toFixed(2);
  const perks = shop.raise?.perks?.length ? shop.raise.perks : ["Your name on the wall of founders", "A vote at the yearly meeting"];

  const confirm = () => setDone(contribute(shop.id, name.trim() || "Léa", amount));

  return (
    <Sheet open={open} onClose={close}>
      {done ? (
        <RequestSent shop={shop} c={done} onClose={close} />
      ) : (
        <div>
          <div className="mb-3 flex justify-center gap-1.5">
            {[0, 1, 2, 3].map((i) => <span key={i} className={`h-2 rounded-full transition-all ${i === step ? "w-6 bg-primary" : "w-2 bg-line"}`} />)}
          </div>
          {step === 0 && (
            <div>
              <h2 className="serif text-2xl font-semibold">How much do you want to put in?</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {AMOUNTS.map((a) => (
                  <button key={a} onClick={() => { setAmount(a); setCustom(""); }}
                    className={`press min-h-[48px] rounded-2xl px-4 font-semibold ${amount === a && !custom ? "bg-primary text-white" : "bg-surface border border-line"}`}>{euro(a)}</button>
                ))}
                <input inputMode="numeric" placeholder="Other" value={custom} aria-label="Custom amount"
                  onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); setCustom(v); if (+v >= 100) setAmount(+v); }}
                  className="min-h-[48px] w-24 rounded-2xl border border-line bg-surface px-3" />
              </div>
              {custom && +custom < 100 && <p className="mt-2 text-xs text-danger">Minimum ticket is €100.</p>}
              <p className="mt-4 rounded-2xl bg-surface p-3 text-sm">You will own <b>{share}%</b> of {shop.name} {shop.legalForm || "SAS"}.</p>
              <p className="mt-3 text-sm font-semibold">Your perks</p>
              <ul className="mt-1 space-y-1 text-sm">{perks.map((p) => <li key={p} className="flex gap-2"><Check size={16} className="mt-0.5 text-primary" />{p}</li>)}</ul>
              <Btn className="mt-5 w-full" onClick={() => setStep(1)}>Continue</Btn>
            </div>
          )}
          {step === 1 && (
            <div>
              <h2 className="serif text-2xl font-semibold">Who are you?</h2>
              <label className="mt-4 block text-sm font-semibold">First name
                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block min-h-[48px] w-full rounded-2xl border border-line bg-surface px-3 font-normal" />
              </label>
              <label className="mt-4 flex min-h-[48px] items-center justify-between rounded-2xl bg-surface px-4 text-sm">
                I live nearby
                <input type="checkbox" checked={nearby} onChange={(e) => setNearby(e.target.checked)} className="h-6 w-6 accent-[var(--primary-dark)]" />
              </label>
              <p className="mt-2 text-xs text-muted">No personal data is needed for this demo.</p>
              <div className="mt-5 flex gap-2"><Btn kind="light" onClick={() => setStep(0)}>Back</Btn><Btn className="flex-1" onClick={() => setStep(2)}>Continue</Btn></div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="serif text-2xl font-semibold">Before you join</h2>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="rounded-2xl bg-surface p-3">You may lose the money you invest if the shop fails.</li>
                <li className="rounded-2xl bg-surface p-3">Shares are not easily resellable. Plan to keep them for years.</li>
                <li className="rounded-2xl bg-surface p-3">Funds are held by {PARTNER}, not by {APP_NAME}.</li>
              </ul>
              <label className="mt-4 flex min-h-[48px] items-center gap-3 text-sm font-semibold">
                <input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} className="h-6 w-6 accent-[var(--primary-dark)]" /> I understand
              </label>
              <div className="mt-4 flex gap-2"><Btn kind="light" onClick={() => setStep(1)}>Back</Btn><Btn className="flex-1" disabled={!ok} onClick={() => setStep(3)}>Continue</Btn></div>
            </div>
          )}
          {step === 3 && (
            <div className="text-center">
              <h2 className="serif text-2xl font-semibold">Ready, {name || "Léa"}?</h2>
              <p className="mt-2 text-sm text-muted">{euro(amount)} in {shop.name} · {share}% · this sends a request. No money is taken until it is approved.</p>
              <Btn kind="accent" className="mt-6 min-h-[60px] w-full text-lg" onClick={confirm}>Send my request for {euro(amount)}</Btn>
              <button onClick={() => setStep(2)} className="mt-3 min-h-[44px] text-sm text-muted underline">Back</button>
            </div>
          )}
          <Trust className="mt-4" />
        </div>
      )}
    </Sheet>
  );
}

export const NO_MONEY_NOTICE = "No money is taken until your request is approved. Investing in a small business carries a risk of losing all or part of your capital.";

/** Pending state: the request is sent, the share is not issued yet. */
export function RequestSent({ shop, c, onClose }: { shop: Shop; c: Contribution; onClose: () => void }) {
  const steps: { label: string; state: "done" | "doing" | "todo" }[] = [
    { label: "Request sent", state: "done" },
    { label: `Identity and risk check by ${PARTNER}`, state: c.status === "approved" ? "done" : "doing" },
    { label: "Lead buyer approval and share issuance", state: c.status === "approved" ? "done" : "todo" },
  ];
  return (
    <div>
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-warning/30 text-[var(--primary-dark)]"><Clock size={28} /></div>
      <h2 className="serif mt-3 text-center text-3xl font-semibold text-primary">Request sent</h2>
      <p className="mt-2 text-center text-sm">
        Your request to become a co-owner of <b>{shop.name}</b> for <b>{euro(c.amount)}</b> has been sent. It is pending validation.
      </p>
      <ol className="mt-5 space-y-0" aria-label="Progress of your request">
        {steps.map((st, i) => (
          <li key={st.label} className="relative flex gap-3 pb-4">
            {i < steps.length - 1 && <span className={`absolute left-[15px] top-8 h-[calc(100%-24px)] w-0.5 ${st.state === "done" ? "bg-primary" : "bg-line"}`} />}
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${st.state === "done" ? "bg-primary text-white" : st.state === "doing" ? "bg-warning text-ink" : "border-2 border-line bg-surface text-muted"}`}>
              {st.state === "done" ? <Check size={16} /> : st.state === "doing" ? <Clock size={16} /> : <Circle size={10} />}
            </span>
            <div className="pt-1">
              <div className="text-sm font-semibold">{i + 1}. {st.label}</div>
              <div className="text-xs text-muted">{st.state === "done" ? "Done" : st.state === "doing" ? "In progress" : "To come"}</div>
            </div>
          </li>
        ))}
      </ol>
      <p className="rounded-2xl border border-warning bg-warning/15 p-3 text-sm">{NO_MONEY_NOTICE}</p>
      <p className="mt-2 text-xs text-muted">Your co-owner card unlocks once the request is approved. Follow it in Me › My shares.</p>
      <Btn kind="light" className="mt-4 w-full" onClick={onClose}>Back to the shop</Btn>
      <Trust className="mt-3" />
    </div>
  );
}

export default JoinSheet;
