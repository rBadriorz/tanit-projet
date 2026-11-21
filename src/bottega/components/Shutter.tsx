import { motion } from "framer-motion";

/** Metal roller shutter covering the hero. `open` = 0..100 (% raised). */
export function Shutter({ open }: { open: number }) {
  const slats = Array.from({ length: 22 }, (_, i) => i);
  const o = Math.max(0, Math.min(100, open));
  return (
    <motion.div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div className="absolute inset-x-0 top-0 h-full"
        initial={false} animate={{ y: `-${o}%` }} transition={{ type: "spring", damping: 20, stiffness: 60 }}>
        <svg viewBox="0 0 240 180" preserveAspectRatio="none" className="h-full w-full">
          <rect width="240" height="180" fill="#9a9a96" />
          {slats.map((i) => (
            <g key={i}>
              <rect y={i * 8.2} width="240" height="7" fill={i % 2 ? "#b4b4af" : "#aeaea9"} />
              <rect y={i * 8.2 + 7} width="240" height="1.2" fill="#7d7d79" />
            </g>
          ))}
          <rect y="172" width="240" height="8" fill="#6f6f6b" />
          <rect x="108" y="173" width="24" height="4" rx="2" fill="#4a4a47" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

export default Shutter;
