import type { Candidate } from "../types";
import { P } from "../theme";

// Fictional people who answered "Wanted: manager" listings (demo data).
export const CANDIDATES: Candidate[] = [
  { id: "cand-amandine", name: "Amandine", age: 32, trade: "Baker, 2nd in command in a village bakery", years: 8, color: P.primary,
    message: "I've run the night shift for six years. I'd love a shop where the neighbours are partners, not just customers." },
  { id: "cand-youssef", name: "Youssef", age: 41, trade: "Pastry chef, career in hotel kitchens", years: 15, color: P.brown3,
    message: "I want to swap hotel banquets for a counter and regulars. Happy to put part of my savings in as a shareholder." },
  { id: "cand-lucie", name: "Lucie", age: 25, trade: "Young graduate, CAP boulanger + 2 years in a chain", years: 3, color: P.brown2,
    message: "Ready to learn from the current owner for a few months. I live 10 minutes away and can start in spring." },
];
