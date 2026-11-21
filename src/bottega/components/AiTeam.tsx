import { motion } from "framer-motion";
import { BadgeEuro, Calculator, FileText, MessageCircle, PiggyBank, Scale, type LucideIcon } from "lucide-react";
import { APP_NAME } from "../config";
import { useStore } from "../store";
import type { Screen } from "../types";

export const AI_PITCH = "AI does the work of a dealmaker, a banker and a lawyer, so a baker can take over a bakery.";

const DEMO_SHOP = "marcel";

const TEAM: { title: string; line: string; Icon: LucideIcon; color: string; to: Screen }[] = [
  { title: "Valuation", line: "Estimates what the shop is worth and explains the range.", Icon: Calculator, color: "#1B2A4A", to: { name: "takeover", shopId: DEMO_SHOP } },
  { title: "Financing", line: "Builds the plan (own savings, neighbours' raise, honour loans, partner bank) and stress-tests it.", Icon: PiggyBank, color: "#C2452D", to: { name: "gap", shopId: DEMO_SHOP } },
  { title: "Grants", line: "Finds the French and EU grants that fit the project.", Icon: BadgeEuro, color: "#B98A12", to: { name: "gap", shopId: DEMO_SHOP } },
  { title: "Bank file", line: "Writes a bank-ready file in minutes.", Icon: FileText, color: "#34507F", to: { name: "takeover", shopId: DEMO_SHOP } },
  { title: "Legal", line: "Drafts the company statutes and shareholders' agreement, and flags what a professional must check.", Icon: Scale, color: "#1B2A4A", to: { name: "legal" } },
  { title: APP_NAME, line: "The friendly assistant who explains the jargon to residents and buyers.", Icon: MessageCircle, color: "#C2452D", to: { name: "legal" } },
];

/** "Your AI takeover team": 6 small cards, each opening the matching screen. */
export function AiTeam({ className = "" }: { className?: string }) {
  const { go } = useStore();
  return (
    <section className={className} aria-labelledby="ai-team-title">
      <h2 id="ai-team-title" className="serif text-xl font-semibold">Your AI takeover team</h2>
      <p className="mt-1 text-sm text-muted">{AI_PITCH}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {TEAM.map(({ title, line, Icon, color, to }) => (
          <motion.button key={title} whileTap={{ scale: 0.97 }} onClick={() => go(to)}
            className="flex min-h-[44px] flex-col items-start gap-1.5 rounded-2xl bg-paper p-3 text-left shadow-[0_4px_14px_rgba(27,42,74,0.07)]">
            <span className="grid h-9 w-9 place-items-center rounded-xl text-white" style={{ background: color }}><Icon size={18} aria-hidden /></span>
            <span className="text-sm font-semibold">{title}</span>
            <span className="text-xs leading-snug text-muted">{line}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
