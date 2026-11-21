// The app palette, defined once. CSS variables are generated from it (see cssVars, injected in
// src/routes/__root.tsx) and SVG illustrations, map pins, the PDF and posters read it directly.
// René brown: there is no mascot SVG yet, so the fallback #8B5A2B is used (white text on it: 5.9:1, WCAG AA).
export const P = {
  primary: "#8B5A2B",       // René brown: buttons, active tab, links, progress, raising pins, headers
  primaryDark: "#5C3A1E",   // hover / pressed, titles, accent buttons
  primaryLight: "#E8D5C0",  // chips, badges, selected cards, pending part of funding bars
  page: "#FFFFFF",          // background
  surface: "#FAF6F1",       // cards and sheets
  text: "#2B1D12",
  text2: "#7A6553",
  border: "#EADFD3",
  warning: "#C99A4B",       // pending / flagged (warm amber that sits with the browns)
  success: "#2F7D4F",       // only for success: approved, saved, taken over
  danger: "#B42318",        // only for errors and closed-shop warnings
  closed: "#A7A7A7",        // closed shops (grey pins)
  desk: "#EFE4D6",          // soft beige around the phone on desktop
  // Illustration shades (awnings, façades) so shop fronts stay in the brown family.
  brown2: "#A8753F",
  brown3: "#6E4424",
  tan: "#C9A27A",
  facade1: "#F6EBDD",
  facade2: "#F1E2CF",
  facade3: "#EFE6DA",
  facade4: "#F8F0E6",
} as const;

export const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

const kebab = (k: string) => k.replace(/[A-Z0-9]+/g, (m) => "-" + m.toLowerCase());

/** `:root { --primary: …; … }` generated from P. */
export const cssVars = `:root{${Object.entries(P).map(([k, v]) => `--${kebab(k)}:${v};`).join("")}}`;
