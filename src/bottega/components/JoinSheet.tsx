import { useRef, useState } from "react";
import confetti from "canvas-confetti";
import { toPng } from "html-to-image";
import { Check } from "lucide-react";
import { APP_NAME, DEMO_DATE, PARTNER } from "../config";
import { euro, useStore } from "../store";
import type { Contribution, Shop } from "../types";
import { ShopFront } from "./ShopArt";
import { Btn, Sheet, Trust } from "./ui";
import { Awning } from "./Logo";

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
  const cardRef = useRef<HTMLDivElement>(null);

  const close = () => { onClose(); setTimeout(() => { setStep(0); setOk(false); setDone(null); }, 300); };
  const price = shop.price || 100000;
  const share = ((amount / price) * 100).toFixed(2);
  const perks = shop.raise?.perks?.length ? shop.raise.perks : ["Your name on the wall of founders", "A vote at the yearly meeting"];

  const confirm = () => {
    const c = contribute(shop.id, name.trim() || "Léa", amount);
    setDone(c);
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 }, colors: ["#C2452D", "#1B2A4A", "#E9B949", "#F6F0E4"], scalar: 0.8 });
  };

  const download = async () => {
    if (!cardRef.current) return;
    try {
      const url = await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true });
      const a = document.createElement("a");
      a.href = url;
      a.download = `${APP_NAME}-co-owner-${shop.id}.png`;
      a.click();
    } catch { /* ignore */ }
  };

  return (
    <Sheet open={open} onClose={close}>
      {done ? (
        <div className="text-center">
          <h2 className="serif text-3xl font-semibold text-fir">Welcome, co-owner!</h2>
          <p className="mt-1 text-sm text-muted">Your {euro(done.amount)} is counted (simulated).</p>
          <div ref={cardRef} className="mx-auto mt-4 w-[280px] overflow-hidden rounded-3xl bg-fir text-left text-white">
            <ShopFront type={shop.type} status={shop.status} name={shop.name} colors={shop.colors} className="block w-full" lit={(shop.raise ? shop.raise.raised >= shop.raise.target : false)} />
            <div className="p-4">
              <div className="flex items-center gap-2 text-xs opacity-80"><Awning size={18} />{APP_NAME}</div>
              <div className="serif mt-2 text-xl font-semibold">{shop.name}</div>
              <div className="mt-1 text-sm">{done.firstName} · co-owner since {DEMO_DATE} · share #{done.share}</div>
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            <Btn kind="accent" onClick={download}>Download PNG</Btn>
            <Btn kind="light" onClick={close}>Back to the shop</Btn>
          </div>
          <Trust className="mt-3" />
        </div>
      ) : (
        <div>
          <div className="mb-3 flex justify-center gap-1.5">
            {[0, 1, 2, 3].map((i) => <span key={i} className={`h-2 rounded-full transition-all ${i === step ? "w-6 bg-fir" : "w-2 bg-line"}`} />)}
          </div>
          {step === 0 && (
            <div>
              <h2 className="serif text-2xl font-semibold">How much do you want to put in?</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {AMOUNTS.map((a) => (
                  <button key={a} onClick={() => { setAmount(a); setCustom(""); }}
                    className={`press min-h-[48px] rounded-2xl px-4 font-semibold ${amount === a && !custom ? "bg-fir text-white" : "bg-paper border border-line"}`}>{euro(a)}</button>
                ))}
                <input inputMode="numeric" placeholder="Other" value={custom} aria-label="Custom amount"
                  onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); setCustom(v); if (+v >= 100) setAmount(+v); }}
                  className="min-h-[48px] w-24 rounded-2xl border border-line bg-paper px-3" />
              </div>
              {custom && +custom < 100 && <p className="mt-2 text-xs text-terracotta">Minimum ticket is €100.</p>}
              <p className="mt-4 rounded-2xl bg-paper p-3 text-sm">You will own <b>{share}%</b> of {shop.name} {shop.legalForm || "SAS"}.</p>
              <p className="mt-3 text-sm font-semibold">Your perks</p>
              <ul className="mt-1 space-y-1 text-sm">{perks.map((p) => <li key={p} className="flex gap-2"><Check size={16} className="mt-0.5 text-fir" />{p}</li>)}</ul>
              <Btn className="mt-5 w-full" onClick={() => setStep(1)}>Continue</Btn>
            </div>
          )}
          {step === 1 && (
            <div>
              <h2 className="serif text-2xl font-semibold">Who are you?</h2>
              <label className="mt-4 block text-sm font-semibold">First name
                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block min-h-[48px] w-full rounded-2xl border border-line bg-paper px-3 font-normal" />
              </label>
              <label className="mt-4 flex min-h-[48px] items-center justify-between rounded-2xl bg-paper px-4 text-sm">
                I live nearby
                <input type="checkbox" checked={nearby} onChange={(e) => setNearby(e.target.checked)} className="h-6 w-6 accent-[#1B2A4A]" />
              </label>
              <p className="mt-2 text-xs text-muted">No personal data is needed for this demo.</p>
              <div className="mt-5 flex gap-2"><Btn kind="light" onClick={() => setStep(0)}>Back</Btn><Btn className="flex-1" onClick={() => setStep(2)}>Continue</Btn></div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="serif text-2xl font-semibold">Before you join</h2>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="rounded-2xl bg-paper p-3">You may lose the money you invest if the shop fails.</li>
                <li className="rounded-2xl bg-paper p-3">Shares are not easily resellable. Plan to keep them for years.</li>
                <li className="rounded-2xl bg-paper p-3">Funds are held by {PARTNER}, not by {APP_NAME}.</li>
              </ul>
              <label className="mt-4 flex min-h-[48px] items-center gap-3 text-sm font-semibold">
                <input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} className="h-6 w-6 accent-[#1B2A4A]" /> I understand
              </label>
              <div className="mt-4 flex gap-2"><Btn kind="light" onClick={() => setStep(1)}>Back</Btn><Btn className="flex-1" disabled={!ok} onClick={() => setStep(3)}>Continue</Btn></div>
            </div>
          )}
          {step === 3 && (
            <div className="text-center">
              <h2 className="serif text-2xl font-semibold">Ready, {name || "Léa"}?</h2>
              <p className="mt-2 text-sm text-muted">{euro(amount)} in {shop.name} · {share}% · nothing is charged in this demo.</p>
              <Btn kind="accent" className="mt-6 min-h-[60px] w-full text-lg" onClick={confirm}>Confirm my {euro(amount)} (simulated)</Btn>
              <button onClick={() => setStep(2)} className="mt-3 min-h-[44px] text-sm text-muted underline">Back</button>
            </div>
          )}
          <Trust className="mt-4" />
        </div>
      )}
    </Sheet>
  );
}

export default JoinSheet;
