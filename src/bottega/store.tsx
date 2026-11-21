import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Contribution, Message, Screen, Shop } from "./types";
import { SHOPS } from "./data/shops";
import { MESSAGES } from "./data/messages";

const KEY = "bottega-demo-v2"; // v2: contributions carry a pending / approved status

interface Persisted {
  contributions: Contribution[];
  extraShops: Shop[];                       // shops added by the owner flow / flag
  shopPatches: Record<string, Partial<Shop>>; // e.g. raise opened
  posts: Message[];                         // posts written in the app
  applications: { shopId: string; name: string; experience: string; message: string }[];
  backerBumps: Record<string, number>;      // presenter "+1 neighbour"
  aiMode: "live" | "scripted";
}
const EMPTY: Persisted = { contributions: [], extraShops: [], shopPatches: {}, posts: [], applications: [], backerBumps: {}, aiMode: "live" };

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

interface Store extends Persisted {
  shops: Shop[];
  messages: Message[];
  shop: (id: string) => Shop | undefined;
  stack: Screen[];
  screen: Screen;
  dir: 1 | -1;
  go: (s: Screen) => void;
  tab: (s: Screen) => void;
  back: () => void;
  contribute: (shopId: string, firstName: string, amount: number) => Contribution;
  approvePending: () => Contribution[];
  celebrate: Contribution | null;           // approved request to celebrate (confetti + co-owner card)
  setCelebrate: (c: Contribution | null) => void;
  addShop: (s: Shop) => void;
  patchShop: (id: string, p: Partial<Shop>) => void;
  addPost: (m: Message) => void;
  apply: (a: Persisted["applications"][number]) => void;
  bump: (shopId: string) => void;
  setAiMode: (m: "live" | "scripted") => void;
  aiLast: "live" | "scripted" | null;
  setAiLast: (m: "live" | "scripted") => void;
  toast: string | null;
  notify: (t: string) => void;
  reset: () => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children, initial }: { children: ReactNode; initial: Screen }) {
  const [p, setP] = useState<Persisted>(EMPTY);
  const [stack, setStack] = useState<Screen[]>([initial]);
  const [dir, setDir] = useState<1 | -1>(1);
  const [aiLast, setAiLast] = useState<"live" | "scripted" | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState<Contribution | null>(null);

  useEffect(() => setP(load()), []);
  const save = useCallback((f: (x: Persisted) => Persisted) => {
    setP((prev) => {
      const next = f(prev);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* private mode */ }
      return next;
    });
  }, []);

  const shops = useMemo(() => {
    const all = [...SHOPS, ...p.extraShops].map((s) => {
      const patch = p.shopPatches[s.id];
      let shop: Shop = patch ? { ...s, ...patch } : s;
      if (shop.raise) {
        // Only approved requests count as raised money; pending ones are shown apart.
        const mine = p.contributions.filter((c) => c.shopId === shop.id);
        const approved = mine.filter((c) => c.status === "approved");
        const add = approved.reduce((a, c) => a + c.amount, 0);
        const pending = mine.filter((c) => c.status === "pending").reduce((a, c) => a + c.amount, 0);
        const bumps = p.backerBumps[shop.id] || 0;
        if (add || bumps || pending) shop = { ...shop, raise: { ...shop.raise, raised: shop.raise.raised + add + bumps * 100, pending, backers: shop.raise.backers + approved.length + bumps } };
      }
      return shop;
    });
    return all;
  }, [p]);

  const messages = useMemo(() => [...p.posts, ...MESSAGES], [p.posts]);

  const store: Store = {
    ...p, shops, messages, stack, dir, aiLast, setAiLast, toast,
    screen: stack[stack.length - 1] ?? { name: "home" },
    shop: (id) => shops.find((s) => s.id === id),
    go: (s) => { setDir(1); setStack((st) => [...st, s]); },
    tab: (s) => { setDir(1); setStack([s]); },
    back: () => { setDir(-1); setStack((st) => (st.length > 1 ? st.slice(0, -1) : [{ name: "home" }])); },
    contribute: (shopId, firstName, amount) => {
      // A request, not a share: it stays pending until the partner checks it and the lead buyer approves.
      const c: Contribution = { id: "c-" + Date.now(), shopId, firstName, amount, at: new Date().toISOString(), share: 0, status: "pending" };
      save((x) => ({ ...x, contributions: [...x.contributions, c] }));
      return c;
    },
    approvePending: () => {
      const pending = p.contributions.filter((c) => c.status === "pending");
      if (!pending.length) return [];
      const next = [...p.contributions];
      const done: Contribution[] = [];
      const count: Record<string, number> = {};
      for (let i = 0; i < next.length; i++) {
        const c = next[i]!;
        if (c.status !== "pending") continue;
        const shop = shops.find((s) => s.id === c.shopId);
        count[c.shopId] = (count[c.shopId] || 0) + 1;
        const share = (shop?.raise?.backers ?? 0) + count[c.shopId]!;
        const a: Contribution = { ...c, status: "approved", share, approvedAt: new Date().toISOString() };
        next[i] = a;
        done.push(a);
      }
      save((x) => ({ ...x, contributions: next }));
      setCelebrate(done[done.length - 1] ?? null);
      return done;
    },
    celebrate,
    setCelebrate,
    addShop: (s) => save((x) => ({ ...x, extraShops: [...x.extraShops.filter((e) => e.id !== s.id), s] })),
    patchShop: (id, patch) => save((x) => ({ ...x, shopPatches: { ...x.shopPatches, [id]: { ...x.shopPatches[id], ...patch } } })),
    addPost: (m) => save((x) => ({ ...x, posts: [m, ...x.posts] })),
    apply: (a) => save((x) => ({ ...x, applications: [...x.applications, a] })),
    bump: (shopId) => save((x) => ({ ...x, backerBumps: { ...x.backerBumps, [shopId]: (x.backerBumps[shopId] || 0) + 1 } })),
    setAiMode: (m) => save((x) => ({ ...x, aiMode: m })),
    notify: (t) => { setToast(t); setTimeout(() => setToast(null), 3500); },
    reset: () => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } setP({ ...EMPTY }); setStack([{ name: "home" }]); },
  };
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("StoreProvider missing");
  return s;
}

export const euro = (n: number) => "€" + Math.round(n).toLocaleString("en-GB");
export const pct = (s: Shop) => (s.raise ? Math.min(100, Math.round((s.raise.raised / s.raise.target) * 100)) : s.status === "taken_over" ? 100 : 0);
