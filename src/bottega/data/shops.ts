import type { Shop, ShopType, Status } from "../types";
import { P } from "../theme";

// All data is fictional. Coordinates are approximate and slightly jittered.

const NO_OWNER = { firstName: "", age: 0, yearsInShop: 0, quote: "" };
const perks = (a: string, b = "Your name on the wall of founders", c = "A vote at the yearly meeting") => [a, b, c];

const CORE: Shop[] = [
  // ---------- Rennes ----------
  {
    id: "marche", name: "Café du Marché", type: "cafe", status: "raising", town: "Rennes", street: "place des Lices",
    lat: 48.1128, lng: -1.6826,
    owner: { firstName: "Michèle", age: 68, yearsInShop: 31, quote: "This café is where the street says good morning. It can't become a phone shop." },
    leadBuyer: { firstName: "Sonia", age: 41, role: "resident", yearsExperience: 6, stakePct: 55, contribution: 14000 },
    price: 140000, revenue: 260000, ebitda: 39000, staff: 3, rent: 1600,
    raise: { target: 35000, raised: 26100, backers: 241, daysLeft: 12, minTicket: 100, perks: perks("An espresso on the house every market Saturday") },
    legalForm: "SAS", timelineStep: 4, colors: { awning: P.primaryDark, facade: P.facade1 },
    story: [
      "On Saturday mornings, when the market fills the place des Lices, the first stop for half of Rennes is Michèle's counter. Thirty-one years of espresso, croissants and gossip.",
      "Michèle is 68 and tired of the 6am openings. A phone-shop chain has already asked about the lease. Sonia, a customer for fifteen years who now runs the weekend shifts, wants to keep the terrace and the €1.50 espresso.",
      "With 241 neighbours already in, Sonia takes 55% and the street owns the rest. Michèle will still come for her coffee, on the other side of the counter this time.",
    ],
    pullQuote: "It can't become a phone shop.",
  },
  {
    id: "martin", name: "Boucherie Martin", type: "butcher", status: "seeking", town: "Rennes", street: "rue Saint-Malo",
    lat: 48.1153, lng: -1.6812,
    owner: { firstName: "Gérard", age: 66, yearsInShop: 40, quote: "My hands are tired. My knives aren't. I need someone who loves the trade." },
    price: 210000, revenue: 520000, ebitda: 61000, staff: 4, rent: 1800,
    legalForm: "SAS", timelineStep: 1, colors: { awning: P.brown3, facade: P.facade3 },
    interested: [
      { name: "Yanis", age: 24, note: "Butchery school graduate" },
      { name: "Claire", age: 45, note: "Career changer" },
      { name: "Mathieu", age: 31, note: "Butcher in a supermarket" },
    ],
  },
  {
    id: "zinc", name: "Le Petit Zinc", type: "bar", status: "taken_over", town: "Rennes", street: "rue de Penhoët",
    lat: 48.1121, lng: -1.6789,
    owner: { firstName: "Yvonne", age: 74, yearsInShop: 33, quote: "Thomas pours a better pint than I ever did. Don't tell him." },
    leadBuyer: { firstName: "Thomas", age: 29, role: "employee", yearsExperience: 7, stakePct: 51, contribution: 9000 },
    price: 95000, revenue: 190000, ebitda: 27000, staff: 4, rent: 1100,
    raise: { target: 30000, raised: 30000, backers: 212, daysLeft: 0, minTicket: 100, perks: perks("First drink on the house every month") },
    legalForm: "SAS", timelineStep: 7, colors: { awning: P.brown2, facade: P.facade4 },
    story: [
      "Le Petit Zinc has stood on rue de Penhoët since 1962: a copper counter, a jukebox, and Yvonne behind the bar for 33 years.",
      "When Yvonne retired in 2025, the building's owner wanted a vape shop. Thomas, her barman since he was 22, had the regulars, the recipes and the will, but not the money.",
      "212 neighbours bought in. Thomas holds 51% and runs the bar. Six months on, four jobs are kept, the jukebox still works, and every co-owner gets a first drink on the house each month.",
    ],
    pullQuote: "Six months on, the jukebox still works.",
  },
  {
    id: "fromages", name: "La Cave à Fromages", type: "cheese", status: "raising", town: "Rennes", street: "rue Vasselot",
    lat: 48.1076, lng: -1.6788,
    owner: { firstName: "Jean-Paul", age: 67, yearsInShop: 29, quote: "Inès can tell a Comté of 18 months from 24 with her eyes closed." },
    leadBuyer: { firstName: "Inès", age: 37, role: "employee", yearsExperience: 8, stakePct: 58, contribution: 12000 },
    price: 120000, revenue: 280000, ebitda: 33000, staff: 2, rent: 1200,
    raise: { target: 28000, raised: 9800, backers: 96, daysLeft: 33, minTicket: 100, perks: perks("A seat at the Thursday tastings") },
    legalForm: "SAS", timelineStep: 4, colors: { awning: P.warning, facade: P.facade1 },
  },
  {
    id: "pages", name: "Librairie Les Pages", type: "bookshop", status: "raising", town: "Rennes", street: "rue de la Monnaie",
    lat: 48.1117, lng: -1.6852,
    owner: { firstName: "Odile", age: 70, yearsInShop: 35, quote: "A street without a bookshop forgets how to dream." },
    leadBuyer: { firstName: "Malik", age: 31, role: "resident", yearsExperience: 4, stakePct: 52, contribution: 8000 },
    price: 85000, revenue: 210000, ebitda: 18000, staff: 2, rent: 950,
    raise: { target: 25000, raised: 21900, backers: 318, daysLeft: 6, minTicket: 100, perks: perks("10% off every book, for life") },
    legalForm: "SCIC", timelineStep: 4, colors: { awning: P.tan, facade: P.facade2 },
    story: [
      "Librairie Les Pages has sold books on rue de la Monnaie for 35 years. Odile knows which teenager will love which comic before they do.",
      "At 70, Odile wants to stop. Bookshops rarely make a buyer rich, and no one came forward. Malik, a neighbour who spent his student years in the poetry aisle, asked a simple question: what if we all owned it?",
      "Les Pages becomes a cooperative (SCIC). Malik runs it with 52%, and readers, teachers and the school next door own the rest. 318 neighbours are in, with six days to go.",
    ],
    pullQuote: "A street without a bookshop forgets how to dream.",
  },
  {
    id: "creperie", name: "Crêperie Ty Gwenn", type: "restaurant", status: "seeking", town: "Rennes", street: "rue du Chapitre",
    lat: 48.111, lng: -1.683,
    owner: { firstName: "Anne", age: 64, yearsInShop: 27, quote: "My galettes are my grandmother's recipe. I won't sell it to a chain." },
    price: 160000, revenue: 340000, ebitda: 42000, staff: 5, rent: 1700,
    legalForm: "SAS", timelineStep: 1, colors: { awning: P.primary, facade: P.facade2 },
  },
  {
    id: "primeur", name: "Primeur des Halles", type: "grocery", status: "flagged", town: "Rennes", street: "rue de Nemours",
    lat: 48.1095, lng: -1.6795, owner: NO_OWNER, flaggedBy: 43,
    timelineStep: 0, colors: { awning: P.brown2, facade: P.facade2 },
  },
  {
    id: "fleurs", name: "Fleurs de Sainte-Anne", type: "florist", status: "taken_over", town: "Rennes", street: "place Sainte-Anne",
    lat: 48.1146, lng: -1.6802,
    owner: { firstName: "Martine", age: 69, yearsInShop: 30, quote: "Chloé has green fingers and a big heart." },
    leadBuyer: { firstName: "Chloé", age: 28, role: "employee", yearsExperience: 6, stakePct: 55, contribution: 8000 },
    price: 70000, revenue: 150000, ebitda: 19000, staff: 2, rent: 900,
    raise: { target: 18000, raised: 18000, backers: 134, daysLeft: 0, minTicket: 100, perks: perks("A bouquet on your birthday") },
    legalForm: "SAS", timelineStep: 7, colors: { awning: P.primaryDark, facade: P.facade3 },
  },
  {
    id: "coiffure", name: "Salon Jacqueline", type: "hairdresser", status: "raising", town: "Rennes", street: "rue d'Antrain",
    lat: 48.117, lng: -1.677,
    owner: { firstName: "Jacqueline", age: 72, yearsInShop: 45, quote: "45 years of perms, weddings and secrets. Yasmine knows them all." },
    leadBuyer: { firstName: "Yasmine", age: 33, role: "employee", yearsExperience: 11, stakePct: 60, contribution: 10000 },
    price: 60000, revenue: 140000, ebitda: 22000, staff: 2, rent: 800,
    raise: { target: 15000, raised: 4200, backers: 38, daysLeft: 40, minTicket: 100, perks: perks("A free blow-dry each season") },
    legalForm: "SAS", timelineStep: 4, colors: { awning: P.brown3, facade: P.facade4 },
  },
  {
    id: "quincaillerie", name: "Quincaillerie Le Gall", type: "hardware", status: "seeking", town: "Rennes", street: "rue Saint-Hélier",
    lat: 48.1065, lng: -1.67,
    owner: { firstName: "Bernard", age: 70, yearsInShop: 42, quote: "People come for one screw and leave with advice for the whole house." },
    price: 130000, revenue: 300000, ebitda: 30000, staff: 3, rent: 1300,
    legalForm: "SAS", timelineStep: 1, colors: { awning: P.tan, facade: P.facade1 },
  },
  {
    id: "poissonnerie", name: "Poissonnerie de la Criée", type: "fishmonger", status: "raising", town: "Rennes", street: "rue Jules Simon",
    lat: 48.1102, lng: -1.676,
    owner: { firstName: "Loïc", age: 65, yearsInShop: 33, quote: "The fish comes from Saint-Malo every morning. I want it to keep coming." },
    leadBuyer: { firstName: "Maëlle", age: 36, role: "resident", yearsExperience: 5, stakePct: 55, contribution: 13000 },
    price: 150000, revenue: 380000, ebitda: 41000, staff: 3, rent: 1500,
    raise: { target: 32000, raised: 17500, backers: 152, daysLeft: 21, minTicket: 100, perks: perks("A dozen oysters at Christmas") },
    legalForm: "SAS", timelineStep: 4, colors: { awning: P.tan, facade: P.facade3 },
  },
  {
    id: "bistro", name: "Le Bistrot d'Alphonse", type: "restaurant", status: "taken_over", town: "Rennes", street: "rue Hoche",
    lat: 48.1158, lng: -1.676,
    owner: { firstName: "Alphonse", age: 73, yearsInShop: 36, quote: "I still come every Tuesday. The blanquette is better than mine now." },
    leadBuyer: { firstName: "Nadia & Hugo", age: 39, role: "employee", yearsExperience: 12, stakePct: 56, contribution: 20000 },
    price: 190000, revenue: 450000, ebitda: 52000, staff: 6, rent: 2100,
    raise: { target: 45000, raised: 45000, backers: 389, daysLeft: 0, minTicket: 100, perks: perks("Dessert on the house once a month") },
    legalForm: "SAS", timelineStep: 7, colors: { awning: P.brown3, facade: P.facade2 },
  },
  {
    id: "epicerie", name: "Épicerie Bonne Nouvelle", type: "grocery", status: "raising", town: "Rennes", street: "rue de Brest",
    lat: 48.111, lng: -1.693,
    owner: { firstName: "Fatima", age: 66, yearsInShop: 24, quote: "People come for the semolina, they stay for the chat." },
    leadBuyer: { firstName: "Rachid", age: 30, role: "resident", yearsExperience: 3, stakePct: 55, contribution: 9000 },
    price: 75000, revenue: 230000, ebitda: 21000, staff: 2, rent: 850,
    raise: { target: 20000, raised: 13300, backers: 167, daysLeft: 15, minTicket: 100, perks: perks("Free home delivery for neighbours over 75") },
    legalForm: "SAS", timelineStep: 4, colors: { awning: P.warning, facade: P.facade4 },
  },
  {
    id: "patisserie", name: "Pâtisserie Colombier", type: "bakery", status: "flagged", town: "Rennes", street: "rue du Colombier",
    lat: 48.105, lng: -1.682, owner: NO_OWNER, flaggedBy: 61,
    timelineStep: 0, colors: { awning: P.primary, facade: P.facade3 },
  },
  {
    id: "torref", name: "Torréfaction du Thabor", type: "cafe", status: "seeking", town: "Rennes", street: "rue de Paris",
    lat: 48.1135, lng: -1.67,
    owner: { firstName: "Henri", age: 69, yearsInShop: 30, quote: "I've roasted coffee for 30 years. My nose is still good, my back isn't." },
    price: 110000, revenue: 240000, ebitda: 29000, staff: 2, rent: 1100,
    legalForm: "SAS", timelineStep: 1, colors: { awning: P.brown3, facade: P.facade4 },
  },
  {
    id: "ancien-cinema-bar", name: "Bar du Cinéma", type: "bar", status: "closed", town: "Rennes", street: "rue d'Échange",
    lat: 48.1135, lng: -1.6845, owner: NO_OWNER, closedYear: 2024, colors: { awning: P.closed, facade: "#E5E5E5" },
  },
  {
    id: "mercerie", name: "Mercerie Saint-Georges", type: "grocery", status: "closed", town: "Rennes", street: "rue Gambetta",
    lat: 48.112, lng: -1.6745, owner: NO_OWNER, closedYear: 2023, colors: { awning: P.closed, facade: "#E5E5E5" },
  },
  {
    id: "boucherie-sud", name: "Boucherie du Sud-Gare", type: "butcher", status: "closed", town: "Rennes", street: "boulevard Solférino",
    lat: 48.1035, lng: -1.673, owner: NO_OWNER, closedYear: 2025, colors: { awning: P.closed, facade: "#E5E5E5" },
  },

  // ---------- Vitré ----------
  {
    id: "vitre-pain", name: "Au Pain de la Baronnie", type: "bakery", status: "raising", town: "Vitré", street: "rue Baudrairie",
    lat: 48.1236, lng: -1.2105,
    owner: { firstName: "Paulette", age: 69, yearsInShop: 36, quote: "Kevin came here at 16 as an apprentice. Now he's the one who wakes up at 3am." },
    leadBuyer: { firstName: "Kevin", age: 27, role: "employee", yearsExperience: 11, stakePct: 60, contribution: 10000 },
    price: 150000, revenue: 270000, ebitda: 40000, staff: 3, rent: 900,
    raise: { target: 30000, raised: 11700, backers: 102, daysLeft: 28, minTicket: 100, perks: perks("A galette des rois each January") },
    legalForm: "SAS", timelineStep: 4, colors: { awning: P.primary, facade: P.facade3 },
    story: [
      "In a town of 18,000, the bakery on rue Baudrairie is more than a shop. It is where Vitré meets, under the half-timbered houses, every morning.",
      "Paulette has run it for 36 years. Kevin walked in at 16 as an apprentice; eleven years later he does the 3am shift and the bread is his. But a young baker in a small town does not get a bank loan on talent alone.",
      "So the town backs him. Kevin takes 60%, neighbours from Vitré and the villages around take the rest. Losing the bakery would mean losing the street. Vitré has decided it won't.",
    ],
    pullQuote: "Now he's the one who wakes up at 3am.",
  },
  {
    id: "vitre-cafe", name: "Café de la Poterne", type: "cafe", status: "seeking", town: "Vitré", street: "rue Poterie",
    lat: 48.1247, lng: -1.208,
    owner: { firstName: "Daniel", age: 72, yearsInShop: 41, quote: "This café has seen three generations of the same families." },
    price: 90000, revenue: 170000, ebitda: 22000, staff: 2, rent: 700,
    legalForm: "SAS", timelineStep: 1, colors: { awning: P.primaryDark, facade: P.facade3 },
  },
  {
    id: "vitre-boucherie", name: "Boucherie Gautier", type: "butcher", status: "taken_over", town: "Vitré", street: "place du Marchix",
    lat: 48.1229, lng: -1.212,
    owner: { firstName: "Roger", age: 70, yearsInShop: 38, quote: "Élodie cuts better than I do. I mean it." },
    leadBuyer: { firstName: "Élodie", age: 38, role: "employee", yearsExperience: 14, stakePct: 58, contribution: 16000 },
    price: 160000, revenue: 410000, ebitda: 50000, staff: 4, rent: 1000,
    raise: { target: 36000, raised: 36000, backers: 227, daysLeft: 0, minTicket: 100, perks: perks("Vote for the sausage of the week") },
    legalForm: "SAS", timelineStep: 7, colors: { awning: P.brown3, facade: P.facade4 },
  },
  {
    id: "vitre-epicerie", name: "L'Épicerie du Château", type: "grocery", status: "flagged", town: "Vitré", street: "rue d'Embas",
    lat: 48.1252, lng: -1.2095, owner: NO_OWNER, flaggedBy: 28, timelineStep: 0, colors: { awning: P.brown2, facade: P.facade1 },
  },
  {
    id: "vitre-bar", name: "Le Relais des Remparts", type: "bar", status: "closed", town: "Vitré", street: "rue Garengeot",
    lat: 48.1225, lng: -1.206, owner: NO_OWNER, closedYear: 2024, colors: { awning: P.closed, facade: "#E5E5E5" },
  },
];

