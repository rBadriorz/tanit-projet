import { createFileRoute } from "@tanstack/react-router";
import { BottegaApp } from "@/bottega/App";
import { APP_NAME, APP_TAGLINE } from "@/bottega/config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${APP_NAME}: take over your corner shop` },
      { name: "description", content: `${APP_NAME}. ${APP_TAGLINE} Neighbours take over the shops whose owners retire.` },
      { property: "og:title", content: `${APP_NAME}: take over your corner shop` },
      { property: "og:description", content: APP_TAGLINE },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#F6F0E4" },
    ],
  }),
  component: () => <BottegaApp initial={{ name: "home" }} />,
});
