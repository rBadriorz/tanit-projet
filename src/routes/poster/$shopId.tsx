import { createFileRoute } from "@tanstack/react-router";
import { PrintPoster } from "@/bottega/components/PrintPoster";
import { APP_NAME } from "@/bottega/config";

export const Route = createFileRoute("/poster/$shopId")({
  validateSearch: (s: Record<string, unknown>) => ({
    template: typeof s["template"] === "string" ? (s["template"] as string) : undefined,
  }),
  head: () => ({ meta: [{ title: `${APP_NAME}: shop poster` }] }),
  component: RaisePoster,
});

function RaisePoster() {
  const { shopId } = Route.useParams();
  const { template } = Route.useSearch();
  return <PrintPoster shopId={shopId} kind="raise" template={template} />;
}
