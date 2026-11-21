import { createFileRoute } from "@tanstack/react-router";
import { BottegaApp } from "@/bottega/App";
import { APP_NAME } from "@/bottega/config";
import { SHOPS } from "@/bottega/data/shops";
import { previewMeta } from "@/bottega/lib/seo";

// Deep link from the QR posters: opens the shop page directly (?apply=1 opens the "I'm interested" form).
export const Route = createFileRoute("/shop/$shopId")({
  validateSearch: (s: Record<string, unknown>) => ({ apply: ["1", 1, true, "true"].includes(s["apply"] as never) ? true : undefined }),
  // Link preview names the shop, so a scanned or shared link shows what it opens.
  head: ({ params }) => {
    const shop = SHOPS.find((s) => s.id === params.shopId);
    return {
      meta: previewMeta(shop
        ? { title: `${shop.name} · ${APP_NAME}`, description: `${shop.owner.firstName ? shop.owner.firstName + " is retiring. " : ""}Help keep ${shop.name} (${shop.town}) open: take over or join from €100.`, path: `/shop/${shop.id}` }
        : { path: `/shop/${params.shopId}` }),
    };
  },
  component: ShopRoute,
});

function ShopRoute() {
  const { shopId } = Route.useParams();
  const { apply } = Route.useSearch();
  return <BottegaApp initial={apply ? { name: "shop", id: shopId, apply } : { name: "shop", id: shopId }} />;
}
