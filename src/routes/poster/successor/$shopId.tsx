import { createFileRoute } from "@tanstack/react-router";
import { PrintPoster } from "@/bottega/components/PrintPoster";
import { APP_NAME } from "@/bottega/config";

const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);

export const Route = createFileRoute("/poster/successor/$shopId")({
  validateSearch: (s: Record<string, unknown>) => ({
    template: str(s.template),
    h: str(s.h),
    s: str(s.s),
    o: str(s.o),
    p: str(s.p),
  }),
  head: () => ({ meta: [{ title: `${APP_NAME}: call for a successor` }] }),
  component: SuccessorPoster,
});

function SuccessorPoster() {
  const { shopId } = Route.useParams();
  const q = Route.useSearch();
  return (
    <PrintPoster shopId={shopId} kind="successor" template={q.template} headline={q.h} subline={q.s}
      offers={q.o ? q.o.split("|") : undefined} profiles={q.p ? q.p.split("|") : undefined} />
  );
}