// ---------- Other towns (for the "All France" view) ----------
type Far = [string, string, ShopType, Status, string, string, number, number, string, number, number, string];
const FAR: Far[] = [
  ["nantes-pain", "Fournil du Bouffay", "bakery", "seeking", "Nantes", "rue de la Juiverie", 47.2153, -1.5535, "Josette", 68, 33, "My oven is older than my grandchildren."],
  ["nantes-cafe", "Café Graslin", "cafe", "taken_over", "Nantes", "place Graslin", 47.2128, -1.5627, "Gaston", 74, 40, "The regulars stayed. That's all I wanted."],
  ["brest-poisson", "Marée de Recouvrance", "fishmonger", "seeking", "Brest", "rue de la Porte", 48.3845, -4.4995, "Yann", 66, 31, "The harbour feeds this street. Keep it that way."],
  ["quimper-crepe", "Crêperie du Steir", "restaurant", "taken_over", "Quimper", "rue Kéréon", 47.9960, -4.1030, "Soizic", 70, 34, "Lena flips galettes faster than I ever did."],
  ["stmalo-bar", "Bar de l'Intra-Muros", "bar", "seeking", "Saint-Malo", "rue Saint-Vincent", 48.6490, -2.0255, "Pierre", 69, 37, "Sailors, tourists, locals. Everyone drinks at the same counter."],
  ["laval-livres", "Librairie du Vieux-Château", "bookshop", "raising", "Laval", "rue des Orfèvres", 48.0705, -0.7720, "Hélène", 71, 29, "Books keep a town awake."],
  ["angers-fromage", "Fromagerie de la Doutre", "cheese", "seeking", "Angers", "place de la Laiterie", 47.4740, -0.5585, "Gilles", 67, 28, "Twenty-eight years of crottins and conversations."],
  ["tours-boucherie", "Boucherie Plumereau", "butcher", "taken_over", "Tours", "rue du Commerce", 47.3950, 0.6835, "Alain", 72, 39, "Sami trained with me for six years. He's ready."],
  ["lyon-cafe", "Café des Canuts", "cafe", "seeking", "Lyon", "Croix-Rousse, rue d'Austerlitz", 45.7745, 4.8310, "Monique", 68, 35, "The Croix-Rousse climbs the hill for its coffee here."],
  ["lille-epicerie", "Épicerie de Wazemmes", "grocery", "taken_over", "Lille", "Wazemmes, rue des Sarrazins", 50.6265, 3.0480, "Karima", 65, 26, "Sunday market, Sunday chat. It goes on."],
  ["toulouse-pain", "Boulangerie des Carmes", "bakery", "raising", "Toulouse", "place des Carmes", 43.5970, 1.4455, "Bernadette", 70, 37, "Fougasse on Fridays since 1988."],
  ["clermont-quinca", "Quincaillerie de Jaude", "hardware", "seeking", "Clermont-Ferrand", "rue du Port", 45.7790, 3.0870, "Roland", 71, 44, "I know every screw size in the Auvergne."],
  ["dieulefit-epicerie", "Épicerie du Village", "grocery", "seeking", "Dieulefit (Drôme)", "Grand'Rue", 44.5255, 5.0625, "Mireille", 67, 30, "We are the last shop in the village. If we close, the village closes."],
];
const AWNINGS = [P.primary, P.primaryDark, P.brown2, P.warning, P.brown3, P.tan];
const FACADES = [P.facade2, P.facade1, P.facade1, P.facade3, P.facade2, P.facade4];

