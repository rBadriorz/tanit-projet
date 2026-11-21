import { animate, motion, useMotionValue } from "framer-motion";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Crosshair, Layers, Plus, Search } from "lucide-react";
import type { Screen, Shop, ShopType, Status } from "../types";
import { useStore } from "../store";
import { STATUS_HEX } from "../components/ShopArt";
import { ShopCard, ME, distanceM } from "../components/ShopCard";
import type { MapTarget } from "../components/LeafletMap";
import { P } from "../theme";

const LeafletMap = lazy(() => import("../components/LeafletMap"));

const CHIPS: { label: string; types?: ShopType[] }[] = [
  { label: "All" },
  { label: "Bakery", types: ["bakery"] },
  { label: "Café", types: ["cafe", "bar"] },
  { label: "Butcher", types: ["butcher"] },
  { label: "Restaurant", types: ["restaurant"] },
  { label: "Grocery", types: ["grocery"] },
  { label: "More…", types: ["bookshop", "florist", "hairdresser", "hardware", "cheese", "fishmonger"] },
];
const TOWNS = {
  Rennes: { lat: 48.1115, lng: -1.68, zoom: 15 },
  "Vitré": { lat: 48.124, lng: -1.209, zoom: 16 },
  "All France": { lat: 46.8, lng: 2.3, zoom: 5.5 },
} as const;
type Town = keyof typeof TOWNS;

const LEGEND: { s: Status; label: string }[] = [
  { s: "seeking", label: "Looking for a successor" },
  { s: "taken_over", label: "Taken over" },
  { s: "flagged", label: "Flagged by neighbours" },
  { s: "open", label: "Open, no succession issue" },
  { s: "closed", label: "Closed" },
];

