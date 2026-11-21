import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Share2, FileText, Image as ImageIcon, Check } from "lucide-react";
import type { Screen, Shop } from "../types";
import { euro, pct, useStore } from "../store";
import { ShopFront, TYPE_LABEL } from "../components/ShopArt";
import { Shutter } from "../components/Shutter";
import { JoinSheet } from "../components/JoinSheet";
import { Donut } from "../components/Donut";
import { Avatar, Badge, Btn, Card, Progress, Sheet, Trust } from "../components/ui";
import { publicOrigin } from "../lib/url";
import { P } from "../theme";

const STEPS = ["Flagged", "Owner on board", "Valuation", "Bank file", "Raise open", "Bank approved", "Signing", "Reopened under new ownership"];
const AV_COLORS = [P.brown2, P.primary, P.primaryDark, P.warning, P.text2];

export function financingPlan(shop: Shop) {
  const price = shop.price || 0;
  const need = price + 15000;
  const lead = shop.leadBuyer?.contribution || 15000;
  const neighbours = shop.raise?.target || Math.round(price * 0.22);
  const publicSupport = 30000;
  const bank = Math.max(0, need - lead - neighbours - publicSupport);
  return [
    { label: "Lead buyer equity", value: lead, color: P.primaryDark },
    { label: "Neighbours", value: neighbours, color: P.primary },
    { label: "Honour loan & public support", value: publicSupport, color: P.warning },
    { label: "Bank loan", value: bank, color: P.brown2 },
  ];
}