const FAR_SHOPS: Shop[] = FAR.map(([id, name, type, status, town, street, lat, lng, owner, age, years, quote], i) => {
  const price = 80000 + (i % 5) * 25000;
  const base: Shop = {
    id, name, type, status, town, street, lat, lng,
    owner: { firstName: owner, age, yearsInShop: years, quote },
    price, revenue: Math.round(price * 1.9), ebitda: Math.round(price * 0.27), staff: 2 + (i % 3), rent: 800 + (i % 4) * 200,
    legalForm: "SAS", timelineStep: status === "taken_over" ? 7 : status === "raising" ? 4 : 1,
    colors: { awning: AWNINGS[i % AWNINGS.length]!, facade: FACADES[i % FACADES.length]! },
  };
  if (status === "raising" || status === "taken_over") {
    const target = Math.round(price * 0.22 / 1000) * 1000;
    base.leadBuyer = { firstName: ["Lucas", "Lena", "Sami", "Inès", "Hugo", "Nora"][i % 6]!, age: 28 + (i % 9), role: i % 2 ? "employee" : "resident", yearsExperience: 4 + (i % 7), stakePct: 55, contribution: 10000 };
    base.raise = { target, raised: status === "taken_over" ? target : Math.round(target * 0.45), backers: status === "taken_over" ? 150 + i * 7 : 70 + i * 3, daysLeft: status === "taken_over" ? 0 : 20 + i, minTicket: 100, perks: perks("A small thank-you each month") };
  }
  return base;
});

