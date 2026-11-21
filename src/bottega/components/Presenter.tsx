import { X } from "lucide-react";
import { useStore } from "../store";
import type { Message, Screen } from "../types";

const SCRIPTED_POSTS: Omit<Message, "id">[] = [
  { shopId: "marcel", author: "Jurors of the hackathon", street: "Sciences Po", ago: "now", kind: "support", text: "We just scanned the poster. Count us in for the croissants!", reactions: 12 },
  { shopId: "pages", author: "Librairie Les Pages", street: "", ago: "now", kind: "milestone", text: "Librairie Les Pages: 90% reached! 📚", reactions: 40 },
  { shopId: "marcel", author: "Karim (lead buyer)", street: "rue des Tilleuls", ago: "now", kind: "owner", text: "The bank said yes in principle. Thank you, neighbours!", reactions: 58 },
];

export default function Presenter({ onClose }: { onClose: () => void }) {
  const st = useStore();
  const jump = (s: Screen, asTab = false) => (asTab ? st.tab(s) : (st.tab({ name: "home" }), st.go(s)));
  let postIdx = 0;
  const pushPost = () => {
    const p = SCRIPTED_POSTS[(st.posts.length + postIdx++) % SCRIPTED_POSTS.length]!;
    st.addPost({ ...p, id: "pres-" + Date.now() });
    st.notify(`${p.author} posted on the wall`);
  };
  const shutter = () => {
    jump({ name: "shop", id: "marcel" });
    [0, 1, 2, 3, 4].forEach((i) => setTimeout(() => st.bump("marcel"), 600 + i * 350));
  };
  const pendingCount = st.contributions.filter((c) => c.status === "pending").length;
  const approve = () => {
    const done = st.approvePending();
    if (!done.length) st.notify("No pending request. Join a shop first (Join from €100).");
  };
  const B = ({ children, onClick, kind }: { children: React.ReactNode; onClick: () => void; kind?: "danger" }) => (
    <button onClick={onClick} className={`press min-h-[36px] rounded-xl px-3 text-xs font-semibold ${kind === "danger" ? "bg-terracotta text-white" : "bg-cream text-ink"}`}>{children}</button>
  );
  return (
    <div className="no-print fixed bottom-16 right-4 z-[100] max-h-[80vh] w-[320px] overflow-y-auto rounded-3xl bg-paper p-4 text-ink shadow-2xl">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-semibold">Presenter</div>
        <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full bg-cream"><X size={16} /></button>
      </div>

      <div className="mb-3 flex items-center justify-between rounded-2xl bg-cream p-3 text-xs">
        <span className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${st.aiMode === "live" ? "bg-fir-light" : "bg-sun"}`} />
          AI: {st.aiMode === "live" ? "live" : "scripted (forced)"}{st.aiLast ? ` · last answer ${st.aiLast}` : ""}
        </span>
        <button onClick={() => st.setAiMode(st.aiMode === "live" ? "scripted" : "live")} className="rounded-lg bg-fir px-2 py-1 font-semibold text-white">
          {st.aiMode === "live" ? "Force scripted" : "Go live"}
        </button>
      </div>

      <div className="mb-1 text-[11px] font-semibold uppercase text-muted">Live moments</div>
      <div className="mb-3 flex flex-wrap gap-2">
        <B onClick={() => { st.bump("marcel"); st.notify("+1 neighbour joined Boulangerie de Marcel"); }}>+1 neighbour joined</B>
        <B onClick={shutter}>Trigger shutter</B>
        <B onClick={approve}>Approve pending requests{pendingCount ? ` (${pendingCount})` : ""}</B>
        <B onClick={pushPost}>Push wall message</B>
        <B onClick={() => st.notify("Café du Marché is at 75%")}>Push notification</B>
        <B onClick={() => st.notify("A shop near you is looking for a successor")}>Nearby alert</B>
      </div>

      <div className="mb-1 text-[11px] font-semibold uppercase text-muted">Jump to</div>
      <div className="mb-3 flex flex-wrap gap-2">
        <B onClick={() => jump({ name: "home" }, true)}>Home</B>
        <B onClick={() => jump({ name: "map" }, true)}>Map</B>
        <B onClick={() => jump({ name: "shop", id: "marcel" })}>Marcel's bakery</B>
        <B onClick={() => jump({ name: "shop", id: "marcel" })}>Join (Marcel)</B>
        <B onClick={() => jump({ name: "takeover", shopId: "marcel" })}>Takeover / bank file</B>
        <B onClick={() => jump({ name: "gap", shopId: "marcel" })}>Close the gap</B>
        <B onClick={() => jump({ name: "poster", shopId: "martin", kind: "successor" })}>Successor poster</B>
        <B onClick={() => jump({ name: "poster", shopId: "marcel", kind: "raise" })}>Raise poster</B>
        <B onClick={() => jump({ name: "wall" }, true)}>Wall</B>
        <B onClick={() => jump({ name: "services" }, true)}>Services</B>
        <B onClick={() => jump({ name: "legal" })}>Legal assistant</B>
        <B onClick={() => jump({ name: "impact" })}>Impact</B>
        <B onClick={() => jump({ name: "owner" })}>Owner flow</B>
      </div>

      <div className="mb-1 text-[11px] font-semibold uppercase text-muted">Revenue per takeover (Marcel)</div>
      <table className="mb-3 w-full text-xs">
        <tbody>
          <tr><td>Raise fee 5% × €40,000</td><td className="text-right font-semibold">€2,000</td></tr>
          <tr><td>Bank referral 1% × €110,000</td><td className="text-right font-semibold">€1,100</td></tr>
          <tr><td>Services €150 × 12</td><td className="text-right font-semibold">€1,800/yr</td></tr>
        </tbody>
      </table>

      <B kind="danger" onClick={() => { st.reset(); st.notify("Demo reset"); }}>Reset demo data</B>
    </div>
  );
}
