import logoUrl from "../../assets/rene-logo.svg?url";
import logoDarkUrl from "../../assets/rene-logo-dark.svg?url";
import markUrl from "../../assets/rene-mark.svg?url";
import { APP_NAME } from "../config";

// Brand assets (src/assets): full logo (beaver + wordmark, wordmark drawn as a path so it renders the same
// in the app, PNG exports and the PDF), a dark version for dark brown backgrounds, and the beaver mark alone.
export const LOGO_URL = logoUrl;
export const LOGO_DARK_URL = logoDarkUrl;
export const MARK_URL = markUrl;
export const LOGO_RATIO = 410 / 140;
export const MARK_RATIO = 190 / 140;

/** Full logo. `dark` = version for dark brown backgrounds. Height in px. */
export function Logo({ height = 40, dark = false, className = "" }: { height?: number; dark?: boolean; className?: string }) {
  return <img src={dark ? logoDarkUrl : logoUrl} alt={APP_NAME} height={height} width={Math.round(height * LOGO_RATIO)} className={`block ${className}`} draggable={false} />;
}

/** Beaver mark alone (favicon, chat button, small spots). Height in px. */
export function Mark({ size = 32, className = "", alt = "" }: { size?: number; className?: string; alt?: string }) {
  return <img src={markUrl} alt={alt} height={size} width={Math.round(size * MARK_RATIO)} className={`block ${className}`} draggable={false} />;
}

/** Load an SVG asset as a PNG data URL (for the PDF). */
export async function svgToPng(url: string, width: number, height: number): Promise<string> {
  const img = new Image();
  img.src = url;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = width; c.height = height;
  c.getContext("2d")!.drawImage(img, 0, 0, width, height);
  return c.toDataURL("image/png");
}
