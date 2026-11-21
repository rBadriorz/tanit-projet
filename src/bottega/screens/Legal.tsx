import { AnimatePresence, motion } from "framer-motion";
import { APP_NAME } from "../config";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import type { Screen } from "../types";
import { Page } from "../components/ui";
import { useStore } from "../store";
import { runAgent } from "../lib/agent";
import { LEGAL_QUESTIONS, scriptedLegal, type LegalResult } from "../data/scripted";

const DISCLAIMER = "This is general information, not legal advice. Our partner lawyer can review your case.";

export default function Legal(_p: { screen: Screen }) {
  const st = useStore();
  const [msgs, setMsgs] = useState<{ from: "me" | "ai"; text: string }[]>([
    { from: "ai", text: "Hello! I answer questions about taking over a small shop in France: company form, lease, staff, crowdfunding, tax. What would you like to know?" },
  ]);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy]);

  const ask = async (q: string) => {
    if (!q.trim() || busy) return;
    setMsgs((m) => [...m, { from: "me", text: q }]);
    setText("");
    setBusy(true);
    const { data, source } = await runAgent<LegalResult>("legal", { question: q }, () => scriptedLegal(q), { mode: st.aiMode });
    st.setAiLast(source);
    const answer = data.answer.includes("not legal advice") ? data.answer : `${data.answer}\n\n${DISCLAIMER}`;
    setMsgs((m) => [...m, { from: "ai", text: answer }]);
    setBusy(false);
  };

  return (
    <Page title={`${APP_NAME} · legal assistant`} noPad right={<span className="grid h-10 w-10 place-items-center rounded-full bg-primary font-semibold text-white" aria-hidden>{APP_NAME[0]}</span>}>
      <div className="flex min-h-full flex-col px-4 pb-40">
        <div className="space-y-3">
          {msgs.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`max-w-[85%] whitespace-pre-line rounded-3xl px-4 py-3 text-[15px] leading-snug ${m.from === "me" ? "ml-auto bg-primary text-white" : "rounded-tl-md border border-line bg-primary-light text-ink"}`}>
              {m.text}
            </motion.div>
          ))}
          <AnimatePresence>
            {busy && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex w-16 gap-1 rounded-3xl rounded-tl-md bg-primary-light px-4 py-4" aria-label="The assistant is typing">
                {[0, 1, 2].map((d) => <motion.span key={d} className="h-2 w-2 rounded-full bg-muted" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: d * 0.15 }} />)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div ref={end} />
      </div>
      <div className="absolute inset-x-0 bottom-0 border-t border-line bg-page px-3 pb-3 pt-2">
        <div className="no-scrollbar mb-2 flex gap-2 overflow-x-auto">
          {LEGAL_QUESTIONS.map((q) => (
            <button key={q} onClick={() => ask(q)} disabled={busy} className="press min-h-[40px] shrink-0 rounded-full bg-surface px-3 text-xs shadow-sm disabled:opacity-50">{q}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask(text)}
            placeholder="Ask a question" aria-label="Ask a question" className="min-h-[46px] flex-1 rounded-full border border-line bg-surface px-4 text-sm" />
          <button onClick={() => ask(text)} aria-label="Send" className="press grid h-[46px] w-[46px] place-items-center rounded-full bg-primary text-white"><Send size={18} /></button>
        </div>
        <p className="mt-2 text-center text-[11px] text-muted">{DISCLAIMER}</p>
      </div>
    </Page>
  );
}
