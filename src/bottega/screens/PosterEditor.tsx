import { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { Screen, Shop } from "../types";
import { Btn, Card, Page, BackToStart } from "../components/ui";
import { useStore } from "../store";
import { Poster, TEMPLATES, defaultHeadline, defaultSubline, type Template } from "../components/Poster";
import { TYPE_LABEL } from "../components/ShopArt";
import { publicOrigin } from "../lib/url";

const OFFERS = [
  "Training by the owner",
  "Help with the bank file",
  "Neighbours ready to invest",
  "Partner bank loan at a preferential rate",
  "Help finding grants",
];
const PROFILES = ["Employee", "Trained cook / baker / butcher", "Career changer", "Young graduate"];
type Kind = "raise" | "successor" | "manager";
export const MANAGER_HEADLINE = "This shop is looking for its next manager.";
const KIND_LABEL: Record<Kind, string> = { successor: "Call for a successor", raise: "Join the raise", manager: "Wanted: manager" };

/** "Wanted: manager" poster content, from the shop's listing (or sensible defaults). */
function managerContent(shop: Shop) {
  const w = shop.managerWanted;
  const offers = [w?.hours ?? "Full time, 5 days a week", w?.salary ?? "Salary to discuss", ...(w?.canBeShareholder !== false ? ["Option to become a shareholder"] : []), "Training by the owner"];
  const profiles = [w?.trade ?? TYPE_LABEL[shop.type], w?.experience ?? "Experience in the trade"];
  const subline = `${shop.name} (${shop.street}, ${shop.town}) is being taken over by its neighbours. They need someone to run it day to day.`;
  return { offers, profiles, subline };
}

export default function PosterEditor({ screen }: { screen: Screen }) {
  const st = useStore();
  const init = screen.name === "poster" ? screen : { shopId: "martin", kind: "successor" as const };
  const [kind, setKind] = useState<Kind>(init.kind ?? "successor");
  const choices = st.shops.filter((s) => s.status !== "open" && s.status !== "closed");
  const [shopId, setShopId] = useState(init.shopId);
  const shop = (st.shop(shopId) ?? choices[0])!;
  const trade = TYPE_LABEL[shop.type].toLowerCase();
  const presets = [
    `Wanted: someone to take over ${shop.name}.`,
    `${shop.owner.firstName || "The owner"} is retiring. Will you take over?`,
    `This ${trade} needs a new ${shop.type === "bakery" ? "baker" : shop.type === "butcher" ? "butcher" : "owner"}. Could it be you?`,
  ];
  const [headline, setHeadline] = useState("");
  const [subline, setSubline] = useState("");
  const mc = managerContent(shop);
  const [offers, setOffers] = useState<string[]>(init.kind === "manager" ? mc.offers : OFFERS.slice(0, 4));
  const [profiles, setProfiles] = useState<string[]>(init.kind === "manager" ? mc.profiles : ["Employee", "Trained cook / baker / butcher"]);
  const offerOptions = kind === "manager" ? [...new Set([...mc.offers, ...OFFERS])] : OFFERS;
  const profileOptions = kind === "manager" ? [...new Set([...mc.profiles, ...PROFILES])] : PROFILES;
  const posterKind: "raise" | "successor" = kind === "raise" ? "raise" : "successor";
  const cta = kind === "manager" ? "Scan if you could run it" : undefined;
  const [template, setTemplate] = useState<Template>("classic");
  const [busy, setBusy] = useState(false);
  const full = useRef<HTMLDivElement>(null);

  const h = headline || (kind === "raise" ? defaultHeadline(shop, "raise") : kind === "manager" ? MANAGER_HEADLINE : presets[0]!);
  const s = subline || (kind === "manager" ? mc.subline : defaultSubline(shop, kind));
  const props = { shop, kind: posterKind, template, origin: publicOrigin(), headline: h, subline: s, offers: kind !== "raise" ? offers : undefined, profiles: kind !== "raise" ? profiles : undefined, cta };

  const interested = useMemo(() => [
    ...(shop.interested ?? []).map((i) => `${i.name}, ${i.age}: ${i.note}`),
    ...st.applications.filter((a) => a.shopId === shop.id).map((a) => `${a.name}: ${a.experience}`),
  ], [shop, st.applications]);

  const printUrl = () => {
    if (kind === "raise") return `/poster/${shop.id}?template=${template}`;
    const q = new URLSearchParams({ template, h: h ?? "", s, o: offers.join("|"), p: profiles.join("|"), ...(cta ? { c: cta } : {}) });
    return `/poster/successor/${shop.id}?${q}`;
  };
  const shareUrl = `${publicOrigin()}/shop/${shop.id}${kind !== "raise" ? "?apply=1" : ""}`;

  const download = async () => {
    if (!full.current) return;
    setBusy(true);
    try {
      const url = await toPng(full.current, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement("a");
      a.href = url;
      a.download = `${shop.id}-poster.png`;
      a.click();
    } catch {
      st.notify("Could not create the image. Try Print instead.");
    } finally {
      setBusy(false);
    }
  };
  const share = async () => {
    try {
      if (navigator.share) { await navigator.share({ title: shop.name, url: shareUrl }); return; }
      await navigator.clipboard.writeText(shareUrl);
      st.notify("Link copied");
    } catch { /* user cancelled */ }
  };
  const toggle = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <Page title="Poster">
      <div className="mx-auto overflow-hidden rounded-2xl shadow-md" style={{ width: 794 * 0.42, height: 1123 * 0.42 }}>
        <div style={{ transform: "scale(0.42)", transformOrigin: "top left" }}><Poster {...props} /></div>
      </div>
      {/* Offscreen full-size copy for the PNG export */}
      <div style={{ position: "fixed", left: -10000, top: 0 }} aria-hidden><Poster ref={full} {...props} /></div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Btn kind="primary" className="px-2 text-sm" onClick={() => window.open(printUrl(), "_blank")}>Print (A4)</Btn>
        <Btn kind="light" className="px-2 text-sm" onClick={download} disabled={busy}>{busy ? "…" : "Download PNG"}</Btn>
        <Btn kind="light" className="px-2 text-sm" onClick={share}>Share</Btn>
      </div>

      {interested.length > 0 && (
        <Card className="mt-4">
          <div className="font-semibold text-primary">{interested.length} people interested</div>
          <ul className="mt-2 space-y-1 text-sm text-muted">{interested.map((i) => <li key={i}>· {i}</li>)}</ul>
        </Card>
      )}

      <Section title="Poster type">
        <div className="grid grid-cols-3 gap-2">
          {(["successor", "manager", "raise"] as const).map((k) => (
            <Chip key={k} on={kind === k} onClick={() => {
              setKind(k); setHeadline(""); setSubline("");
              if (k === "manager") { setOffers(mc.offers); setProfiles(mc.profiles); } else if (kind === "manager") { setOffers(OFFERS.slice(0, 4)); setProfiles(["Employee", "Trained cook / baker / butcher"]); }
            }}>{KIND_LABEL[k]}</Chip>
          ))}
        </div>
      </Section>
      <Section title="Shop">
        <select value={shop.id} onChange={(e) => { setShopId(e.target.value); setHeadline(""); setSubline(""); }}
          className="min-h-[48px] w-full rounded-2xl border border-line bg-surface px-3">
          {choices.map((c) => <option key={c.id} value={c.id}>{c.name} · {c.town}</option>)}
        </select>
      </Section>
      <Section title="Headline">
        {kind !== "raise" && (
          <div className="mb-2 flex flex-col gap-2">
            {(kind === "manager" ? [MANAGER_HEADLINE, `${shop.name} needs a manager. Could it be you?`] : presets).map((p) => <Chip key={p} on={h === p} onClick={() => setHeadline(p)}>{p}</Chip>)}
          </div>
        )}
        <input value={h} onChange={(e) => setHeadline(e.target.value)} className="min-h-[48px] w-full rounded-2xl border border-line bg-surface px-3" aria-label="Headline" />
      </Section>
      <Section title="Subline">
        <textarea value={s} onChange={(e) => setSubline(e.target.value)} rows={3} className="w-full rounded-2xl border border-line bg-surface p-3" aria-label="Subline" />
      </Section>
      {kind !== "raise" && (
        <>
          <Section title="What we offer">
            <div className="flex flex-wrap gap-2">{offerOptions.map((o) => <Chip key={o} on={offers.includes(o)} onClick={() => toggle(offers, setOffers, o)}>{o}</Chip>)}</div>
          </Section>
          <Section title="Profile wanted">
            <div className="flex flex-wrap gap-2">{profileOptions.map((o) => <Chip key={o} on={profiles.includes(o)} onClick={() => toggle(profiles, setProfiles, o)}>{o}</Chip>)}</div>
          </Section>
        </>
      )}
      <Section title="Template">
        <div className="grid grid-cols-3 gap-2">{TEMPLATES.map((t) => <Chip key={t.id} on={template === t.id} onClick={() => setTemplate(t.id)}>{t.label}</Chip>)}</div>
      </Section>
      <BackToStart className="mt-5" />
    </Page>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="mt-5"><div className="mb-2 text-sm font-semibold text-muted">{title}</div>{children}</div>;
}
export function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={on}
      className={`press min-h-[44px] rounded-2xl px-3 py-2 text-left text-sm ${on ? "bg-primary text-white" : "border border-line bg-surface text-ink"}`}>
      {children}
    </button>
  );
}
