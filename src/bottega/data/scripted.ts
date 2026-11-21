// Scripted results for every AI agent: used when there is no key, the call fails or is slow,
// or the Presenter forces scripted mode. Same shapes as the live JSON schemas.
import { APP_NAME } from "../config";
import type { Shop } from "../types";

export interface ValuationResult {
  methods: { name: string; value: number; explanation: string }[];
  recommendedPrice: number;
  range: { low: number; high: number };
  comment: string;
}
export interface BankFileResult {
  executiveSummary: string;
  financingPlan: { source: string; amount: number; note: string }[];
  loan: { amount: number; years: number; rate: number; monthly: number };
  dscr: number;
  strengths: string[];
  risks: { risk: string; mitigation: string }[];
  nextSteps: string[];
}
export interface LegalResult { answer: string }
export interface StoryResult { title: string; paragraphs: string[]; pullQuote: string; posterSubline: string }
export type SubsidyType = "grant" | "honour_loan" | "guarantee" | "tax_relief" | "loan";
export type SubsidyLevel = "local" | "regional" | "national" | "EU";
export interface SubsidyMatch {
  name: string; type: SubsidyType; level: SubsidyLevel;
  estimatedAmount: number; // conservative cash value used in the plan (0 for guarantees / reliefs)
  range: string;           // indicative range shown to the user
  why: string;
  eligibility: { criterion: string; met: boolean }[];
  howToApply: string[];
}
export interface SubsidyResult { matches: SubsidyMatch[]; totalEstimated: number; caveat: string }

export interface BankFileOpts {
  price?: number; revenue?: number; ebitda?: number; rent?: number; staff?: number;
  contribution?: number; salary?: number; role?: "employee" | "resident" | "other"; years?: number;
}

const r1000 = (n: number) => Math.round(n / 1000) * 1000;

/** Monthly repayment of an amortised loan. */
export function monthly(amount: number, ratePct: number, years: number) {
  const r = ratePct / 100 / 12;
  const n = years * 12;
  if (amount <= 0) return 0;
  if (r === 0) return amount / n;
  return (amount * r) / (1 - Math.pow(1 + r, -n));
}

/** Debt service coverage: (EBITDA - salary uplift) / yearly debt service (bank + honour loan over 5 years). */
export function dscrOf(ebitda: number, bankMonthly: number, honourLoan: number, salaryUplift = 6000, sellerCredit = 0) {
  const service = bankMonthly * 12 + honourLoan / 5 + sellerCredit / 3;
  return service > 0 ? Math.round(((ebitda - salaryUplift) / service) * 10) / 10 : 9.9;
}

export function scriptedValuation(shop: Shop, o: BankFileOpts = {}): ValuationResult {
  const ebitda = o.ebitda ?? shop.ebitda ?? 30000;
  const revenue = o.revenue ?? shop.revenue ?? 200000;
  const price = o.price ?? shop.price ?? r1000(ebitda * 3.6);
  const ebitdaVal = r1000(ebitda * 3.5);
  const revVal = r1000(revenue * 0.6);
  const assetVal = shop.id === "rene" ? 182000 : r1000((ebitdaVal + revVal) / 2 * 0.98);
  const rec = shop.id === "rene" ? 180000 : r1000((ebitdaVal + revVal + assetVal) / 3);
  return {
    methods: [
      { name: "EBITDA multiple", value: ebitdaVal, explanation: `${Math.round(ebitda / 1000)}k EBITDA × 3.5, a usual multiple for a profitable local ${shop.type === "bakery" ? "bakery" : "shop"}.` },
      { name: "Share of revenue", value: revVal, explanation: `60% of yearly revenue (€${Math.round(revenue / 1000)}k), the trade rule of thumb for this sector.` },
      { name: "Assets + goodwill", value: assetVal, explanation: "Equipment and fittings at their resale value, plus goodwill for a loyal customer base." },
    ],
    recommendedPrice: rec,
    range: { low: r1000(rec * 0.92), high: r1000(rec * 1.08) },
    comment: price > rec * 1.08
      ? "The asking price is above the range. Negotiate, or ask the owner for a seller credit."
      : "The asking price sits inside the range. It is fair for both sides.",
  };
}