// ---------- Context shops in Rennes (open, no succession issue) ----------
type Ctx = [string, ShopType, string, number, number];
const CONTEXT: Ctx[] = [
  ["Tabac de la Place", "bar", "place Sainte-Anne", 48.1149, -1.6809],
  ["Pharmacie des Lices", "grocery", "place des Lices", 48.1132, -1.6818],
  ["Pizzeria Napoli", "restaurant", "rue Saint-Malo", 48.1161, -1.6822],
  ["Boulangerie Ange", "bakery", "rue de Paris", 48.1128, -1.6712],
  ["Caviste Les Vignes", "bar", "rue Vasselot", 48.1083, -1.6779],
  ["Opticien Morel", "hardware", "rue d'Antrain", 48.1163, -1.6781],
  ["Pressing du Thabor", "hairdresser", "rue Victor Hugo", 48.1127, -1.6758],
  ["Kebab Istanbul", "restaurant", "rue de Brest", 48.1114, -1.6905],
  ["Sushi Hana", "restaurant", "rue de Penhoët", 48.1117, -1.6797],
  ["Marché Bio Sainte-Anne", "grocery", "rue de Saint-Malo", 48.1143, -1.6818],
  ["Galerie Ar Men", "bookshop", "rue du Chapitre", 48.1106, -1.6843],
  ["Fromagerie du Vieux Rennes", "cheese", "rue de la Monnaie", 48.1112, -1.6862],
  ["Café Le Thabor", "cafe", "rue de Paris", 48.1140, -1.6690],
  ["Fleuriste Les Lices", "florist", "rue Le Bastard", 48.1119, -1.6812],
  ["Crêperie Saint-Georges", "restaurant", "rue Saint-Georges", 48.1108, -1.6762],
  ["Papeterie d'Estrées", "bookshop", "rue d'Estrées", 48.1125, -1.6800],
  ["Salon Coupe & Café", "hairdresser", "rue de Fougères", 48.1175, -1.6735],
  ["Poissonnerie du Colombier", "fishmonger", "rue du Colombier", 48.1056, -1.6808],
  ["Boucherie des Halles", "butcher", "rue de Nemours", 48.1090, -1.6805],
  ["Bar Le Sablier", "bar", "rue Jules Simon", 48.1097, -1.6752],
];
const CONTEXT_SHOPS: Shop[] = CONTEXT.map(([name, type, street, lat, lng], i) => ({
  id: "open-" + i, name, type, status: "open", town: "Rennes", street, lat, lng,
  owner: NO_OWNER, colors: { awning: AWNINGS[(i + 2) % AWNINGS.length]!, facade: FACADES[i % FACADES.length]! },
}));

