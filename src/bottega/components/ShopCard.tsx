import type { Shop } from "../types";
import { euro, pct } from "../store";
import { Badge, Progress } from "./ui";
import { ShopFront, TYPE_LABEL } from "./ShopArt";

export const ME = { lat: 48.114, lng: -1.6745 };

export function distanceM(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371000, toR = Math.PI / 180;
  const dLat = (b.lat - a.lat) * toR, dLng = (b.lng - a.lng) * toR;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * toR) * Math.cos(b.lat * toR) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
export function fmtDist(m: number) {
  return m < 1000 ? `${Math.round(m / 10) * 10} m` : m < 100000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m / 1000)} km`;
}

export function ShopCard({ shop, onOpen, compact, selected, featured }: { shop: Shop; onOpen: () => void; compact?: boolean; selected?: boolean; featured?: boolean }) {
  const closed = shop.status === "closed";
  const d = fmtDist(distanceM(ME, shop));
  return (
    <div
      role={closed ? undefined : "button"}
      tabIndex={closed ? undefined : 0}
      onClick={closed ? undefined : onOpen}
      onKeyDown={(e) => { if (!closed && e.key === "Enter") onOpen(); }}
      className={`press flex gap-3 rounded-3xl bg-surface p-3 shadow-[0_4px_18px_color-mix(in_srgb,var(--primary)_8%,transparent)] ${selected ? "ring-2 ring-primary-dark" : ""} ${closed ? "opacity-80" : "cursor-pointer"}`}
    >
      <ShopFront type={shop.type} status={shop.status} name={shop.name} colors={shop.colors} className={`shrink-0 rounded-2xl ${compact ? "h-[84px] w-[100px]" : "h-[96px] w-[120px]"}`} />
      <div className="min-w-0 flex-1">
        {featured && <div className="mb-0.5 inline-flex items-center gap-1 rounded-full bg-warning px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">★ Featured</div>}
        <div className="truncate font-semibold leading-tight">{shop.name}</div>
        <div className="truncate text-xs text-muted">{TYPE_LABEL[shop.type]} · {shop.street} · {d}</div>
        <div className="mt-1"><Badge status={shop.status} /></div>
        {closed ? (
          <p className="mt-1 text-xs text-danger">Closed in {shop.closedYear ?? 2024}. We were too late.</p>
        ) : shop.raise ? (
          <div className="mt-1.5">
            <Progress value={pct(shop)} className="h-2" />
            <div className="mt-1 truncate text-[11px] text-muted">
              {euro(shop.raise.raised)} of {euro(shop.raise.target)} · {shop.raise.backers} neighbours
              {shop.status === "raising" && shop.raise.daysLeft > 0 ? ` · ${shop.raise.daysLeft} days left` : ""}
            </div>
          </div>
        ) : shop.status === "flagged" ? (
          <p className="mt-1 text-xs text-muted">Flagged by {shop.flaggedBy ?? 12} neighbours</p>
        ) : null}
        {!compact && !closed && shop.owner?.quote && <p className="mt-1 truncate text-xs italic text-ink/70">“{shop.owner.quote}”</p>}
      </div>
    </div>
  );
}
