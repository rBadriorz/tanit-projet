import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Heart, Send } from "lucide-react";
import type { Message, Screen } from "../types";
import { Avatar } from "../components/ui";
import { useStore } from "../store";

const KIND_COLOR: Record<Message["kind"], string> = { support: "#34507F", owner: "#C2452D", milestone: "#E9B949", success: "#1B2A4A" };

export default function Wall({ screen }: { screen: Screen }) {
  const st = useStore();
  const [filter, setFilter] = useState<string | undefined>(screen.name === "wall" ? screen.shopId : undefined);
  const [text, setText] = useState("");
  const withPosts = Array.from(new Set(st.messages.map((m) => m.shopId)));
  const list = st.messages.filter((m) => !filter || m.shopId === filter);
  const target = st.shop(filter ?? "marcel");

  const post = () => {
    if (!text.trim() || !target) return;
    st.addPost({ id: "p" + Date.now(), shopId: target.id, author: "Léa", street: "rue de Fougères", ago: "now", kind: "support", text: text.trim(), reactions: 0 });
    setText("");
  };

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="px-4 pt-2">
        <h1 className="serif text-3xl font-semibold">The wall</h1>
        <p className="text-sm text-muted">What the neighbourhood is saying</p>
      </div>
      <div className="no-scrollbar mt-3 flex shrink-0 gap-2 overflow-x-auto px-4 pb-2">
        <FilterChip on={!filter} onClick={() => setFilter(undefined)}>All shops</FilterChip>
        {withPosts.map((id) => (
          <FilterChip key={id} on={filter === id} onClick={() => setFilter(id)}>{st.shop(id)?.name ?? id}</FilterChip>
        ))}
      </div>
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
        <motion.div layout className="space-y-3">
          <AnimatePresence initial={false}>
            {list.map((m) => <Post key={m.id} m={m} />)}
          </AnimatePresence>
        </motion.div>
      </div>
      {target && (
        <div className="flex shrink-0 items-center gap-2 border-t border-line bg-cream px-3 py-2">
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && post()}
            placeholder={`Write to ${target.name}`} aria-label={`Write to ${target.name}`}
            className="min-h-[46px] flex-1 rounded-full border border-line bg-paper px-4 text-sm" />
          <button onClick={post} aria-label="Post" className="press grid h-[46px] w-[46px] place-items-center rounded-full bg-fir text-white"><Send size={18} /></button>
        </div>
      )}
    </div>
  );
}

function Post({ m }: { m: Message }) {
  const st = useStore();
  const [r, setR] = useState({ heart: m.reactions, in: Math.round(m.reactions / 3), bread: Math.round(m.reactions / 5) });
  const [mine, setMine] = useState<{ heart?: boolean; in?: boolean; bread?: boolean }>({});
  const shop = st.shop(m.shopId);
  const highlight = m.kind === "milestone" || m.kind === "success";
  const react = (k: keyof typeof r) => {
    setR((x) => ({ ...x, [k]: x[k] + (mine[k] ? -1 : 1) }));
    setMine((x) => ({ ...x, [k]: !x[k] }));
  };
  return (
    <motion.div layout initial={{ opacity: 0, y: -16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
      className={`rounded-3xl p-4 shadow-[0_4px_18px_rgba(27, 42, 74,0.08)] ${highlight ? "border-2" : "bg-paper"}`}
      style={highlight ? { borderColor: KIND_COLOR[m.kind], background: m.kind === "success" ? "#e9f1ec" : "#fdf3d8" } : {}}>
      <div className="flex items-center gap-3">
        <Avatar name={m.author} size={38} color={KIND_COLOR[m.kind]} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{m.author}</div>
          <div className="truncate text-xs text-muted">{m.street ? `${m.street} · ` : ""}{m.ago}</div>
        </div>
        {shop && (
          <button onClick={() => st.go({ name: "shop", id: shop.id })} className="press max-w-[40%] truncate rounded-full bg-cream px-2.5 py-1 text-[11px] font-semibold text-fir">
            {shop.name}
          </button>
        )}
      </div>
      <p className="mt-3 text-[15px] leading-snug">{m.text}</p>
      <div className="mt-3 flex gap-2 text-xs">
        <React on={mine.heart} onClick={() => react("heart")}><Heart size={14} className={mine.heart ? "fill-terracotta text-terracotta" : ""} /> {r.heart}</React>
        <React on={mine.in} onClick={() => react("in")}>I'm in · {r.in}</React>
        <React on={mine.bread} onClick={() => react("bread")}>🥖 {r.bread}</React>
      </div>
    </motion.div>
  );
}

function React({ on, onClick, children }: { on?: boolean | undefined; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button whileTap={{ scale: 1.15 }} onClick={onClick}
      className={`flex min-h-[36px] items-center gap-1 rounded-full px-3 ${on ? "bg-fir text-white" : "bg-cream text-ink"}`}>{children}</motion.button>
  );
}
function FilterChip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`press min-h-[40px] shrink-0 rounded-full px-4 text-sm ${on ? "bg-fir text-white" : "bg-paper text-ink shadow-sm"}`}>{children}</button>
  );
}
