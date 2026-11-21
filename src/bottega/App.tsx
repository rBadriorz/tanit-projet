import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ComponentType } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Map as MapIcon, Store, MessageCircle, Briefcase, User, Wifi, Signal, BatteryMedium, Settings2 } from "lucide-react";
import { APP_NAME, APP_TAGLINE } from "./config";
import { StoreProvider, useStore } from "./store";
import type { Screen } from "./types";
import Home from "./screens/Home";
import MapScreen from "./screens/MapScreen";
import Projects from "./screens/Projects";
import ShopPage from "./screens/ShopPage";
import Takeover from "./screens/Takeover";
import Gap from "./screens/Gap";
import PosterEditor from "./screens/PosterEditor";
import Wall from "./screens/Wall";
import Owner from "./screens/Owner";
import Services from "./screens/Services";
import Me from "./screens/Me";
import Legal from "./screens/Legal";
import Impact from "./screens/Impact";
import About from "./screens/About";
import How from "./screens/How";
import Flag from "./screens/Flag";
import Presenter from "./components/Presenter";
import { Logo, Mascot } from "./components/Logo";
import { AI_PITCH } from "./components/AiTeam";
import { Celebration } from "./components/CoOwnerCard";
import { publicOrigin, qrIsLocal } from "./lib/url";
import { P } from "./theme";

const SCREENS: Record<Screen["name"], ComponentType<{ screen: Screen }>> = {
  home: Home, map: MapScreen, projects: Projects, wall: Wall, services: Services, me: Me,
  shop: ShopPage, takeover: Takeover, owner: Owner, poster: PosterEditor, gap: Gap,
  legal: Legal, impact: Impact, about: About, how: How, flag: Flag,
};
const TABS: { name: Screen["name"]; label: string; Icon: typeof MapIcon }[] = [
  { name: "map", label: "Map", Icon: MapIcon },
  { name: "projects", label: "Projects", Icon: Store },
  { name: "wall", label: "Wall", Icon: MessageCircle },
  { name: "services", label: "Services", Icon: Briefcase },
  { name: "me", label: "Me", Icon: User },
];
const TAB_SCREENS = new Set(["home", ...TABS.map((t) => t.name)]);

export function BottegaApp({ initial }: { initial: Screen }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="min-h-screen grain" />;
  return (
    <StoreProvider initial={initial}>
      <Shell />
    </StoreProvider>
  );
}

function useIsPhone() {
  const [phone, setPhone] = useState(() => window.innerWidth < 500);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const f = () => {
      setPhone(window.innerWidth < 500);
      setScale(Math.min(1, (window.innerHeight - 32) / 868, (window.innerWidth - 40) / 414));
    };
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return { phone, scale };
}

function Shell() {
  const { phone, scale } = useIsPhone();
  const [presenter, setPresenter] = useState(false);
  if (phone) {
    return <div className="fixed inset-0 overflow-hidden grain"><Screens /></div>;
  }
  return (
    <div className="grain fixed inset-0 flex items-center justify-center gap-10 overflow-hidden px-6">
      <aside className="hidden max-w-[300px] lg:block">
        <h1><Logo height={104} /></h1>
        <p className="serif mt-3 text-2xl italic text-primary-dark">{APP_TAGLINE}</p>
        <ul className="mt-8 space-y-4 text-lg">
          {["Find the shops about to close", "Take over with your neighbours", AI_PITCH].map((b) => (
            <li key={b} className="flex gap-3"><span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary-dark" />{b}</li>
          ))}
        </ul>
      </aside>
      <div style={{ width: 414 * scale, height: 868 * scale }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: 414, height: 868 }}
          className="relative rounded-[60px] bg-[#111] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="relative h-[844px] w-[390px] overflow-hidden rounded-[48px] bg-page">
            <Screens framed />
            <div className="pointer-events-none absolute left-1/2 top-2.5 z-[60] h-[34px] w-[120px] -translate-x-1/2 rounded-full bg-black" />
            <div className="pointer-events-none absolute bottom-2 left-1/2 z-[60] h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-black/70" />
          </div>
        </div>
      </div>
      <aside className="hidden flex-col items-center text-center xl:flex">
        <div className="rounded-3xl bg-surface p-5 shadow-md"><QRCodeSVG value={publicOrigin()} size={180} fgColor={P.primaryDark} bgColor={P.surface} /></div>
        <p className="mt-4 text-lg font-semibold">Scan to try it on your phone</p>
        {qrIsLocal() && <p className="mt-1 max-w-[220px] text-xs text-primary-dark">Local address: set PUBLIC_URL in config.ts for a public QR.</p>}
      </aside>
      <button onClick={() => setPresenter(true)} className="no-print fixed bottom-4 right-4 flex items-center gap-2 rounded-full bg-ink/80 px-4 py-2 text-sm text-white">
        <Settings2 size={16} /> Presenter
      </button>
      {presenter && <Presenter onClose={() => setPresenter(false)} />}
    </div>
  );
}