export default function ShopPage({ screen }: { screen: Screen }) {
  const id = screen.name === "shop" ? screen.id : "";
  const { shop: get, back, go, notify, messages, applications, apply } = useStore();
  const shop = get(id);
  const [join, setJoin] = useState(false);
  const [applyOpen, setApplyOpen] = useState(screen.name === "shop" && !!screen.apply);
  const scroller = useRef<HTMLDivElement>(null);

  if (!shop) {
    return (
      <div className="absolute inset-0 grid place-items-center p-6 text-center">
        <div><p className="serif text-2xl">Shop not found</p><Btn className="mt-4" onClick={back}>Back</Btn></div>
      </div>
    );
  }

  const share = async () => {
    const url = `${publicOrigin()}/shop/${shop.id}`;
    try {
      if (navigator.share) { await navigator.share({ title: shop.name, url }); return; }
    } catch { return; }
    try { await navigator.clipboard.writeText(url); } catch { /* ignore */ }
    notify("Link copied");
  };

  const p = pct(shop);
  const closed = shop.status === "closed";
  const lit = shop.status === "taken_over" || (shop.raise ? shop.raise.raised >= shop.raise.target : false);
  const shutterOpen = closed ? 0 : shop.status === "taken_over" ? 100 : shop.raise ? p : shop.status === "open" ? 100 : 8;
  const shopMsgs = messages.filter((m) => m.shopId === shop.id);
  const interested = (shop.interested?.length || 0) + applications.filter((a) => a.shopId === shop.id).length;

  return (
    <div className="absolute inset-0 bg-page">
      <div ref={scroller} className={`no-scrollbar absolute inset-0 overflow-y-auto ${shop.status === "raising" ? "pb-40" : "pb-10"}`}>
        {/* Hero */}
        <div className="relative">
          <div className="relative overflow-hidden">
            <ShopFront type={shop.type} status={shop.status} name={shop.name} colors={shop.colors} lit={lit} className={`block w-full ${closed ? "grayscale" : ""}`} />
            <Shutter open={shutterOpen} />
            {lit && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }} className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 60px color-mix(in_srgb,var(--warning)_55%,transparent)" }} />}
          </div>
          <button aria-label="Back" onClick={back} className="press absolute left-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-surface/95 shadow"><ChevronLeft size={22} /></button>
          {!closed && <button aria-label="Share" onClick={share} className="press absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-surface/95 shadow"><Share2 size={18} /></button>}
        </div>

        <div className="space-y-4 px-4 pt-4">
          <div>
            <Badge status={shop.status} />
            <h1 className="serif mt-2 text-[28px] font-semibold leading-tight">{shop.name}</h1>
            <p className="text-sm text-muted">{TYPE_LABEL[shop.type]} · {shop.street}, {shop.town}</p>
            {shop.manager && <p className="mt-1 text-sm">Run by <b>{shop.manager.name}</b>{shop.manager.years ? ` · ${shop.manager.years} years in the trade` : ""}</p>}
            {shop.managerWanted && (
              <button onClick={() => go({ name: "poster", shopId: shop.id, kind: "manager" })} className="mt-2 inline-flex min-h-[36px] items-center gap-2 rounded-full bg-warning px-3 text-xs font-semibold text-white">
                Wanted: manager · {shop.managerWanted.trade}
              </button>
            )}
          </div>

          {closed && (
            <Card className="border-2 border-danger/40"><p className="serif text-lg leading-snug text-danger">{shop.name} closed in {shop.closedYear ?? 2024}. Nobody was there to take over. That's why we're here.</p></Card>
          )}

          {!closed && shop.status === "taken_over" && (
            <Card className="bg-primary text-white">
              <p className="serif text-lg leading-snug">Reopened under new ownership{shop.leadBuyer ? ` by ${shop.leadBuyer.firstName}` : ""}{shop.raise ? ` and ${shop.raise.backers} neighbours` : ""}.</p>
              <p className="mt-1 text-sm opacity-80">The shutter is up for good.</p>
            </Card>
          )}

          {!closed && shop.raise && shop.status !== "taken_over" && (
            <Card>
              <div className="flex items-end justify-between">
                <div><div className="serif text-2xl font-semibold text-primary">{euro(shop.raise.raised)}</div><div className="text-xs text-muted">of {euro(shop.raise.target)}</div></div>
                <div className="text-right text-sm font-semibold">{p}%</div>
              </div>
              <Progress value={p} pending={shop.raise.pending ? (shop.raise.pending / shop.raise.target) * 100 : 0} className="mt-3" />
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary" />Confirmed {euro(shop.raise.raised)}</span>
                {!!shop.raise.pending && <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary-light/40" />Pending validation {euro(shop.raise.pending)}</span>}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div><b className="block text-base">{shop.raise.backers}</b>neighbours</div>
                <div><b className="block text-base">{shop.raise.daysLeft}</b>days left</div>
                <div><b className="block text-base">€100</b>min ticket</div>
              </div>
            </Card>
          )}

          {!closed && shop.status === "raising" && <GapCard shop={shop} onGo={() => go({ name: "gap", shopId: shop.id })} />}

          {!closed && <Story shop={shop} />}

          {!closed && (
            <section>
              <h2 className="serif mb-2 text-xl font-semibold">People</h2>
              <div className="space-y-3">
                <Card>
                  <div className="flex gap-3">
                    <Avatar name={shop.owner.firstName} size={48} color={P.primary} />
                    <div className="min-w-0">
                      <div className="font-semibold">{shop.owner.firstName} <span className="font-normal text-muted">· owner</span></div>
                      {shop.owner.age > 0 && <div className="text-xs text-muted">{shop.owner.age}, {shop.owner.yearsInShop} years behind the counter</div>}
                      {shop.owner.quote && <p className="serif mt-2 text-[15px] italic leading-snug">“{shop.owner.quote}”</p>}
                    </div>
                  </div>
                </Card>
                {shop.leadBuyer ? (
                  <Card>
                    <div className="flex items-center gap-3">
                      <Avatar name={shop.leadBuyer.firstName} size={48} color={P.primaryDark} />
                      <div>
                        <div className="font-semibold">{shop.leadBuyer.firstName} <span className="font-normal text-muted">· lead buyer</span></div>
                        <div className="text-xs text-muted">{roleLine(shop)} · takes {shop.leadBuyer.stakePct}%</div>
                      </div>
                    </div>
                  </Card>
                ) : (shop.status === "seeking" || shop.status === "flagged") && (
                  <Card>
                    <p className="font-semibold">Looking for a lead buyer</p>
                    {interested > 0 && <p className="mt-1 text-sm text-primary">{interested} {interested === 1 ? "person" : "people"} interested</p>}
                    <div className="mt-3 grid gap-2">
                      <Btn kind="accent" onClick={() => go({ name: "takeover", shopId: shop.id })}>I want to be the lead buyer</Btn>
                      <Btn kind="light" onClick={() => setApplyOpen(true)}>I'm interested in taking over</Btn>
                    </div>
                  </Card>
                )}
                {shopMsgs.length > 0 && (
                  <div className="flex items-center gap-3 px-1">
                    <div className="flex -space-x-2">
                      {shopMsgs.slice(0, 5).map((m, i) => <div key={m.id} className="rounded-full ring-2 ring-page"><Avatar name={m.author} size={34} color={AV_COLORS[i % 5] ?? P.brown2} /></div>)}
                    </div>
                    <p className="text-xs text-muted">
                      {shopMsgs.slice(0, 3).map((m) => m.author.split(/[ ,(]/)[0]).join(", ")}
                      {shop.raise ? ` and ${Math.max(0, shop.raise.backers - 3)} others` : ""}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {!closed && shop.price && <KeyNumbers shop={shop} />}

          {!closed && shopMsgs.length > 0 && (
            <section>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="serif text-xl font-semibold">From the neighbourhood</h2>
                <button onClick={() => go({ name: "wall", shopId: shop.id })} className="min-h-[44px] text-sm font-semibold text-primary">See the wall</button>
              </div>
              <div className="space-y-2">
                {shopMsgs.slice(0, 3).map((m) => (
                  <Card key={m.id} className="!p-3">
                    <p className="text-[14px] leading-snug">“{m.text}”</p>
                    <p className="mt-1 text-xs text-muted">— {m.author}{m.street ? `, ${m.street}` : ""} · {m.ago}</p>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {!closed && shop.timelineStep != null && <Timeline step={shop.timelineStep} />}

          {!closed && (
            <section>
              <h2 className="serif mb-2 text-xl font-semibold">Documents</h2>
              <div className="grid grid-cols-2 gap-2">
                {shop.price && <DocBtn icon={<FileText size={18} />} label="Bank file (PDF)" onClick={() => go({ name: "takeover", shopId: shop.id })} />}
                <DocBtn icon={<ImageIcon size={18} />} label={shop.status === "seeking" || shop.status === "flagged" ? "Make a poster" : "Shop poster"}
                  onClick={() => go({ name: "poster", shopId: shop.id, kind: shop.status === "raising" ? "raise" : "successor" })} />
                {shop.raise && shop.status === "raising" && <DocBtn icon={<FileText size={18} />} label="Shareholders' agreement (summary)" onClick={() => notify("Summary: one share = one vote at the yearly meeting; lead buyer keeps the majority; exit after 5 years at fair value.")} />}
              </div>
            </section>
          )}
        </div>
      </div>

      {shop.status === "raising" && (
        <div className="absolute inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 px-4 pb-3 pt-3 backdrop-blur">
          <div className="flex gap-2">
            <Btn kind="accent" className="flex-1 text-[17px]" onClick={() => setJoin(true)}>Join from €100</Btn>
            <Btn kind="light" onClick={share}>Share</Btn>
          </div>
          <Trust className="mt-2" />
        </div>
      )}

      <JoinSheet shop={shop} open={join} onClose={() => setJoin(false)} />
      <ApplySheet open={applyOpen} onClose={() => setApplyOpen(false)} onSend={(a) => { apply({ shopId: shop.id, ...a }); setApplyOpen(false); notify("Sent to the owner (simulated)"); }} shop={shop} />
    </div>
  );
}

function roleLine(shop: Shop) {
  const lb = shop.leadBuyer!;
  if (lb.role === "employee") return `Employee for ${lb.yearsExperience} years`;
  if (lb.role === "resident") return `Resident · ${lb.yearsExperience} years in the trade`;
  return `${lb.yearsExperience} years of experience`;
}

function GapCard({ shop, onGo }: { shop: Shop; onGo: () => void }) {
  const r = shop.raise!;
  const elapsed = Math.max(1, 45 - r.daysLeft);
  const projected = r.raised + (r.raised / elapsed) * r.daysLeft;
  const gap = Math.round((r.target - projected) / 100) * 100;
  if (gap <= 0) {
    return <Card className="!p-3 text-sm"><b className="text-primary">On track.</b> At this pace the raise reaches its target before the deadline.</Card>;
  }
  return (
    <Card className="border-2 border-warning">
      <p className="text-sm font-semibold">Funding gap</p>
      <p className="mt-1 text-sm">This project may miss its target by <b>{euro(gap)}</b>. Here's how to close it.</p>
      <Btn className="mt-3 w-full" onClick={onGo}>Close the gap</Btn>
    </Card>
  );
}

function Story({ shop }: { shop: Shop }) {
  const paras = useMemo(() => {
    if (shop.story?.length) return shop.story;
    const o = shop.owner;
    const lb = shop.leadBuyer;
    const first = o.yearsInShop
      ? `For ${o.yearsInShop} years, ${o.firstName} has kept ${shop.name} open on ${shop.street}. Now it is time to hand over the keys.`
      : `${shop.name} is part of daily life on ${shop.street}. Neighbours want it to stay.`;
    const second = lb
      ? `${lb.firstName} wants to take over and run the shop. Neighbours join from €100 so the shop stays open and belongs to the street.`
      : `Nobody has stepped forward yet. Could it be you? Neighbours are ready to invest from €100.`;
    return [first, second];
  }, [shop]);
  return (
    <section>
      <h2 className="serif mb-2 text-xl font-semibold">The story</h2>
      <div className="space-y-3 text-[15px] leading-relaxed">{paras.map((t, i) => <p key={i}>{t}</p>)}</div>
      {(shop.pullQuote || shop.owner.quote) && (
        <blockquote className="serif mt-4 border-l-4 border-primary-dark pl-4 text-lg italic leading-snug text-primary">
          “{shop.pullQuote || shop.owner.quote}”
        </blockquote>
      )}
    </section>
  );
}

function KeyNumbers({ shop }: { shop: Shop }) {
  const plan = financingPlan(shop);
  const neighboursPct = shop.leadBuyer ? 100 - shop.leadBuyer.stakePct - 15 : 25;
  const items: [string, string][] = [
    ["Price", euro(shop.price || 0)],
    ["Revenue", shop.revenue ? `€${Math.round(shop.revenue / 1000)}k` : "—"],
    ["EBITDA", shop.ebitda ? `€${Math.round(shop.ebitda / 1000)}k` : "—"],
    ["Staff", String(shop.staff ?? "—")],
    ["Lead buyer stake", shop.leadBuyer ? `${shop.leadBuyer.stakePct}%` : "—"],
    ["Neighbours", `${Math.max(10, neighboursPct)}%`],
    ["Bank loan", euro(plan[3]?.value ?? 0)],
  ];
  return (
    <section>
      <h2 className="serif mb-2 text-xl font-semibold">Key numbers</h2>
      <Card>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {items.map(([k, v]) => <div key={k} className="flex justify-between border-b border-line py-1"><span className="text-muted">{k}</span><b>{v}</b></div>)}
        </div>
        <p className="mt-4 text-sm font-semibold">Financing plan</p>
        <div className="mt-2"><Donut data={plan} size={120} /></div>
      </Card>
    </section>
  );
}

function Timeline({ step }: { step: number }) {
  return (
    <section>
      <h2 className="serif mb-2 text-xl font-semibold">The takeover</h2>
      <Card>
        <ol className="space-y-0">
          {STEPS.map((s, i) => {
            const done = i < step, cur = i === step;
            return (
              <li key={s} className="flex items-stretch gap-3">
                <div className="flex flex-col items-center">
                  <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ${done ? "bg-primary text-white" : cur ? "bg-primary-dark text-white ring-4 ring-primary-dark/25" : "bg-line text-muted"}`}>
                    {done ? <Check size={14} /> : i + 1}
                  </span>
                  {i < STEPS.length - 1 && <span className={`w-0.5 flex-1 ${done ? "bg-primary" : "bg-line"}`} style={{ minHeight: 14 }} />}
                </div>
                <span className={`pb-3 text-sm ${cur ? "font-semibold text-primary-dark" : done ? "" : "text-muted"}`}>{s}{cur ? " · now" : ""}</span>
              </li>
            );
          })}
        </ol>
      </Card>
    </section>
  );
}

function DocBtn({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="press flex min-h-[56px] items-center gap-2 rounded-2xl bg-surface px-3 text-left text-sm font-semibold shadow-sm">
      <span className="text-primary">{icon}</span>{label}
    </button>
  );
}

function ApplySheet({ open, onClose, onSend, shop }: { open: boolean; onClose: () => void; onSend: (a: { name: string; experience: string; message: string }) => void; shop: Shop }) {
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => { if (!open) { setName(""); setExperience(""); setMessage(""); } }, [open]);
  return (
    <Sheet open={open} onClose={onClose}>
      <h2 className="serif text-2xl font-semibold">I'm interested in taking over</h2>
      <p className="mt-1 text-sm text-muted">{shop.owner.firstName} will see your message. Nothing is sent outside this demo.</p>
      <label className="mt-4 block text-sm font-semibold">First name
        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block min-h-[48px] w-full rounded-2xl border border-line bg-surface px-3 font-normal" />
      </label>
      <label className="mt-3 block text-sm font-semibold">Experience
        <input value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. 5 years in a butcher's shop" className="mt-1 block min-h-[48px] w-full rounded-2xl border border-line bg-surface px-3 font-normal" />
      </label>
      <label className="mt-3 block text-sm font-semibold">Message
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="mt-1 block w-full rounded-2xl border border-line bg-surface p-3 font-normal" />
      </label>
      <Btn className="mt-4 w-full" disabled={!name.trim()} onClick={() => onSend({ name: name.trim(), experience, message })}>Send (simulated)</Btn>
    </Sheet>
  );
}