// ---------- Cannes-sur-Mer (fictional seaside town; the demo's featured bakery) ----------
export const FEATURED_SHOP_ID = "fournil-de-karim";
export const CANNES = { lat: 43.5532, lng: 7.0146 };
const FOURNIL: Shop = {
  id: FEATURED_SHOP_ID, name: "Le Fournil de Karim", type: "bakery", status: "seeking", town: "Cannes-sur-Mer", street: "12 place du Marché",
  lat: CANNES.lat, lng: CANNES.lng,
  owner: { firstName: "Karim", age: 70, yearsInShop: 35, quote: "I'd rather hand the keys to someone from the street." },
  price: 180000, revenue: 310000, ebitda: 48000, staff: 3, rent: 1500,
  legalForm: "SAS", timelineStep: 1, colors: { awning: P.primary, facade: P.facade2 },
  story: [
    "Every morning at 3am, the lights go on at 12 place du Marché. For 35 years, Karim has made the bread Cannes-sur-Mer wakes up to.",
    "Karim is 70. His children chose other lives, and the only offer he received came from a chain that would turn the bakery into a sandwich counter. He would rather hand the keys to someone from the street.",
    "So the street is looking with him: a baker who wants to take over, neighbours ready to invest from €100, a partner bank and local grants. Karim will stay a few mornings a week to pass on his recipes.",
  ],
  pullQuote: "I'd rather hand the keys to someone from the street.",
  interested: [
    { name: "Sarah", age: 29, note: "Baker in Nice, wants her own shop" },
    { name: "Mehdi", age: 38, note: "Pastry chef, career changer" },
  ],
};
const CANNES_ROWS: [string, string, ShopType, Status, string, number, number][] = [
  ["cannes-cafe", "Café du Port", "cafe", "raising", "quai Saint-Pierre", 43.5521, 7.0158],
  ["cannes-poisson", "Poissonnerie Forville", "fishmonger", "taken_over", "rue du Marché Forville", 43.5527, 7.0118],
  ["cannes-fleurs", "Les Fleurs du Suquet", "florist", "seeking", "rue Saint-Antoine", 43.5519, 7.0108],
  ["cannes-epicerie", "Épicerie de la Place", "grocery", "flagged", "place du Marché", 43.5537, 7.0132],
  ["cannes-tabac", "Tabac du Marché", "bar", "open", "rue Meynadier", 43.5530, 7.0170],
  ["cannes-fromage", "Fromagerie Meynadier", "cheese", "open", "rue Meynadier", 43.5534, 7.0182],
  ["cannes-coiffure", "Salon Riviera", "hairdresser", "open", "rue Hoche", 43.5545, 7.0160],
  ["cannes-libraire", "Librairie des Allées", "bookshop", "open", "allées de la Liberté", 43.5517, 7.0140],
  ["cannes-boucherie", "Boucherie Gambetta", "butcher", "open", "rue Gambetta", 43.5552, 7.0130],
  ["cannes-bar", "Bar de la Marine", "bar", "closed", "rue Félix Faure", 43.5524, 7.0195],
];
const CANNES_SHOPS: Shop[] = CANNES_ROWS.map(([id, name, type, status, street, lat, lng], i) => ({
  id, name, type, status, town: "Cannes-sur-Mer", street, lat, lng,
  owner: status === "open" || status === "closed" || status === "flagged" ? NO_OWNER : { firstName: ["Gilles", "Nadine", "Hélène"][i % 3]!, age: 66 + i, yearsInShop: 25 + i, quote: "The street deserves to keep its shops." },
  ...(status === "raising" ? { price: 120000, revenue: 240000, ebitda: 32000, staff: 2, leadBuyer: { firstName: "Inès", age: 33, role: "employee" as const, yearsExperience: 7, stakePct: 55, contribution: 12000 }, raise: { target: 26000, raised: 11800, backers: 96, daysLeft: 24, minTicket: 100 as const, perks: perks("A coffee on the terrace each Sunday") }, timelineStep: 4 } : {}),
  ...(status === "seeking" ? { price: 70000, revenue: 150000, ebitda: 19000, staff: 2, timelineStep: 1 } : {}),
  ...(status === "taken_over" ? { price: 150000, revenue: 380000, ebitda: 41000, staff: 4, timelineStep: 7 } : {}),
  ...(status === "flagged" ? { flaggedBy: 22, timelineStep: 0 } : {}),
  ...(status === "closed" ? { closedYear: 2024 } : {}),
  colors: { awning: [P.primary, P.brown2, P.tan, P.brown3][i % 4]!, facade: [P.facade1, P.facade2, P.facade3, P.facade4][i % 4]! },
}));

export const SHOPS: Shop[] = [FOURNIL, ...CORE, ...CANNES_SHOPS, ...FAR_SHOPS, ...CONTEXT_SHOPS];

// Who runs the shop (demo): the crêperie's buyers are looking for a manager.
for (const s of SHOPS) {
  if (s.id === "creperie") s.managerWanted = { trade: "Crêpe and galette cook", experience: "2+ years on a billig", hours: "Full time, closed Mondays", salary: "€1,900 – €2,300 net / month", canBeShareholder: true };
}
