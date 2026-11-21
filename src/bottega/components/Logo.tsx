import logoSvg from "../../assets/rene-logo.svg?raw";
import logoDarkSvg from "../../assets/rene-logo-dark.svg?raw";
import logoOutlinedUrl from "../../assets/rene-logo-outlined.svg?url";
import logoDarkOutlinedUrl from "../../assets/rene-logo-dark-outlined.svg?url";
import markUrl from "../../assets/rene-mark.svg?url";
import { APP_NAME } from "../config";

// Brand assets (src/assets):
// - rene-logo.svg: the logo exactly as supplied (its "René" is a <text> in Poppins 600, loaded in __root.tsx);
// - rene-logo-dark.svg: the same for dark brown backgrounds;
// - rene-mark.svg: the beaver alone (favicon, map pins, chat button);
// - *-outlined.svg: same logos with only the text turned into a Poppins 600 path, for PNG / PDF exports where
//   a web font cannot load.
export const LOGO_OUTLINED_URL = logoOutlinedUrl;
export const LOGO_DARK_OUTLINED_URL = logoDarkOutlinedUrl;
export const MARK_URL = markUrl;
export const LOGO_RATIO = 520 / 200;
export const MARK_RATIO = 190 / 140;

/** Full logo. `dark` = version for dark brown backgrounds; `outlined` = text as a path (use in exported images). */
export function Logo({ height = 40, dark = false, outlined = false, className = "" }: { height?: number; dark?: boolean; outlined?: boolean; className?: string }) {
  const width = Math.round(height * LOGO_RATIO);
  if (outlined) {
    return <img src={dark ? logoDarkOutlinedUrl : logoOutlinedUrl} alt={APP_NAME} height={height} width={width} className={`block ${className}`} draggable={false} />;
  }
  return (
    <span role="img" aria-label={APP_NAME} className={`rene-logo block ${className}`} style={{ height, width }}
      dangerouslySetInnerHTML={{ __html: dark ? logoDarkSvg : logoSvg }} />
  );
}

/** Beaver mark alone. Height in px. */
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
