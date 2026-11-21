import { PUBLIC_URL } from "../config";

const LOCAL = /^(localhost|127\.|\[::1\]|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/;

/** Origin to put in QR codes and share links: the real one online, PUBLIC_URL when running locally. */
export function publicOrigin(): string {
  const here = window.location.origin;
  if (PUBLIC_URL && LOCAL.test(window.location.hostname)) return PUBLIC_URL.replace(/\/+$/, "");
  return here;
}

/** True when the QR would point to a local address nobody else can open. */
export const qrIsLocal = () => LOCAL.test(new URL(publicOrigin()).hostname);