function StatusBar({ framed }: { framed?: boolean | undefined }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 15_000); return () => clearInterval(t); }, []);
  if (!framed) return <div className="h-[env(safe-area-inset-top)] shrink-0" />; // real phone: no fake status bar
  return (
    <div className={`relative z-[700] flex shrink-0 items-center justify-between px-7 ${framed ? "h-[50px] pt-1" : "h-7"} text-[13px] font-semibold`}>
      {framed ? <span>{now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span> : <span />}
      {framed ? <span className="flex items-center gap-1"><Signal size={14} /><Wifi size={14} /><BatteryMedium size={18} /><span className="text-[11px]">87%</span></span> : <span />}
    </div>
  );
}

function Screens({ framed }: { framed?: boolean | undefined }) {
  const { screen, stack, dir, tab, go, toast } = useStore();
  const C = SCREENS[screen.name];
  const showTabs = TAB_SCREENS.has(screen.name);
  const key = stack.length + ":" + JSON.stringify(screen);
  return (
    <div className="absolute inset-0 flex flex-col">
      <StatusBar framed={framed} />
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={dir}>
          <motion.div key={key} custom={dir} className="absolute inset-0"
            initial={{ x: dir > 0 ? "100%" : "-30%", opacity: dir > 0 ? 1 : 0.6 }}
            animate={{ x: 0, opacity: 1 }} exit={{ x: dir > 0 ? "-30%" : "100%", opacity: 0.6 }}
            transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}>
            <C screen={screen} />
          </motion.div>
        </AnimatePresence>
        <Celebration />
        {/* Floating chat button: the assistant, one tap away (not on the map or the wall, whose bottom corner is taken). */}
        <AnimatePresence>
          {showTabs && screen.name !== "map" && screen.name !== "wall" && (
            <motion.button key="chat" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
              whileTap={{ scale: 0.92 }} onClick={() => go({ name: "legal" })} aria-label={`Ask ${APP_NAME}, the assistant`}
              className="absolute bottom-3 right-3 z-40 flex h-14 items-center gap-1.5 rounded-full bg-primary pl-1.5 pr-4 text-sm font-semibold text-white shadow-[0_8px_24px_color-mix(in_srgb,var(--primary-dark)_35%,transparent)]">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white"><Mascot size={30} /></span>
              Ask {APP_NAME}
            </motion.button>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {toast && (
            <motion.div initial={{ y: -80 }} animate={{ y: 0 }} exit={{ y: -80 }}
              className="absolute inset-x-3 top-1 z-50 rounded-2xl bg-ink/90 px-4 py-3 text-sm text-white shadow-lg">{toast}</motion.div>
          )}
        </AnimatePresence>
      </div>
      {showTabs && (
        <nav className={`relative z-30 flex shrink-0 border-t border-line bg-surface/95 ${framed ? "pb-5" : "pb-2"}`}>
          {TABS.map(({ name, label, Icon }) => {
            const on = screen.name === name;
            return (
              <button key={name} onClick={() => tab({ name } as Screen)} className={`press flex min-h-[54px] flex-1 flex-col items-center justify-center gap-0.5 text-[11px] ${on ? "font-semibold text-primary" : "text-muted"}`}>
                <Icon size={22} strokeWidth={on ? 2.4 : 1.8} />{label}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
