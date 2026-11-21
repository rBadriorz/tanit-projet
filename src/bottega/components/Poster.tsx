import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { APP_NAME, TRUST_LINE } from "../config";
import type { Shop } from "../types";
import { ShopFront, TYPE_LABEL } from "./ShopArt";
import { Awning } from "./Logo";
import { P } from "../theme";

export type Template = "classic" | "bold" | "minimal";
export const TEMPLATES: { id: Template; label: string }[] = [
  { id: "classic", label: "Classic chalkboard" },
  { id: "bold", label: "Bold brown" },
  { id: "minimal", label: "Minimal white" },
];

const THEME: Record<Template, { bg: string; fg: string; accent: string; sub: string; qrBg: string }> = {
  classic: { bg: P.text, fg: P.surface, accent: P.warning, sub: P.primaryLight, qrBg: P.surface },
  bold: { bg: P.primary, fg: P.surface, accent: P.primaryDark, sub: P.facade1, qrBg: P.surface },
  minimal: { bg: P.surface, fg: P.text, accent: P.primaryDark, sub: P.text2, qrBg: P.surface },
};

export interface PosterProps {
  shop: Shop;
  kind: "raise" | "successor";
  template: Template;
  origin: string;
  headline?: string | undefined;
  subline?: string | undefined;
  offers?: string[] | undefined;
  profiles?: string[] | undefined;
}

export function defaultHeadline(shop: Shop, kind: "raise" | "successor") {
  return kind === "raise" ? `Don't let ${shop.name} close. Own a piece of it.` : `Wanted: someone to take over ${shop.name}.`;
}
export function defaultSubline(shop: Shop, kind: "raise" | "successor") {
  if (kind === "raise") {
    const lead = shop.leadBuyer?.firstName ?? "A neighbour";
    return `${shop.owner.firstName} is retiring after ${shop.owner.yearsInShop} years. ${lead} wants to take over. Join from €100.`;
  }
  return `After ${shop.owner.yearsInShop || "many"} years, ${shop.owner.firstName || "the owner"} is looking for a successor. Training included, financing help available, neighbours ready to invest.`;
}

/** A4 poster at 794×1123 px (96 dpi). The QR is vector so print stays crisp. */
export const Poster = forwardRef<HTMLDivElement, PosterProps>(function Poster(p, ref) {
  const t = THEME[p.template];
  const { shop } = p;
  const url = p.kind === "raise" ? `${p.origin}/shop/${shop.id}` : `${p.origin}/shop/${shop.id}?apply=1`;
  const headline = p.headline || defaultHeadline(shop, p.kind);
  const subline = p.subline || defaultSubline(shop, p.kind);
  const pct = shop.raise ? Math.min(100, Math.round((shop.raise.raised / shop.raise.target) * 100)) : 0;
  return (
    <div ref={ref} style={{ width: 794, height: 1123, background: t.bg, color: t.fg, fontFamily: "Inter, sans-serif" }}
      className="relative flex flex-col overflow-hidden px-[64px] py-[56px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3"><Awning size={44} /><span className="serif text-[30px] font-semibold">{APP_NAME}</span></div>
        <span className="rounded-full px-4 py-1.5 text-[15px] font-semibold" style={{ background: t.accent, color: p.template === "classic" ? P.text : "#fff" }}>
          {TYPE_LABEL[shop.type]} · {shop.street}, {shop.town}
        </span>
      </div>
      <div className="mt-8 overflow-hidden rounded-[28px]" style={{ border: `4px solid ${t.fg}22` }}>
        <ShopFront type={shop.type} status={shop.status === "closed" ? "seeking" : shop.status} name={shop.name} colors={shop.colors} className="block h-[330px] w-full" />
      </div>
      <h1 className="serif mt-9 text-[54px] font-semibold leading-[1.08]">{headline}</h1>
      <p className="mt-5 text-[24px] leading-snug" style={{ color: t.sub }}>{subline}</p>
      {p.kind === "successor" && (p.offers?.length || p.profiles?.length) ? (
        <div className="mt-6 grid grid-cols-2 gap-6 text-[18px]">
          {!!p.offers?.length && (
            <div>
              <div className="mb-2 font-bold" style={{ color: t.accent === P.primaryDark && p.template === "bold" ? t.fg : t.accent }}>What we offer</div>
              <ul className="space-y-1.5">{p.offers.map((o) => <li key={o}>✓ {o}</li>)}</ul>
            </div>
          )}
          {!!p.profiles?.length && (
            <div>
              <div className="mb-2 font-bold" style={{ color: t.accent === P.primaryDark && p.template === "bold" ? t.fg : t.accent }}>Profile wanted</div>
              <div className="flex flex-wrap gap-2">{p.profiles.map((o) => <span key={o} className="rounded-full px-3 py-1" style={{ border: `2px solid ${t.fg}` }}>{o}</span>)}</div>
            </div>
          )}
        </div>
      ) : null}
      <div className="mt-auto flex items-end gap-8">
        <div className="rounded-3xl p-4" style={{ background: t.qrBg }}>
          <QRCodeSVG value={url} size={210} fgColor={P.primaryDark} bgColor={t.qrBg} level="M" />
        </div>
        <div className="flex-1 pb-2">
          <div className="serif text-[30px] font-semibold leading-tight">{p.kind === "raise" ? "Scan to join from €100" : "Scan if you could take over"}</div>
          {p.kind === "raise" && shop.raise && (
            <div className="mt-4">
              <div className="h-4 overflow-hidden rounded-full" style={{ background: `${t.fg}33` }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: t.accent }} />
              </div>
              <div className="mt-2 text-[18px]">€{shop.raise.raised.toLocaleString("en-GB")} of €{shop.raise.target.toLocaleString("en-GB")} · {shop.raise.backers} neighbours</div>
            </div>
          )}
          <p className="mt-4 text-[13px] opacity-80">{p.kind === "raise" ? TRUST_LINE : "Demo poster · fictional data."} </p>
        </div>
      </div>
    </div>
  );
});
