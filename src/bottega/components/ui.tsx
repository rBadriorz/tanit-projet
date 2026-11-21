import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { TRUST_LINE } from "../config";
import { useStore } from "../store";
import type { Status } from "../types";
import { STATUS_HEX, STATUS_LABEL } from "./ShopArt";
import { P } from "../theme";

export function Btn({ children, onClick, kind = "primary", className = "", disabled, type = "button" }: {
  children: ReactNode; onClick?: () => void; kind?: "primary" | "accent" | "ghost" | "light"; className?: string; disabled?: boolean; type?: "button" | "submit";
}) {
  const k = {
    primary: "bg-primary text-white",
    accent: "bg-primary-dark text-white",
    ghost: "bg-transparent text-primary border-2 border-primary",
    light: "bg-surface text-ink border border-line",
  }[kind];
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      className={`press min-h-[48px] rounded-2xl px-5 font-semibold disabled:opacity-40 ${k} ${className}`}>
      {children}
    </button>
  );
}

export function Card({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <motion.div {...(onClick ? { whileTap: { scale: 0.98, y: -2 }, onClick } : {})}
      className={`rounded-3xl bg-surface p-4 shadow-[0_4px_18px_color-mix(in_srgb,var(--primary)_8%,transparent)] ${onClick ? "cursor-pointer" : ""} ${className}`}>
      {children}
    </motion.div>
  );
}

export function Badge({ status }: { status: Status }) {
  const c = STATUS_HEX[status];
  const light = status === "open" || status === "flagged";
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ background: status === "open" ? P.page : c, color: light ? P.text : "#fff", border: status === "open" ? `1.5px solid ${P.primary}` : undefined }}>
      {STATUS_LABEL[status]}
    </span>
  );
}

/** Funding bar. `pending` (same unit as value, in %) shows as a lighter segment after the confirmed part. */
export function Progress({ value, pending = 0, className = "" }: { value: number; pending?: number; className?: string }) {
  const v = Math.min(100, value);
  const p = Math.max(0, Math.min(100 - v, pending));
  return (
    <div className={`flex h-2.5 w-full overflow-hidden rounded-full bg-line ${className}`}>
      <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.9, ease: "easeOut" }} />
      {p > 0 && (
        <motion.div className="h-full bg-primary-light/40" initial={{ width: 0 }} animate={{ width: `${p}%` }} transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
          style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,.35) 0 4px, transparent 4px 8px)" }} />
      )}
    </div>
  );
}

export function Trust({ className = "" }: { className?: string }) {
  return <p className={`text-center text-[11px] leading-snug text-muted ${className}`}>{TRUST_LINE}</p>;
}

/** Standard screen with a back header. Content scrolls inside the phone. */
export function Page({ title, children, right, noPad }: { title?: string; children: ReactNode; right?: ReactNode; noPad?: boolean }) {
  const { back } = useStore();
  return (
    <div className="absolute inset-0 flex flex-col bg-page">
      <div className="flex h-14 shrink-0 items-center gap-2 px-3">
        <button aria-label="Back" onClick={back} className="press grid h-11 w-11 place-items-center rounded-full bg-surface shadow-sm"><ChevronLeft size={22} /></button>
        <h1 className="flex-1 truncate text-lg font-semibold">{title}</h1>
        {right}
      </div>
      <div className={`no-scrollbar flex-1 overflow-y-auto ${noPad ? "" : "px-4 pb-28"}`}>{children}</div>
    </div>
  );
}

export function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40">
      <motion.div className="absolute inset-0 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} />
      <motion.div drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, i) => { if (i.offset.y > 120) onClose(); }}
        initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="absolute inset-x-0 bottom-0 max-h-[88%] overflow-y-auto rounded-t-[28px] bg-page px-5 pb-8 pt-3">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-line" />
        {children}
      </motion.div>
    </div>
  );
}

export function Avatar({ name, size = 40, color = P.brown2 }: { name: string; size?: number; color?: string }) {
  const ini = name.replace(/^(Mme|M\.)\s+/, "").split(/[\s&]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <div className="grid shrink-0 place-items-center rounded-full font-semibold text-white" style={{ width: size, height: size, background: color, fontSize: size * 0.38 }} aria-hidden>
      {ini}
    </div>
  );
}
