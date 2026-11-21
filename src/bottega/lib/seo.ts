import { APP_NAME, DESCRIPTION } from "../config";
import { configuredUrl } from "./url";

/** Title, description and link-preview tags (Open Graph + Twitter) for a page. Image: public/og-image.png. */
export function previewMeta({ title = APP_NAME, description = DESCRIPTION, path = "/" }: { title?: string; description?: string; path?: string } = {}) {
  const base = configuredUrl(); // absolute URLs once PUBLIC_URL is set (crawlers prefer them)
  const image = `${base}/og-image.png`;
  return [
    { title },
    { name: "description", content: description },
    { property: "og:site_name", content: APP_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    ...(base ? [{ property: "og:url", content: base + path }] : []),
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: `${APP_NAME} logo` },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
}
