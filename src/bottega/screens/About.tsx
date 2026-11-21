import type { Screen } from "../types";
import { Card, Page, Trust } from "../components/ui";
import { APP_NAME, PARTNER } from "../config";
import { AiTeam } from "../components/AiTeam";
import { Logo } from "../components/Logo";

const FAQ = [
  { q: `Does ${APP_NAME} hold my money?`, a: `No. Funds are collected and held by ${PARTNER}, a licensed EU crowdfunding platform such as WiSEED or LITA.co. ${APP_NAME} never holds money.` },
  { q: "Is this a fund?", a: "No. Each shop is its own company (SAS or SCIC cooperative). You buy shares of that one shop, nothing else." },
  { q: "Can I lose my money?", a: "Yes. A small shop can fail. Only invest what you can afford to lose. Shares are not easy to resell." },
  { q: "What do I get?", a: "Shares in the shop, a vote at the yearly meeting, and perks chosen by the shop (a coffee on Saturdays, your name on the founders' wall…)." },
  { q: "Who runs the shop?", a: "The lead buyer (often an employee) keeps the majority and runs it day to day." },
];

export default function About(_p: { screen: Screen }) {
  return (
    <Page title="About & risks">
      <div className="mb-4 flex justify-center"><Logo height={84} /></div>
      <Card>
        <h2 className="serif text-xl font-semibold">How {APP_NAME} works</h2>
        <p className="mt-2 text-sm leading-relaxed">Neighbours take over local shops whose owners retire. A lead buyer keeps the majority. Residents join the capital from €100 through {PARTNER}. One company per shop: {APP_NAME} is not a fund.</p>
        <p className="mt-2 text-sm leading-relaxed">We earn a 5% fee on each raise, a €150/month shared-services subscription, and a referral fee from partner banks on takeover loans. The referral fee does not change your rate.</p>
      </Card>
      <AiTeam className="mt-5" />
      <Card className="mt-5 border-2 border-primary-dark">
        <h2 className="serif text-xl font-semibold text-primary-dark">Risk warning</h2>
        <ul className="mt-2 space-y-1 text-sm">
          <li>· You may lose all of what you invest.</li>
          <li>· Shares in a small company are not easily resellable.</li>
          <li>· Funds are held by our licensed crowdfunding partner, not by {APP_NAME}.</li>
        </ul>
        <Trust className="mt-3 !text-left" />
      </Card>
      <Card className="mt-3">
        <h2 className="font-semibold">Regulation</h2>
        <p className="mt-2 text-sm leading-relaxed">Crowdfunding follows the EU ECSP regulation through a licensed partner platform. Introducing loans in France requires the IOBSP intermediary status (registered with ORIAS). Grants shown in the app are indicative and must be checked with each funding body.</p>
      </Card>
      <Card className="mt-3">
        <h2 className="font-semibold">Data sources (future partners)</h2>
        <p className="mt-2 text-sm leading-relaxed">SIRENE (company register), BODACC (legal announcements), Bpifrance Transmission listings. In this demo every shop, person and figure is fictional.</p>
      </Card>
      <h2 className="serif mt-6 text-xl font-semibold">FAQ</h2>
      <div className="mt-2 space-y-2">
        {FAQ.map((f) => (
          <details key={f.q} className="rounded-2xl bg-surface p-4 shadow-sm">
            <summary className="cursor-pointer font-semibold">{f.q}</summary>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </Page>
  );
}
