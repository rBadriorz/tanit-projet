import { createFileRoute } from "@tanstack/react-router";
import { BottegaApp } from "@/bottega/App";
import { APP_NAME } from "@/bottega/config";

// Deep link from the QR posters: opens the shop page directly (?apply=1 opens the "I'm interested" form).
export const Route = createFileRoute("/shop/$shopId")({
  validateSearch: (s: Record<string, unknown>) => ({ apply: s.apply === "1" || s.apply === 1 ? true : undefined }),
  head: () => ({ meta: [{ title: `${APP_NAME}: take over your corner shop` }] }),
  component: ShopRoute,
});

function ShopRoute() {
  const { shopId } = Route.useParams();
  const { apply } = Route.useSearch();
  return <BottegaApp initial={{ name: "shop", id: shopId, apply }} />;
}
