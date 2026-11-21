import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { toPng } from "html-to-image";
import { motion } from "framer-motion";
import { APP_NAME } from "../config";
import { euro, useStore } from "../store";
import type { Contribution, Shop } from "../types";
import { ShopFront } from "./ShopArt";
import { Awning } from "./Logo";
import { Btn, Trust } from "./ui";
import { P } from "../theme";

const fmtDate = (iso?: string) =>
  new Date(iso ?? Date.now()).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** Share-ready co-owner card. Only shown for approved requests. */
export function CoOwnerCard({ shop, c, cardRef }: { shop: Shop; c: Contribution; cardRef?: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={cardRef} className="mx-auto w-[280px] overflow-hidden rounded-3xl bg-primary text-left text-white">
      <ShopFront type={shop.type} status={shop.status} name={shop.name} colors={shop.colors} className="block w-full"
        lit={shop.raise ? shop.raise.raised >= shop.raise.target : false} />
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs opacity-80"><Awning size={18} />{APP_NAME}</div>
        <div className="serif mt-2 text-xl font-semibold">{shop.name}</div>
        <div className="mt-1 text-sm">{c.firstName} · co-owner since {fmtDate(c.approvedAt)} · share #{c.share}</div>
      </div>
    </div>
  );
}

export async function downloadCard(node: HTMLElement | null, shopId: string) {
  if (!node) return;
  try {
    const url = await toPng(node, { pixelRatio: 3, cacheBust: true });
    const a = document.createElement("a");
    a.href = url;
    a.download = `${APP_NAME}-co-owner-${shopId}.png`;
    a.click();
  } catch { /* ignore */ }
}

/** Happy ending, played when the presenter approves the pending requests. */
export function Celebration() {
  const { celebrate, setCelebrate, shop } = useStore();
  const ref = useRef<HTMLDivElement>(null);
  const s = celebrate ? shop(celebrate.shopId) : undefined;
  useEffect(() => {
    if (!celebrate) return;
    confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 }, colors: [P.primary, P.primaryDark, P.warning, P.surface], scalar: 0.8 });
  }, [celebrate]);
  if (!celebrate || !s) return null;
  return (
    <div className="absolute inset-0 z-[55] grid place-items-center bg-black/45 px-5">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full rounded-[28px] bg-page p-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-success">Request approved</p>
        <h2 className="serif mt-1 text-3xl font-semibold text-primary">Welcome, co-owner!</h2>
        <p className="mt-1 text-sm text-muted">Your {euro(celebrate.amount)} in {s.name} is confirmed (simulated).</p>
        <div className="mt-4"><CoOwnerCard shop={s} c={celebrate} cardRef={ref} /></div>
        <div className="mt-4 grid gap-2">
          <Btn kind="accent" onClick={() => downloadCard(ref.current, s.id)}>Download PNG</Btn>
          <Btn kind="light" onClick={() => setCelebrate(null)}>Close</Btn>
        </div>
        <Trust className="mt-3" />
      </motion.div>
    </div>
  );
}