export function scriptedBankFile(shop: Shop, o: BankFileOpts = {}): BankFileResult {
  const price = o.price ?? shop.price ?? 150000;
  const ebitda = o.ebitda ?? shop.ebitda ?? 35000;
  const lead = shop.leadBuyer?.firstName ?? "The lead buyer";
  const owner = shop.owner.firstName;
  const contribution = o.contribution ?? shop.leadBuyer?.contribution ?? Math.max(5000, r1000(price * 0.08));
  const working = r1000(price * 0.0833);
  const need = price + working;
  const neighbours = shop.raise?.target ?? r1000(price * 0.22);
  const honour = Math.min(30000, r1000(price * 0.11));
  const regional = Math.min(10000, r1000(price * 0.055));
  const bank = Math.max(0, need - contribution - neighbours - honour - regional);
  const rate = 4.2, years = 7;
  const m = Math.round(monthly(bank, rate, years));
  const dscr = dscrOf(ebitda, m, honour);
  const backers = shop.raise?.backers ?? 0;
  const yrs = shop.leadBuyer?.yearsExperience ?? o.years ?? 5;
  const k = (n: number) => `€${Math.round(n / 1000)}k`;
  return {
    executiveSummary:
      `${lead} is taking over ${shop.name} (${shop.street}, ${shop.town}) from ${owner}, who is retiring after ${shop.owner.yearsInShop} years. ` +
      `The total need is ${k(need)}: a price of ${k(price)} and ${k(working)} of working capital and small works. ` +
      `${lead} brings ${k(contribution)} and keeps the majority. Neighbours invest ${k(neighbours)} through our licensed crowdfunding partner, ` +
      `which proves local demand and strengthens equity. We ask for a ${k(bank)} loan over ${years} years. ` +
      `With an EBITDA of ${k(ebitda)}, the debt service coverage is about ${dscr.toFixed(1)}.`,
    financingPlan: [
      { source: `${lead}'s equity`, amount: contribution, note: "Personal savings, majority stake" },
      { source: "Neighbours' raise", amount: neighbours, note: `Minority shares from €100${backers ? `, ${backers} backers so far` : ""}` },
      { source: "Honour loan", amount: honour, note: "0% personal loan from a local business-creation network" },
      { source: "Regional support", amount: regional, note: "Shop and craft takeover grant (indicative)" },
      { source: "Bank loan", amount: bank, note: `${years} years at ${rate}%` },
    ],
    loan: { amount: bank, years, rate, monthly: m },
    dscr,
    strengths: [
      shop.leadBuyer?.role === "employee"
        ? `${lead} has worked here for ${yrs} years and knows the trade, the suppliers and the customers.`
        : `${lead} has ${yrs} years of experience in the trade and lives in the neighbourhood.`,
      backers ? `${backers} neighbours already committed: clear proof of demand.` : "Neighbours have pledged to invest: proof of local demand.",
      `${owner} stays for 6 months to hand over recipes, suppliers and habits.`,
    ],
    risks: [
      { risk: `Key-person risk on ${lead}`, mitigation: "Disability insurance and a second skilled employee hired in year 1." },
      { risk: shop.type === "bakery" ? "Flour and energy costs" : "Supplier and energy costs", mitigation: "Group purchasing through the shared services subscription." },
      { risk: "Lease renewal in 2029", mitigation: "A new 9-year commercial lease is negotiated as part of the deal." },
    ],
    nextSteps: [
      "Share this file with two banks and the honour loan network",
      "Open the neighbours' raise for 45 days",
      "Sign the commercial lease transfer with the landlord",
      "Sign the shareholders' agreement and the sale",
    ],
  };
}

export const LEGAL_QUESTIONS = [
  "SAS or cooperative (SCIC) for my bakery?",
  "Can the landlord refuse the lease transfer?",
  "What happens to René's employees?",
  "How do neighbours get their money back if it fails?",
] as const;

const DISCLAIMER = "This is general information, not legal advice. Our partner lawyer can review your case.";

