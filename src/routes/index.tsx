import { createFileRoute } from "@tanstack/react-router";
import { BottegaApp } from "@/bottega/App";
import { previewMeta } from "@/bottega/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({ meta: previewMeta() }),
  component: () => <BottegaApp initial={{ name: "home" }} />,
});
