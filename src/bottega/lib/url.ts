import { PUBLIC_URL } from "../config";

const LOCAL = /^(localhost|127\.|\[::1\]|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/;

/** PUBLIC_URL without trailing slash, or "" while it is still the placeholder. Safe on the server. */
export function configuredUrl(): string {
  return PUBLIC_URL && !PUBLIC_URL.includes("YOUR-APP") ? PUBLIC_URL.replace(/\/+$/, "") : "";
}

/** Origin for QR codes and share links: PUBLIC_URL once configured, else the page's own address. */
export function publicOrigin(): string {
  return configuredUrl() || window.location.origin;
}

/** Full public link to a route, e.g. publicLink("/shop/fournil-de-karim"). */
export const publicLink = (path: string) => publicOrigin() + (path.startsWith("/") ? path : "/" + path);

/** True when QR codes would point to a local address nobody else can open. */
export const qrIsLocal = () => LOCAL.test(new URL(publicOrigin()).hostname);