export default function MapScreen(_p: { screen: Screen }) {
  const { shops, go } = useStore();
  const [q, setQ] = useState("");
  const [chip, setChip] = useState(0);
  const [seekingOnly, setSeekingOnly] = useState(false);
  const [town, setTown] = useState<Town>("Rennes");
  const [legend, setLegend] = useState(false);
  const [me, setMe] = useState<{ lat: number; lng: number } | null>(null);
  const [selected, setSelected] = useState<string | undefined>();
  const [target, setTarget] = useState<MapTarget>({ ...TOWNS.Rennes, key: 0 });

  const filtered = useMemo(() => {
    const t = CHIPS[chip]?.types;
    const s = q.trim().toLowerCase();
    return shops.filter((x) =>
      (!t || t.includes(x.type)) &&
      (!seekingOnly || x.status === "seeking" || x.status === "raising") &&
      (!s || `${x.name} ${x.street} ${x.town}`.toLowerCase().includes(s)));
  }, [shops, chip, q, seekingOnly]);

  const carousel = useMemo(() => {
    const ref = town === "Vitré" ? { lat: 48.124, lng: -1.209 } : ME;
    return filtered
      .filter((x) => x.status !== "open")
      .map((x) => ({ x, d: distanceM(ref, x) }))
      .sort((a, b) => a.d - b.d)
      .map((e) => e.x);
  }, [filtered, town]);

  const flyTo = (lat: number, lng: number, zoom: number) => setTarget((t) => ({ lat, lng, zoom, key: t.key + 1 }));

  const selectShop = (s: Shop, fromCarousel: boolean) => {
    setSelected(s.id);
    flyTo(s.lat, s.lng, Math.max(15, town === "All France" ? 14 : TOWNS[town].zoom));
    if (!fromCarousel) scrollToCard(s.id);
  };

  // Bottom sheet with 3 snap points.
  const box = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(700);
  useEffect(() => {
    const f = () => box.current && setH(box.current.clientHeight);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  const snaps: [number, number, number] = [h - 150, Math.round(h * 0.48), 70]; // peek / half / full (y offsets)
  const [snap, setSnap] = useState(0);
  const y = useMotionValue(snaps[0]);
  useEffect(() => { animate(y, snaps[snap as 0 | 1 | 2], { type: "spring", damping: 30, stiffness: 300 }); }, [snap, h]); // eslint-disable-line react-hooks/exhaustive-deps

  const track = useRef<HTMLDivElement>(null);
  const skipScroll = useRef(false);
  const scrollToCard = (id: string) => {
    const i = carousel.findIndex((c) => c.id === id);
    const el = track.current?.children[i] as HTMLElement | undefined;
    if (!el || !track.current) return;
    skipScroll.current = true;
    track.current.scrollTo({ left: el.offsetLeft - 16, behavior: "smooth" });
    setTimeout(() => (skipScroll.current = false), 600);
    if (snap === 2) setSnap(0);
  };
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onTrackScroll = () => {
    if (skipScroll.current) return;
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      const t = track.current;
      if (!t) return;
      const w = (t.children[0] as HTMLElement | undefined)?.offsetWidth ?? 1;
      const i = Math.round(t.scrollLeft / (w + 12));
      const s = carousel[Math.max(0, Math.min(carousel.length - 1, i))];
      if (s && s.id !== selected) selectShop(s, true);
    }, 160);
  };

  return (
    <div ref={box} className="absolute inset-0 overflow-hidden bg-[var(--surface)]">
      <Suspense fallback={<div className="absolute inset-0 grid place-items-center text-muted">Loading the map…</div>}>
        <LeafletMap shops={filtered} selectedId={selected} target={target} me={me}
          onSelect={(id) => { const s = shops.find((x) => x.id === id); if (s) selectShop(s, false); }} />
      </Suspense>

      {/* Top controls */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] space-y-2 p-3">
        <div className="pointer-events-auto flex gap-2">
          <label className="flex h-12 flex-1 items-center gap-2 rounded-2xl bg-surface px-3 shadow-md">
            <Search size={18} className="text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a street, a shop, a town"
              className="w-full bg-transparent text-sm outline-none" aria-label="Search" />
          </label>
          <select value={town} onChange={(e) => { const t = e.target.value as Town; setTown(t); flyTo(TOWNS[t].lat, TOWNS[t].lng, TOWNS[t].zoom); }}
            aria-label="Choose a town" className="h-12 rounded-2xl bg-primary px-2 text-sm font-semibold text-white shadow-md">
            {(Object.keys(TOWNS) as Town[]).map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="no-scrollbar pointer-events-auto -mx-3 flex gap-2 overflow-x-auto px-3">
          <button onClick={() => setSeekingOnly((v) => !v)}
            className={`press h-10 shrink-0 rounded-full px-3 text-sm font-semibold shadow-sm ${seekingOnly ? "bg-primary-dark text-white" : "bg-surface text-primary-dark"}`}>
            Looking for a successor
          </button>
          {CHIPS.map((c, i) => (
            <button key={c.label} onClick={() => setChip(i)}
              className={`press h-10 shrink-0 rounded-full px-4 text-sm shadow-sm ${chip === i ? "bg-primary text-white" : "bg-surface text-ink"}`}>{c.label}</button>
          ))}
        </div>
      </div>

      {/* Side buttons */}
      <div className="absolute right-3 z-[500] flex flex-col gap-2" style={{ top: 128 }}>
        <button aria-label="Locate me" onClick={() => { setMe(ME); setTown("Rennes"); flyTo(ME.lat, ME.lng, 16); }}
          className="press grid h-11 w-11 place-items-center rounded-full bg-surface shadow-md"><Crosshair size={20} /></button>
        <button aria-label="Flag a shop" onClick={() => go({ name: "flag" })}
          className="press grid h-11 w-11 place-items-center rounded-full bg-warning shadow-md"><Plus size={22} /></button>
        <button aria-label="Legend" onClick={() => setLegend((v) => !v)}
          className="press grid h-11 w-11 place-items-center rounded-full bg-surface shadow-md"><Layers size={20} /></button>
      </div>
      {legend && (
        <div className="absolute right-16 z-[500] rounded-2xl bg-surface p-3 text-xs shadow-lg" style={{ top: 128 }}>
          {LEGEND.map((l) => (
            <div key={l.s} className="flex items-center gap-2 py-1">
              <span className="h-3.5 w-3.5 rounded-sm" style={{ background: STATUS_HEX[l.s], border: l.s === "open" ? `2px solid ${P.primary}` : undefined, opacity: l.s === "closed" ? 0.6 : 1 }} />
              {l.label}
            </div>
          ))}
        </div>
      )}

      {/* Bottom sheet */}
      <motion.div style={{ y }} drag="y" dragConstraints={{ top: snaps[2], bottom: snaps[0] }} dragElastic={0.1}
        onDragEnd={(_, i) => {
          const pos = y.get() + i.velocity.y * 0.15;
          let best = 0;
          snaps.forEach((s, k) => { if (Math.abs(s - pos) < Math.abs(snaps[best as 0 | 1 | 2] - pos)) best = k; });
          setSnap(best);
          animate(y, snaps[best as 0 | 1 | 2], { type: "spring", damping: 30, stiffness: 300 });
        }}
        className="absolute inset-x-0 top-0 z-[600] flex flex-col rounded-t-[28px] bg-page shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
      >
        <div className="shrink-0 cursor-grab px-4 pb-2 pt-2" onClick={() => setSnap((s) => (s === 0 ? 1 : s === 1 ? 2 : 0))}>
          <div className="mx-auto h-1.5 w-12 rounded-full bg-line" />
          <div className="mt-2 flex items-baseline justify-between">
            <span className="serif text-lg font-semibold">{carousel.length} shops near you</span>
            <span className="text-xs text-muted">{snap === 2 ? "Sorted by distance" : "Swipe the cards"}</span>
          </div>
        </div>
        {snap < 2 ? (
          <div ref={track} onScroll={onTrackScroll} onPointerDownCapture={(e) => e.stopPropagation()}
            className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3">
            {carousel.map((s) => (
              <div key={s.id} className="w-[85%] shrink-0 snap-center">
                <ShopCard shop={s} compact selected={s.id === selected} onOpen={() => go({ name: "shop", id: s.id })} />
              </div>
            ))}
          </div>
        ) : (
          <div onPointerDownCapture={(e) => e.stopPropagation()} className="no-scrollbar space-y-3 overflow-y-auto px-4 pb-40" style={{ height: h - snaps[2] - 70 }}>
            {carousel.map((s) => <ShopCard key={s.id} shop={s} selected={s.id === selected} onOpen={() => go({ name: "shop", id: s.id })} />)}
          </div>
        )}
      </motion.div>
    </div>
  );
}
