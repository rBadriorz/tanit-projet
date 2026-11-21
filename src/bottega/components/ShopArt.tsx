import type { ShopType, Status } from "../types";

export const STATUS_COLOR: Record<Status, string> = {
  seeking: "var(--terracotta)",
  raising: "var(--terracotta)",
  taken_over: "var(--fir)",
  flagged: "var(--sun)",
  open: "#ffffff",
  closed: "var(--closed)",
};
export const STATUS_HEX: Record<Status, string> = {
  seeking: "#C2452D", raising: "#C2452D", taken_over: "#1B2A4A", flagged: "#E9B949", open: "#FFFFFF", closed: "#A7A7A7",
};
export const STATUS_LABEL: Record<Status, string> = {
  seeking: "Looking for a successor",
  raising: "Raising",
  taken_over: "Taken over",
  flagged: "Flagged by neighbours",
  open: "Open",
  closed: "Closed",
};
export const TYPE_LABEL: Record<ShopType, string> = {
  bakery: "Bakery", cafe: "Café", butcher: "Butcher", restaurant: "Restaurant", grocery: "Grocery",
  bookshop: "Bookshop", florist: "Florist", hairdresser: "Hairdresser", hardware: "Hardware",
  cheese: "Cheese shop", fishmonger: "Fishmonger", bar: "Bar",
};

