// Client-side bank file PDF (A4), built with jspdf. Loaded on demand.
import { APP_NAME } from "../config";
import type { Shop } from "../types";
import type { BankFileResult, ValuationResult } from "../data/scripted";

const eur = (n: number) => "EUR " + Math.round(n).toLocaleString("en-GB");

export async function downloadBankFilePdf(shop: Shop, bank: BankFileResult, val: ValuationResult | null) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, M = 18;
  let y = 0;
  const fir: [number, number, number] = [31, 77, 58];

  doc.setFillColor(...fir);
  doc.rect(0, 0, W, 26, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold"); doc.setFontSize(20);
  doc.text(APP_NAME, M, 16);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  doc.text("Takeover bank file", W - M, 16, { align: "right" });
  y = 38;

  const need = () => { if (y > 270) { doc.addPage(); y = 20; } };
  const h = (t: string) => {
    need(); y += 4;
    doc.setTextColor(...fir); doc.setFont("helvetica", "bold"); doc.setFontSize(12);
    doc.text(t, M, y); y += 6;
    doc.setTextColor(30, 30, 30); doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  };
  const p = (t: string) => {
    for (const line of doc.splitTextToSize(t, W - 2 * M) as string[]) { need(); doc.text(line, M, y); y += 5; }
  };
  const row = (a: string, b: string, bold = false) => {
    need(); doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(doc.splitTextToSize(a, 120)[0] as string, M, y); doc.text(b, W - M, y, { align: "right" }); y += 6;
    doc.setFont("helvetica", "normal");
  };

  doc.setTextColor(30, 30, 30); doc.setFont("times", "bold"); doc.setFontSize(16);
  doc.text(shop.name, M, y); y += 6;
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  doc.text(`${shop.street}, ${shop.town}`, M, y); y += 4;

  h("Executive summary"); p(bank.executiveSummary);
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
    doc.setFontSize(8); doc.setTextColor(110, 110, 110);
    doc.text(`Demo · fictional data · ${APP_NAME} prototype · page ${i}/${pages}`, W / 2, 290, { align: "center" });
  }
  doc.save(`${APP_NAME}-bank-file-${shop.id}.pdf`);
}
