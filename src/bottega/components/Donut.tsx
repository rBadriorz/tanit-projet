import { motion } from "framer-motion";

export interface DonutSlice { label: string; value: number; color: string }

/** Plain SVG donut, animated. Legend optional. */
export function Donut({ data, size = 140, legend = true }: { data: DonutSlice[]; size?: number; legend?: boolean }) {
  const total = data.reduce((a, d) => a + Math.max(0, d.value), 0) || 1;
  const r = 15.9155; // circumference = 100
  let offset = 0;
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox="0 0 42 42" role="img" aria-label="Financing plan chart" className="shrink-0">
        <circle cx="21" cy="21" r={r} fill="none" stroke="#e6dcc8" strokeWidth="6" />
        {data.map((d) => {
          const len = (Math.max(0, d.value) / total) * 100;
          const el = (
            <motion.circle key={d.label} cx="21" cy="21" r={r} fill="none" stroke={d.color} strokeWidth="6"
              transform="rotate(-90 21 21)"
              initial={{ strokeDasharray: `0 100`, strokeDashoffset: -offset }}
              animate={{ strokeDasharray: `${len} ${100 - len}`, strokeDashoffset: -offset }}
              transition={{ duration: 0.8, ease: "easeOut" }} />
          );
          offset += len;
          return el;
        })}
      </svg>
      {legend && (
        <ul className="min-w-0 flex-1 space-y-1.5 text-[12px]">
          {data.map((d) => (
            <li key={d.label} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
              <span className="flex-1 truncate">{d.label}</span>
              <b>€{Math.round(d.value / 1000)}k</b>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Donut;