const LEGAL: Record<string, string> = {
  [LEGAL_QUESTIONS[0]]:
    "Both work. An SAS is simple and flexible: the lead buyer holds the majority, neighbours hold minority shares, and a shareholders' agreement sets the rules (votes, perks, exit). Decisions follow the share of capital. An SCIC is a cooperative: one member, one vote, whatever the amount invested, and most profits must stay in the business. It suits a shop seen as a common good, like a bookshop or a village grocery, and some local authorities can join. If the lead buyer wants to run the shop with clear control, choose an SAS. If the street wants equal votes, choose an SCIC.",
  [LEGAL_QUESTIONS[1]]:
    "When you buy the business (fonds de commerce), the commercial lease transfers with it, and a clause that bans the transfer is not valid in that case. The landlord cannot simply refuse. But the lease may require the landlord's approval, a formal notice, or the seller staying jointly liable for the rent for up to three years. Read the lease early, ask for the landlord's agreement in writing, and use the sale to negotiate a fresh 9-year lease. If the lease is close to its end, renewal terms matter for the bank file.",
  [LEGAL_QUESTIONS[2]]:
    "When a business is transferred as a going concern, the employment contracts transfer automatically to the new owner (article L1224-1 of the French Labour Code). René's employees keep their jobs, their seniority, their pay and their contract terms. The buyer cannot use the sale as a reason to dismiss them. In businesses with fewer than 50 staff, employees must also be told about the planned sale at least two months before, so they can make their own offer to buy. Karim, as an employee, can use that right.",
  [LEGAL_QUESTIONS[3]]:
    "Neighbours buy shares, not a loan. If the shop fails, the company is wound up: creditors and the bank are paid first, then shareholders share what is left, which may be nothing. So you may lose what you invest. The raise is run by a licensed crowdfunding platform under the EU ECSP regulation, which requires a clear risk warning, a reflection period of four days for new investors, and a key investment information sheet. Shares are not easy to resell, though the shareholders' agreement can plan buy-backs.",
};

export function scriptedLegal(question: string): LegalResult {
  const answer = LEGAL[question] ??
    "For a small-shop takeover in France, the usual path is: value the business, agree a price with the owner, set up the company (SAS or SCIC), transfer the commercial lease and the staff, raise the money (lead buyer, neighbours through a licensed crowdfunding platform, bank, honour loans), then sign the sale and publish it. Each step has rules and deadlines, so start the lease and staff questions early.";
  return { answer: `${answer}\n\n${DISCLAIMER}` };
}

export function scriptedStory(shop: Shop): StoryResult {
  const lead = shop.leadBuyer?.firstName;
  const paragraphs = shop.story ?? [
    `For ${shop.owner.yearsInShop} years, ${shop.owner.firstName} has kept ${shop.name} open on ${shop.street}. It is where the street says good morning.`,
    `${shop.owner.firstName} is ${shop.owner.age} and wants to retire. Without a successor, the shop would close or become another chain.`,
    lead
      ? `${lead} wants to take over and keep the majority. Neighbours buy the rest, from €100. The shop stays open, and it belongs to the people who love it.`
      : "The neighbours are ready to invest. Now the shop needs someone to run it. Could it be you?",
  ];
  return {
    title: lead ? `${lead} takes over ${shop.name}` : `${shop.name} needs a successor`,
    paragraphs,
    pullQuote: shop.owner.quote,
    posterSubline: `${shop.owner.firstName} is retiring after ${shop.owner.yearsInShop} years. ${lead ? `${lead} wants to take over. ` : ""}Join from €100.`,
  };
}

const BRITTANY = ["Rennes", "Vitré", "Brest", "Quimper", "Saint-Malo", "Lorient", "Vannes"];
export function townSize(town: string): "city" | "small town" | "village" {
  if (/vitré|laval|quimper|saint-malo/i.test(town)) return "small town";
  if (/drôme|village|dieulefit|nyons/i.test(town)) return "village";
  return "city";
}

