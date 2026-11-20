import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import bodyHtml from "@/legacy/body.html?raw";
import tanitCss from "@/legacy/tanit.css?url";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tanit Citoyen" },
      { name: "description", content: "Tanit Citoyen : vos aides, votre capital Tanit et votre vote citoyen, dans une seule appli." },
      { property: "og:title", content: "Tanit Citoyen" },
      { property: "og:description", content: "Vos aides, votre capital Tanit et votre vote citoyen, dans une seule appli." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "color-scheme", content: "light" },
      { name: "theme-color", content: "#ffffff" },
    ],
    links: [
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" },
      { rel: "stylesheet", href: tanitCss },
    ],
  }),
  component: Index,
});

// L'appli d'origine est conservée telle quelle : même page, même code.
function Index() {
  useEffect(() => {
    // @ts-ignore -- code JavaScript d'origine, sans types
    void import("@/legacy/main.js");
    // @ts-ignore -- code JavaScript d'origine, sans types
    void import("@/legacy/sliders.js");
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}