/** Small pictogram for each shop type, drawn in a 24x24 box. */
export function TypeIcon({ type, color = "#1E1E1E" }: { type: ShopType; color?: string }) {
  const p = { fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (type) {
    case "bakery": return <g {...p}><path d="M4 15c0-5 4-8 8-8s8 3 8 8c0 1.5-1 2-2 2H6c-1 0-2-.5-2-2z" /><path d="M9 9l1 5M12 8v6M15 9l-1 5" /></g>;
    case "cafe": case "bar": return <g {...p}><path d="M5 9h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" /><path d="M16 10h2a2 2 0 0 1 0 4h-2" /><path d="M8 4v2M11 4v2" /></g>;
    case "butcher": return <g {...p}><path d="M4 7h11l3 3v5H4z" /><path d="M7 15v3" /><circle cx="15" cy="10" r="1" /></g>;
    case "restaurant": return <g {...p}><circle cx="12" cy="12" r="6" /><path d="M3 5v5M3 7.5h0M21 5v14" /></g>;
    case "grocery": return <g {...p}><path d="M4 9h16l-2 9H6z" /><path d="M8 9l3-5M16 9l-3-5" /></g>;
    case "bookshop": return <g {...p}><path d="M4 6c3-1 6-1 8 1 2-2 5-2 8-1v12c-3-1-6-1-8 1-2-2-5-2-8-1z" /><path d="M12 7v12" /></g>;
    case "florist": return <g {...p}><circle cx="12" cy="9" r="2" /><path d="M12 5a2 2 0 1 1 0 0M8 9a4 4 0 0 0 8 0" /><path d="M12 11v9M12 16c-2-1-4-1-5 0" /></g>;
    case "hairdresser": return <g {...p}><circle cx="7" cy="17" r="2.5" /><circle cx="17" cy="17" r="2.5" /><path d="M8.5 15L17 4M15.5 15L7 4" /></g>;
    case "hardware": return <g {...p}><path d="M14 4a4 4 0 0 0-3 6l-6 6 3 3 6-6a4 4 0 0 0 6-3l-3 1-2-2z" /></g>;
    case "cheese": return <g {...p}><path d="M3 15l14-8 4 3v7H3z" /><circle cx="9" cy="14" r="1" /><circle cx="15" cy="13" r="1.2" /></g>;
    case "fishmonger": return <g {...p}><path d="M3 12c3-4 9-5 13 0-4 5-10 4-13 0z" /><path d="M16 12l5-3v6z" /><circle cx="7" cy="11" r=".6" /></g>;
  }
}

/** Marker: a mini shop front (34x34) with an awning in the status colour. */
export function markerSvg(type: ShopType, status: Status, progress?: number): string {
  const aw = STATUS_HEX[status];
  const stroke = status === "open" ? "#1B2A4A" : aw;
  const op = status === "closed" ? 0.55 : 1;
  const ring = progress != null && status === "raising"
    ? `<circle cx="17" cy="17" r="16" fill="none" stroke="#e6dcc8" stroke-width="2.5"/><circle cx="17" cy="17" r="16" fill="none" stroke="#1B2A4A" stroke-width="2.5" stroke-dasharray="${(progress / 100) * 100.5} 100.5" transform="rotate(-90 17 17)"/>`
    : "";
  const icon = ICON_PATHS[type];
  return `<svg width="34" height="34" viewBox="0 0 34 34" style="opacity:${op};overflow:visible" xmlns="http://www.w3.org/2000/svg">${ring}
  <rect x="7" y="11" width="20" height="16" rx="2" fill="#FFFDF8" stroke="${stroke}" stroke-width="1.5"/>
  <path d="M5 8h24l-2 5H7z" fill="${aw}" stroke="${stroke}" stroke-width="1.2"/>
  <path d="M11 8l-1 5M17 8v5M23 8l1 5" stroke="${status === "open" ? "#1B2A4A" : "#fff"}" stroke-width="1" opacity=".7"/>
  <g transform="translate(11 14) scale(.5)" fill="none" stroke="#1E1E1E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${icon}</g>
  </svg>`;
}
const ICON_PATHS: Record<ShopType, string> = {
  bakery: '<path d="M4 15c0-5 4-8 8-8s8 3 8 8c0 1.5-1 2-2 2H6c-1 0-2-.5-2-2z"/><path d="M9 9l1 5M12 8v6M15 9l-1 5"/>',
  cafe: '<path d="M5 9h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/><path d="M16 10h2a2 2 0 0 1 0 4h-2"/>',
  bar: '<path d="M6 4h12l-6 8z"/><path d="M12 12v7M8 20h8"/>',
  butcher: '<path d="M4 7h11l3 3v5H4z"/><path d="M7 15v3"/>',
  restaurant: '<circle cx="12" cy="12" r="6"/><path d="M3 5v14M21 5v14"/>',
  grocery: '<path d="M4 9h16l-2 9H6z"/><path d="M8 9l3-5M16 9l-3-5"/>',
  bookshop: '<path d="M4 6c3-1 6-1 8 1 2-2 5-2 8-1v12c-3-1-6-1-8 1-2-2-5-2-8-1z"/><path d="M12 7v12"/>',
  florist: '<circle cx="12" cy="8" r="3"/><path d="M12 11v9M12 16c-2-1-4-1-5 0"/>',
  hairdresser: '<circle cx="7" cy="17" r="2.5"/><circle cx="17" cy="17" r="2.5"/><path d="M8.5 15L17 4M15.5 15L7 4"/>',
  hardware: '<path d="M14 4a4 4 0 0 0-3 6l-6 6 3 3 6-6a4 4 0 0 0 6-3l-3 1-2-2z"/>',
  cheese: '<path d="M3 15l14-8 4 3v7H3z"/><circle cx="9" cy="14" r="1"/>',
  fishmonger: '<path d="M3 12c3-4 9-5 13 0-4 5-10 4-13 0z"/><path d="M16 12l5-3v6z"/>',
};

/** Illustrated shop front, scalable (card thumbnail or hero). */
export function ShopFront({ type, status, name, colors, className, lit }: {
  type: ShopType; status: Status; name: string; colors: { awning: string; facade: string }; className?: string; lit?: boolean;
}) {
  const aw = status === "closed" ? "#A7A7A7" : colors.awning;
  const stripes = Array.from({ length: 8 }, (_, i) => i);
  return (
    <svg viewBox="0 0 240 180" className={className} role="img" aria-label={`Illustration of ${name}`}>
      <rect width="240" height="180" fill={lit ? "#fbe7b5" : "#efe6d3"} />
      <rect x="20" y="30" width="200" height="150" fill={colors.facade} stroke="#1E1E1E" strokeOpacity=".15" />
      <rect x="34" y="38" width="172" height="22" rx="3" fill="#1E1E1E" opacity=".85" />
      <text x="120" y="54" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontSize={name.length > 22 ? 10 : 13} fill="#F6F0E4">{name}</text>
      <path d="M14 64h212l-10 26H24z" fill={aw} />
      {stripes.map((i) => <path key={i} d={`M${24 + i * 26} 64h13l-2 26h-13z`} fill="#fff" opacity=".35" />)}
      <path d="M24 90q6.5 8 13 0t13 0 13 0 13 0 13 0 13 0 13 0 13 0 13 0 13 0 13 0 13 0 13 0 13 0 13 0 13 0" fill={aw} />
      <rect x="36" y="104" width="100" height="62" rx="4" fill={lit ? "#ffe9a8" : "#dfe9e4"} stroke="#1E1E1E" strokeOpacity=".2" />
      <g transform="translate(70 116) scale(1.6)"><TypeIcon type={type} color="#1B2A4A" /></g>
      <rect x="152" y="104" width="50" height="76" rx="3" fill="#2b2b2b" opacity=".8" />
      <circle cx="194" cy="144" r="2.5" fill="#E9B949" />
      {lit && <g><rect x="44" y="96" width="44" height="14" rx="3" fill="#1B2A4A" /><text x="66" y="106" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif">OPEN</text></g>}
    </svg>
  );
}