export function scriptedSubsidies(shop: Shop, o: { jobseeker?: boolean; cooperative?: boolean } = {}): SubsidyResult {
  const size = townSize(shop.town);
  const brittany = BRITTANY.some((t) => shop.town.includes(t));
  const firstBiz = { criterion: "First business for the lead buyer", met: true };
  const takeover = { criterion: "Takeover of an existing local shop", met: true };
  const m: SubsidyMatch[] = [
    {
      name: "Honour loan from a local Initiative France or Réseau Entreprendre association",
      type: "honour_loan", level: "local", estimatedAmount: 20000, range: "€10,000–€30,000 at 0%",
      why: "Personal 0% loan to the lead buyer. Banks count it as equity, which makes the bank loan easier.",
      eligibility: [takeover, firstBiz, { criterion: "Viable business plan", met: true }],
      howToApply: ["Contact the local platform", "Present the bank file to its committee", "Get the decision in 4–6 weeks"],
    },
    {
      name: "Bpifrance guarantee on the bank loan",
      type: "guarantee", level: "national", estimatedAmount: 0, range: "Covers 40–70% of the loan",
      why: "Reduces the personal guarantee asked of the lead buyer.",
      eligibility: [takeover, { criterion: "Loan from a partner bank", met: true }],
      howToApply: ["Your partner bank requests it with the loan", "No separate file needed"],
    },
    {
      name: brittany ? "Région Bretagne support for shops and crafts (e.g. Pass Commerce et Artisanat via the intercommunality)" : "Regional support for shop and craft businesses",
      type: "grant", level: "regional", estimatedAmount: 7500, range: "Up to €7,500",
      why: "Helps fund works and equipment when a local shop is taken over.",
      eligibility: [takeover, { criterion: "Fewer than 10 employees", met: (shop.staff ?? 3) < 10 }, { criterion: "Works or equipment in the plan", met: true }],
      howToApply: ["Ask the intercommunality's business service", "Send quotes before starting the works"],
    },
    {
      name: "ACRE: social-charge relief for the new owner",
      type: "tax_relief", level: "national", estimatedAmount: 0, range: "About 50% off social charges in year 1",
      why: "Lowers the new owner's costs during the first year.",
      eligibility: [firstBiz, { criterion: "Takes control of the company", met: true }],
      howToApply: ["Request it when registering the company with URSSAF"],
    },
    {
      name: "Chambre des Métiers support for craft business takeovers",
      type: "grant", level: "local", estimatedAmount: 0, range: "Free diagnostic and training",
      why: "Training and a takeover diagnostic for craft businesses like bakeries and butchers.",
      eligibility: [{ criterion: "Craft trade", met: ["bakery", "butcher", "hairdresser", "cheese", "fishmonger"].includes(shop.type) }],
      howToApply: ["Book a takeover appointment at the local Chambre des Métiers"],
    },
  ];
  if (size === "small town") {
    m.push({
      name: "Petites villes de demain programme",
      type: "grant", level: "national", estimatedAmount: 5000, range: "€2,000–€10,000",
      why: "Supports keeping shops open in small-town centres.",
      eligibility: [{ criterion: "Town in the programme", met: true }, { criterion: "Shop in the town centre", met: true }],
      howToApply: ["Contact the programme's project lead at the town hall"],
    });
  }
  if (size !== "city") {
    m.push({
      name: "EU LEADER funds (rural development, via the local action group)",
      type: "grant", level: "EU", estimatedAmount: 8000, range: "€5,000–€20,000",
      why: "Funds rural projects, especially cooperatives that keep a service alive.",
      eligibility: [{ criterion: "Rural or small-town area", met: true }, { criterion: "Cooperative (SCIC) project", met: !!o.cooperative || shop.legalForm === "SCIC" }],
      howToApply: ["Contact the local action group (GAL)", "Apply before any spending"],
    });
  }
  if (size === "village") {
    m.push({
      name: "Municipal support for the last shop in the village",
      type: "grant", level: "local", estimatedAmount: 10000, range: "Premises at low rent or €5,000–€15,000",
      why: "Villages can help keep their last shop open.",
      eligibility: [{ criterion: "Last shop of its kind in the village", met: true }],
      howToApply: ["Meet the mayor with the project"],
    });
  }
  if (o.jobseeker) {
    m.push({
      name: "ARCE: part of unemployment benefits paid as capital",
      type: "grant", level: "national", estimatedAmount: 12000, range: "60% of remaining benefits",
      why: "A jobseeker can receive part of their benefits as a lump sum to start the business.",
      eligibility: [{ criterion: "Registered jobseeker with benefits", met: true }],
      howToApply: ["Ask France Travail after registering the company"],
    });
  }
  m.push({
    name: "EU guarantee through your partner bank (InvestEU / European Investment Fund)",
    type: "guarantee", level: "EU", estimatedAmount: 0, range: "Your partner bank may use an EU guarantee",
    why: "Lets the bank lend to small businesses on better terms.",
    eligibility: [{ criterion: "Small business loan", met: true }],
    howToApply: ["Nothing to do: the partner bank applies it"],
  });
  return {
    matches: m,
    totalEstimated: m.reduce((a, x) => a + x.estimatedAmount, 0),
    caveat: `Amounts are indicative. ${APP_NAME} checks eligibility with each funding body.`,
  };
}
