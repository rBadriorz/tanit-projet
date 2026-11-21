// Client-side bank file PDF (A4), built with jspdf. Loaded on demand.
import { APP_NAME } from "../config";
import { P } from "../theme";
import { LOGO_DARK_OUTLINED_URL, LOGO_RATIO, svgToPng } from "../components/Logo";
import type { Shop } from "../types";
import type { BankFileResult, ValuationResult } from "../data/scripted";

const eur = (n: number) => "EUR " + Math.round(n).toLocaleString("en-GB");

export async function downloadBankFilePdf(shop: Shop, bank: BankFileResult, val: ValuationResult | null) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, M = 18;
  let y = 0;
  const hex = (h: string): [number, number, number] => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const brand = hex(P.primary);
  const ink = hex(P.text);
  const grey = hex(P.text2);

  // Header: dark brand brown with the dark (white) logo.
  doc.setFillColor(...hex(P.primaryDark));
  doc.rect(0, 0, W, 26, "F");
  doc.setTextColor(255, 255, 255);
  try {
    const png = await svgToPng(LOGO_DARK_OUTLINED_URL, Math.round(LOGO_RATIO * 120), 120);
    doc.addImage(png, "PNG", M, 3, 20 * LOGO_RATIO, 20);
  } catch {
    doc.setFont("helvetica", "bold"); doc.setFontSize(20);
    doc.text(APP_NAME, M, 16);
  }
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  doc.text("Takeover bank file", W - M, 16, { align: "right" });
  y = 38;

  const need = () => { if (y > 270) { doc.addPage(); y = 20; } };
  const h = (t: string) => {
    need(); y += 4;
    doc.setTextColor(...brand); doc.setFont("helvetica", "bold"); doc.setFontSize(12);
    doc.text(t, M, y); y += 6;
    doc.setTextColor(...ink); doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  };
  const p = (t: string) => {
    for (const line of doc.splitTextToSize(t, W - 2 * M) as string[]) { need(); doc.text(line, M, y); y += 5; }
  };
  const row = (a: string, b: string, bold = false) => {
    need(); doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(doc.splitTextToSize(a, 120)[0] as string, M, y); doc.text(b, W - M, y, { align: "right" }); y += 6;
    doc.setFont("helvetica", "normal");
  };

  doc.setTextColor(...ink); doc.setFont("times", "bold"); doc.setFontSize(16);
  doc.text(shop.name, M, y); y += 6;
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  doc.text(`${shop.street}, ${shop.town}`, M, y); y += 4;

  h("Executive summary"); p(bank.executiveSummary);
  if (shop.manager) {
    h("Who runs the shop");
    const role = shop.manager.role === "me" ? "the buyer" : shop.manager.role === "colleague" ? "a colleague" : "a family member";
    p(`${shop.manager.name}, ${role}, ${shop.manager.years} years in the trade.${shop.manager.pitch ? " " + shop.manager.pitch : ""}`);
  } else if (shop.managerWanted) {
    h("Manager to recruit (pending)");
    const w = shop.managerWanted;
    p(`${w.trade}, ${w.experience}. ${w.hours}, ${w.salary}.${w.canBeShareholder ? " Can also become a shareholder." : ""} The loan is to be confirmed once the manager is recruited.`);
  }
  if (val) {
    h("Valuation");
    for (const m of val.methods) row(m.name, eur(m.value));
    row("Recommended price", eur(val.recommendedPrice), true);
    row("Range", `${eur(val.range.low)} - ${eur(val.range.high)}`);
  }
  h("Financing plan");
  for (const f of bank.financingPlan) row(`${f.source} (${f.note})`, eur(f.amount));
  row("Total", eur(bank.financingPlan.reduce((a, f) => a + f.amount, 0)), true);
  h("Bank loan");
  row("Amount", eur(bank.loan.amount));
  row("Duration / rate", `${bank.loan.years} years / ${bank.loan.rate}%`);
  row("Monthly repayment", eur(bank.loan.monthly));
  row("Debt service coverage ratio", bank.dscr.toFixed(1), true);
  h("Strengths"); bank.strengths.forEach((s) => p("- " + s));
  h("Risks and mitigations"); bank.risks.forEach((r) => p(`- ${r.risk}: ${r.mitigation}`));
  h("Next steps"); bank.nextSteps.forEach((s, i) => p(`${i + 1}. ${s}`));

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8); doc.setTextColor(...grey);
    doc.text(`Demo · fictional data · ${APP_NAME} prototype · page ${i}/${pages}`, W / 2, 290, { align: "center" });
  }
  doc.save(`${APP_NAME}-bank-file-${shop.id}.pdf`);
}
