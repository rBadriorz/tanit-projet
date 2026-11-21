import { motion, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { APP_NAME } from "../config";
import { useStore } from "../store";
import { STATS } from "../data/stats";
import type { Screen } from "../types";
import { Awning } from "../components/Logo";
import { AiTeam } from "../components/AiTeam";
import { P } from "../theme";

let splashShown = false;

function CountUp({ to }: { to: number }) {
  const [v, setV] = useState(0);
  useEffect(() => { const c = animate(0, to, { duration: 1.4, onUpdate: (x) => setV(Math.round(x)) }); return () => c.stop(); }, [to]);
  return <>{v.toLocaleString("en-GB")}</>;
}

export default function Home(_p: { screen: Screen }) {
  const { go, tab, contributions } = useStore();
  const [splash, setSplash] = useState(!splashShown);
  useEffect(() => { if (!splash) return; const t = setTimeout(() => { splashShown = true; setSplash(false); }, 1300); return () => clearTimeout(t); }, [splash]);

  if (splash) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-page">
        <div className="flex flex-col items-center">
          <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ transformOrigin: "top" }}>
            <Awning size={96} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="serif mt-4 text-4xl font-semibold text-primary">{APP_NAME}</motion.h1>
        </div>
      </div>
    );
  }

  return (
    <div className="no-scrollbar absolute inset-0 overflow-y-auto px-5 pb-6">
      <div className="flex items-center gap-2 pt-2"><Awning size={30} /><span className="serif text-2xl font-semibold text-primary">{APP_NAME}</span></div>
      <Street />
      <h1 className="serif mt-4 text-[30px] font-semibold leading-tight">Every street deserves its corner shop.</h1>
      <div className="mt-5 grid gap-3">
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => go({ name: "owner" })} className="rounded-3xl bg-primary-dark p-5 text-left text-white">
          <div className="serif text-xl font-semibold">I'm looking for a successor</div>
          <div className="mt-1 text-sm italic opacity-80">Je cherche la relève</div>
        </motion.button>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => tab({ name: "map" })} className="rounded-3xl bg-primary p-5 text-left text-white">
          <div className="serif text-xl font-semibold">I'm taking over</div>
          <div className="mt-1 text-sm italic opacity-80">Je prends la relève</div>
        </motion.button>
      </div>
      <button onClick={() => go({ name: "impact" })} className="mt-4 w-full rounded-2xl bg-surface p-4 text-left text-sm shadow-sm">
        <b className="text-primary"><CountUp to={STATS.coOwners + contributions.filter((c) => c.status === "approved").length} /></b> neighbours have joined a takeover · <b className="text-primary"><CountUp to={STATS.shopsSaved} /></b> shops saved
      </button>
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <button onClick={() => go({ name: "how" })} className="press min-h-[44px] rounded-full bg-surface px-4 shadow-sm">How it works</button>
        <button onClick={() => go({ name: "flag" })} className="press min-h-[44px] rounded-full bg-surface px-4 shadow-sm">Flag a shop</button>
        <button onClick={() => go({ name: "poster", shopId: "martin", kind: "successor" })} className="press min-h-[44px] rounded-full bg-surface px-4 shadow-sm">Posters</button>
        <button onClick={() => go({ name: "takeover", shopId: "marcel" })} className="press min-h-[44px] rounded-full bg-surface px-4 shadow-sm">Start a takeover</button>
      </div>
      <AiTeam className="mt-6" />
    </div>
  );
}

function Street() {
  const fronts = [
    { a: P.primary, f: P.facade2 }, { a: P.primaryDark, f: P.facade2 }, { a: P.warning, f: P.facade2 }, { a: P.brown2, f: P.facade1 },
  ];
  return (
    <svg viewBox="0 0 350 150" className="mt-3 w-full" role="img" aria-label="A street of small shops">
      <rect y="132" width="350" height="18" fill={P.primaryLight} />
      {fronts.map((c, i) => (
        <g key={i} transform={`translate(${8 + i * 85} ${20 + (i % 2) * 12})`}>
          <rect width="78" height={112 - (i % 2) * 12} fill={c.f} stroke={P.text} strokeOpacity=".12" />
          <path d="M-4 30h86l-6 16H2z" fill={c.a} />
          {[0, 1, 2, 3].map((s) => <path key={s} d={`M${4 + s * 20} 30h10l-1 16h-10z`} fill="#fff" opacity=".35" />)}
          <rect x="8" y="56" width="36" height="34" rx="3" fill={P.facade3} stroke={P.text} strokeOpacity=".2" />
          <rect x="52" y="56" width="18" height={56 - (i % 2) * 12} fill="#3a3a3a" opacity=".8" />
          <rect x="10" y="8" width="58" height="12" rx="2" fill={P.text} opacity=".75" />
        </g>
      ))}
    </svg>
  );
}
