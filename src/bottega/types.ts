export type ShopType =
  | "bakery" | "cafe" | "butcher" | "restaurant" | "grocery" | "bookshop"
  | "florist" | "hairdresser" | "hardware" | "cheese" | "fishmonger" | "bar";
export type Status = "seeking" | "raising" | "taken_over" | "flagged" | "open" | "closed";

export interface Shop {
  id: string; name: string; type: ShopType; status: Status;
  town: string; street: string; lat: number; lng: number;
  owner: { firstName: string; age: number; yearsInShop: number; quote: string };
  leadBuyer?: { firstName: string; age: number; role: "employee" | "resident" | "other"; yearsExperience: number; stakePct: number; contribution: number };
  price?: number; revenue?: number; ebitda?: number; staff?: number; rent?: number;
  raise?: { target: number; raised: number; backers: number; daysLeft: number; minTicket: 100; perks: string[] };
  legalForm?: "SAS" | "SCIC";
  story?: string[];
  pullQuote?: string;
  closedYear?: number;
  flaggedBy?: number;
  interested?: { name: string; age: number; note: string }[];
  colors: { awning: string; facade: string };
  timelineStep?: number; // 0..7
}

export interface Message {
  id: string; shopId: string; author: string; street: string; ago: string;
  kind: "support" | "owner" | "milestone" | "success"; text: string; reactions: number;
}

export interface Contribution { shopId: string; firstName: string; amount: number; at: string; share: number }

export type Screen =
  | { name: "home" } | { name: "map" } | { name: "projects" } | { name: "wall"; shopId?: string }
  | { name: "services" } | { name: "me" }
  | { name: "shop"; id: string; apply?: boolean }
  | { name: "takeover"; shopId?: string }
  | { name: "owner" }
  | { name: "poster"; shopId: string; kind?: "raise" | "successor" }
  | { name: "gap"; shopId: string }
  | { name: "legal" } | { name: "impact" } | { name: "about" } | { name: "how" } | { name: "flag" };
