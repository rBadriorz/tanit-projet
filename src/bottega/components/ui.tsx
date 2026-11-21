import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { TRUST_LINE } from "../config";
import { useStore } from "../store";
import type { Status } from "../types";
import { STATUS_HEX, STATUS_LABEL } from "./ShopArt";

export function Btn({ children, onClick, kind = "primary", className = "", disabled, type = "button" }: {
  children: ReactNode; onClick?: () => void; kind?: "primary" | "accent" | "ghost" | "light"; className?: string; disabled?: boolean; type?: "button" | "submit";
}) {
  const k = {
    primary: "bg-fir text-white",
    accent: "bg-terracotta text-white",
    ghost: "bg-transparent text-fir border-2 border-fir",
    light: "bg-paper text-ink border border-line",
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
      className={`rounded-3xl bg-paper p-4 shadow-[0_4px_18px_rgba(31,77,58,0.08)] ${onClick ? "cursor-pointer" : ""} ${className}`}>
      {children}
    </motion.div>
  );
}

export function Badge({ status }: { status: Status }) {
  const c = STATUS_HEX[status];
  const light = status === "open" || status === "flagged";
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ background: status === "open" ? "#fff" : c, color: light ? "#1E1E1E" : "#fff", border: status === "open" ? "1.5px solid #1F4D3A" : undefined }}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Progress({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-line ${className}`}>
      <motion.div className="h-full rounded-full bg-fir" initial={{ width: 0 }} animate={{ width: `${Math.min(100, value)}%` }} transition={{ duration: 0.9, ease: "easeOut" }} />
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
    <div className="absolute inset-0 flex flex-col bg-cream">
      <div className="flex h-14 shrink-0 items-center gap-2 px-3">
        <button aria-label="Back" onClick={back} className="press grid h-11 w-11 place-items-center rounded-full bg-paper shadow-sm"><ChevronLeft size={22} /></button>
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
        className="absolute inset-x-0 bottom-0 max-h-[88%] overflow-y-auto rounded-t-[28px] bg-cream px-5 pb-8 pt-3">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-line" />
        {children}
      </motion.div>
    </div>
  );
}

export function Avatar({ name, size = 40, color = "#2E6B52" }: { name: string; size?: number; color?: string }) {
  const ini = name.replace(/^(Mme|M\.)\s+/, "").split(/[\s&]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <div className="grid shrink-0 place-items-center rounded-full font-semibold text-white" style={{ width: size, height: size, background: color, fontSize: size * 0.38 }} aria-hidden>
      {ini}
    </div>
  );
}
