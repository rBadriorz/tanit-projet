// Agents de Tanit Citoyen. L'IA lit, explique et prépare. Les règles calculent. Le citoyen valide.
//  1. « Mes droits » : lit l'avis d'imposition, calcule les aides, remplit le dossier, puis le citoyen valide.
//  2. Veille : quand la situation change, relance l'analyse et prévient.
//  3. Suivi de dossier : rappels et relance prête à envoyer si le dossier n'avance pas.
//  4. Agent Tanit : explique le relevé trimestriel et résume les options avant le vote.
//  5. Agent décideurs : teste un scénario contre les critères Eurostat et produit une note.
// Sans clé API (ou si la personne a refusé l'IA), chaque agent tourne en « mode démo » :
// mêmes étapes, réponses d'exemple écrites à l'avance, clairement signalées.

export const AGENT_L = {
fr:{
 n_aid:"Mes droits", home_aid_btn:"Lancer l'agent Mes droits",
 mode_live:"IA connectée", mode_demo:"Mode démo : réponses d'exemple, sans IA",
 dr_h1:"Mes droits", dr_intro:"Un agent fait la démarche avec vous, en quatre étapes. Vous voyez chaque action. Rien n'est envoyé sans votre accord.",
 dr_start_h:"Pour commencer, votre avis d'imposition", dr_start_p:"L'agent le lit pour vous. La photo n'est pas conservée.",
 dr_photo:"Prendre en photo mon avis", dr_sample:"Essayer avec un avis d'exemple", dr_manual:"Je préfère remplir moi-même",
 dr_restart:"Recommencer", dr_doc_off:"Vous avez refusé la lecture de documents. Utilisez l'avis d'exemple ou remplissez vous-même.",
 st:["Lire votre document","Calculer vos aides","Remplir le dossier","Votre validation"],
 st_known:"J'utilise les informations que vous m'avez déjà données.",
 lg_recv:"Document reçu", lg_read:"Lecture du document par l'IA…", lg_read_demo:"Lecture de l'avis d'exemple…",
 lg_type:"Type", lg_year:"Revenus", lg_rfr:"Revenu fiscal de référence", lg_sal:"Salaires déclarés", lg_parts:"Parts", lg_kids:"Enfants à charge", lg_sit:"Situation", lg_month:"Revenu mensuel retenu",
 sit:{seul:"seul(e)",couple:"en couple"},
 lg_unread:"Je n'arrive pas à lire ce document. Essayez une photo plus nette, à plat, bien éclairée.",
 ask_h:"Il me manque une information", ask_rent:"Quel est votre loyer par mois, charges comprises ? Mettez 0 si vous êtes propriétaire ou hébergé.", ask_act:"Quelle est votre situation professionnelle ?", ask_age:"Votre âge", ask_go:"Continuer",
 lg_rules:"Moteur de règles : barèmes simplifiés 2026", lg_of:"Simulateur officiel OpenFisca (la législation codée en open source)…", lg_of_ok:"Montants calculés par le simulateur officiel OpenFisca", lg_of_ko:"Simulateur officiel injoignable : j'utilise les barèmes simplifiés", src_of:"OpenFisca", src_rules:"barème simplifié", lg_check:"Vérification", lg_excl:"non retenue", lg_total:"Total estimé", lg_ai_explain:"L'IA explique chaque résultat en mots simples…",
 lg_pick:"Je prépare le dossier le plus utile", lg_fill:"Je remplis le formulaire…", lg_fields:"champs remplis", lg_todo:"à compléter par vous", lg_missing:"Pièces à fournir",
 lg_wait_you:"À vous : relisez et validez.",
 permonth:"/ mois", about:"environ", health:"Frais de santé réduits",
 elig:{probable:"Probable",possible:"Possible","peu probable":"Peu probable"},
 res_h:"Ce que l'agent a trouvé", res_note:"Estimations. Seul l'organisme décide.", other_aid:"Préparer plutôt :",
 form_h:"Votre dossier pré-rempli", form_p:"Vérifiez chaque ligne. Vous pouvez tout corriger.",
 src:{document:"lu sur le document",vous:"donné par vous",calcul:"calculé",a_completer:"à compléter"},
 form_check:"J'ai relu : ces informations sont exactes.", form_ok:"Valider et envoyer (simulation)", form_need:"Cochez la case pour confirmer que vous avez relu.",
 form_left:n => n + (n > 1 ? " champs restent à compléter. Vous pourrez les ajouter depuis votre compte." : " champ reste à compléter. Vous pourrez l'ajouter depuis votre compte."),
 done_h:"Dossier validé", done_p:"Dans la vraie version, il partirait à l'organisme. Ici, rien n'est envoyé. L'agent suit votre dossier et vous préviendra.", done_btn:"Suivre mon dossier",
 vg_h:"Veille de mes droits", vg_p:"Si votre vie change, l'agent refait le calcul et vous prévient.", vg_on:"Veille activée", vg_events:"Ma situation change (démo) :",
 ev:{naissance:"Naissance d'un enfant",demenagement:"Déménagement, loyer plus cher",baisse:"Baisse de revenus",emploi:"Perte d'emploi",retraite:"Départ à la retraite"},
 vg_none:"Aucune alerte pour l'instant.", vg_new:(a,m) => "Vous avez peut-être droit à : " + a + (m ? " (environ " + m + " par mois)." : "."), vg_up:(a,m) => a + " : votre montant pourrait augmenter (environ " + m + " par mois).", vg_down:a => a + " pourrait baisser ou s'arrêter. Pensez à déclarer ce changement.",
 vg_same:"L'analyse est refaite : rien ne change pour vos aides.", vg_prep:"Préparer le dossier", vg_reset:"Réinitialiser la démo", vg_off:"Activez la veille pour recevoir des alertes.",
 al_h:"Alertes de l'agent",
 dos_org:"Organisme :", dos_pieces:"Pièces", dos_follow:"Suivi automatique", dos_sim:"Avancer de 15 jours (démo)", dos_none:"Aucun événement pour l'instant.",
 dos_sent:"Transmis à l'organisme.", dos_review:"Dossier en cours d'examen.", dos_decision:"Décision : accord (simulation).",
 dos_stuck:(d, p) => "Rappel automatique : le dossier n'avance plus depuis " + d + " jours. Il manque : " + p + ".",
 dos_draft:"Message de relance prêt", dos_send:"Envoyer la relance (simulation)", dos_sent_r:"Relance envoyée par vous (simulation).", dos_action:"Action requise",
 dos_tpl:(a, o, p) => "Bonjour,\nJ'ai déposé une demande de " + a + " auprès de " + o + ". Elle ne semble pas avancer. Je joins les pièces qui manquaient : " + p + ". Pouvez-vous me dire si mon dossier est maintenant complet ?\nMerci,",
 home_dos:(n, a) => n + " dossier" + (n > 1 ? "s" : "") + " suivi" + (n > 1 ? "s" : "") + (a ? " · " + a + " action requise" : ""),
 tn_h:"Agent Tanit", tn_stmt:"Relevé d'exemple · 3e année", tn_paid:"Versé ce trimestre", tn_total:"Total versé depuis le début", tn_value:"Valeur de vos parts", tn_var:"Variation ce trimestre", tn_btn:"Expliquez-moi mon relevé",
 tn_steps:["Je lis le relevé","Je compare avec le trimestre dernier","J'écris en mots simples"],
 vt_h:"Avant de voter : l'agent résume", vt_p:"Un résumé neutre de chaque choix. L'agent ne vous dit pas quoi voter.", vt_btn:"Résumer les options", vt_gain:"On gagne", vt_risk:"On risque",
 v1_opts:["Plus de transition écologique","Plus d'industrie souveraine"],
 ed_h:"Agent décideurs", ed_steps:["Lire le scénario","Tester les 4 critères Eurostat","Analyser les risques","Rédiger la note"],
 ed_crit_ok:"respecté", ed_crit_ko:"NON respecté", ed_risk:{faible:"Risque faible",moyen:"Risque moyen","élevé":"Risque élevé"},
 nt_title:"Note d'analyse préparatoire", nt_to:"Pour : cabinet ministériel (simulation)", nt_obj:"Objet", nt_syn:"Synthèse", nt_crit:"Critères testés", nt_risks:"Points fragiles", nt_q:"Questions à poser à l'INSEE et à Eurostat", nt_reco:"Recommandation", nt_dl:"Télécharger la note", nt_warn:"Analyse préparatoire. Seuls l'INSEE et Eurostat décident du classement.",
 spec:"SPÉCIMEN · DOCUMENT FICTIF"
},
en:{
 n_aid:"My rights", home_aid_btn:"Start the My rights agent",
 mode_live:"AI connected", mode_demo:"Demo mode: example answers, no AI",
 dr_h1:"My rights", dr_intro:"An agent does the paperwork with you, in four steps. You see every action. Nothing is sent without your approval.",
 dr_start_h:"To start, your tax notice", dr_start_p:"The agent reads it for you. The photo is not kept.",
 dr_photo:"Take a photo of my notice", dr_sample:"Try with an example notice", dr_manual:"I'd rather fill it in myself",
 dr_restart:"Start again", dr_doc_off:"You turned off document reading. Use the example notice or fill it in yourself.",
 st:["Read your document","Work out your benefits","Fill in the application","Your approval"],
 st_known:"I'm using the information you already gave me.",
 lg_recv:"Document received", lg_read:"The AI is reading the document…", lg_read_demo:"Reading the example notice…",
 lg_type:"Type", lg_year:"Income year", lg_rfr:"Reference taxable income", lg_sal:"Declared salaries", lg_parts:"Tax shares", lg_kids:"Dependent children", lg_sit:"Household", lg_month:"Monthly income used",
 sit:{seul:"single",couple:"couple"},
 lg_unread:"I can't read this document. Try a sharper photo, flat and well lit.",
 ask_h:"I need one more thing", ask_rent:"What is your monthly rent, including charges? Put 0 if you own your home or live with someone.", ask_act:"What is your work situation?", ask_age:"Your age", ask_go:"Continue",
 lg_rules:"Rules engine: simplified 2026 scales", lg_of:"Official OpenFisca simulator (French law as open-source code)…", lg_of_ok:"Amounts calculated by the official OpenFisca simulator", lg_of_ko:"Official simulator unreachable: using simplified scales", src_of:"OpenFisca", src_rules:"simplified scale", lg_check:"Checking", lg_excl:"not eligible", lg_total:"Estimated total", lg_ai_explain:"The AI explains each result in plain words…",
 lg_pick:"I'm preparing the most useful application", lg_fill:"Filling in the form…", lg_fields:"fields filled in", lg_todo:"for you to complete", lg_missing:"Documents to provide",
 lg_wait_you:"Your turn: read and approve.",
 permonth:"/ month", about:"about", health:"Lower health costs",
 elig:{probable:"Likely",possible:"Possible","peu probable":"Unlikely"},
 res_h:"What the agent found", res_note:"Estimates. Only the benefits office decides.", other_aid:"Prepare instead:",
 form_h:"Your pre-filled application", form_p:"Check every line. You can correct anything.",
 src:{document:"read from document",vous:"given by you",calcul:"calculated",a_completer:"to complete"},
 form_check:"I have checked: this information is correct.", form_ok:"Approve and send (simulation)", form_need:"Tick the box to confirm you have checked.",
 form_left:n => n + (n > 1 ? " fields are still to complete. You can add them from your account." : " field is still to complete. You can add it from your account."),
 done_h:"Application approved", done_p:"In the real version it would go to the benefits office. Here nothing is sent. The agent tracks your application and will let you know.", done_btn:"Track my application",
 vg_h:"Rights watch", vg_p:"If your life changes, the agent redoes the calculation and lets you know.", vg_on:"Watch turned on", vg_events:"My situation changes (demo):",
 ev:{naissance:"A baby is born",demenagement:"Moving home, higher rent",baisse:"Lower income",emploi:"Losing my job",retraite:"Retiring"},
 vg_none:"No alerts yet.", vg_new:(a,m) => "You may be entitled to: " + a + (m ? " (about " + m + " a month)." : "."), vg_up:(a,m) => a + ": your amount could go up (about " + m + " a month).", vg_down:a => a + " could go down or stop. Remember to report this change.",
 vg_same:"Analysis redone: nothing changes for your benefits.", vg_prep:"Prepare the application", vg_reset:"Reset the demo", vg_off:"Turn on the watch to get alerts.",
 al_h:"Alerts from the agent",
 dos_org:"Office:", dos_pieces:"Documents", dos_follow:"Automatic follow-up", dos_sim:"Move 15 days ahead (demo)", dos_none:"Nothing yet.",
 dos_sent:"Sent to the office.", dos_review:"Application under review.", dos_decision:"Decision: approved (simulation).",
 dos_stuck:(d, p) => "Automatic reminder: no progress for " + d + " days. Still missing: " + p + ".",
 dos_draft:"Follow-up message ready", dos_send:"Send the follow-up (simulation)", dos_sent_r:"Follow-up sent by you (simulation).", dos_action:"Action needed",
 dos_tpl:(a, o, p) => "Hello,\nI applied for " + a + " with " + o + ". It does not seem to be moving. I am attaching the missing documents: " + p + ". Could you tell me whether my application is now complete?\nThank you,",
 home_dos:(n, a) => n + " application" + (n > 1 ? "s" : "") + " tracked" + (a ? " · " + a + " action needed" : ""),
 tn_h:"Tanit agent", tn_stmt:"Example statement · year 3", tn_paid:"Paid in this quarter", tn_total:"Total paid in so far", tn_value:"Value of your units", tn_var:"Change this quarter", tn_btn:"Explain my statement",
 tn_steps:["Reading the statement","Comparing with last quarter","Writing it in plain words"],
 vt_h:"Before you vote: the agent sums up", vt_p:"A neutral summary of each choice. The agent does not tell you how to vote.", vt_btn:"Sum up the options", vt_gain:"What we gain", vt_risk:"What we risk",
 v1_opts:["More green transition","More sovereign industry"],
 ed_h:"Policymakers' agent", ed_steps:["Read the scenario","Test the 4 Eurostat criteria","Analyse the risks","Write the briefing note"],
 ed_crit_ok:"met", ed_crit_ko:"NOT met", ed_risk:{faible:"Low risk",moyen:"Medium risk","élevé":"High risk"},
 nt_title:"Preliminary briefing note", nt_to:"For: minister's office (simulation)", nt_obj:"Subject", nt_syn:"Summary", nt_crit:"Criteria tested", nt_risks:"Weak points", nt_q:"Questions for INSEE and Eurostat", nt_reco:"Recommendation", nt_dl:"Download the note", nt_warn:"Preliminary analysis. Only INSEE and Eurostat decide the classification.",
 spec:"SPECIMEN · FICTIONAL DOCUMENT"
}};

/* ---------------- outils communs ---------------- */
let C = null;                                   // contexte fourni par main.js
const $ = id => document.getElementById(id);
const t = k => C.t(k);
const L = () => C.lang() || 'fr';
const mk = (tag, cls, text) => C.mk(tag, cls, text);
const eur = n => C.eur(n);
const live = () => Boolean(C.sample()) && C.aiOn();
const calm = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const pause = ms => new Promise(r => setTimeout(r, calm ? Math.min(ms, 120) : ms));
const AI_LANG = () => C.t('ai_lang');
const errText = e => C.errCopy(e && e.code);
const sep = () => (L() === 'fr' ? ' : ' : ': ');

function modeTag(el){ if (!el) return; const on = live(); el.className = 'tag ' + (on ? 'ok' : 'warn'); el.textContent = on ? t('mode_live') : t('mode_demo'); }

/** Une liste d'étapes qui s'affichent une à une, avec un journal d'actions (comme un agent qui travaille). */
function stepper(box, titles){
  box.replaceChildren(); box.hidden = false;
  const items = titles.map((title, i) => {
    const li = mk('li', 'step'); li.dataset.state = 'wait';
    const head = mk('div', 'st-head'); head.append(mk('span', 'st-dot', String(i + 1)), mk('b', '', title), mk('span', 'st-time'));
    const log = mk('ul', 'st-log'); li.append(head, log); box.append(li); return li;
  });
  let t0 = 0;
  return {
    start(i){ items[i].dataset.state = 'run'; t0 = performance.now(); items[i].scrollIntoView({behavior: calm ? 'auto' : 'smooth', block:'nearest'}); },
    done(i, state = 'done'){ items[i].dataset.state = state; items[i].querySelector('.st-time').textContent = ((performance.now() - t0) / 1000).toFixed(1) + ' s'; },
    async log(i, text, tool, extra){
      const li = mk('li'); if (tool) li.append(mk('code', 'tool', tool)); li.append(mk('span', '', text)); if (extra) li.append(extra);
      items[i].querySelector('.st-log').append(li); await pause(260); return li;
    },
    el: i => items[i]
  };
}

/* ---------------- moteur de règles (barèmes simplifiés, ordres de grandeur) ----------------
   Les montants viennent d'abord du simulateur officiel OpenFisca (/api/openfisca). Ces barèmes servent de repli
   s'il est injoignable, et pour les aides qu'il ne calcule pas ici (complémentaire santé, chèque énergie).
   Ici : formules simplifiées 2026, prudentes, pour montrer le principe « les règles calculent ». */
const AIDS = {
 pa:  {fr:["Prime d'activité","CAF",["Bulletins de salaire des 3 derniers mois","RIB"]], en:["In-work benefit (prime d'activité)","CAF benefits office",["Payslips for the last 3 months","Bank details (RIB)"]]},
 rsa: {fr:["Revenu de solidarité active (RSA)","CAF",["Pièce d'identité","RIB","Justificatif de domicile"]], en:["Minimum income (RSA)","CAF benefits office",["ID document","Bank details (RIB)","Proof of address"]]},
 apl: {fr:["Aide au logement (APL)","CAF",["Bail ou quittance de loyer","RIB du bailleur ou le vôtre"]], en:["Housing benefit (APL)","CAF benefits office",["Lease or rent receipt","Landlord's or your bank details"]]},
 asf: {fr:["Allocation de soutien familial","CAF",["Jugement ou attestation sur la pension alimentaire","Acte de naissance de l'enfant"]], en:["Family support allowance (ASF)","CAF benefits office",["Court ruling or statement on child support","Child's birth certificate"]]},
 af:  {fr:["Allocations familiales","CAF",["Livret de famille"]], en:["Family allowance","CAF benefits office",["Family record book"]]},
 css: {fr:["Complémentaire santé solidaire","Assurance maladie",["Carte Vitale","Avis d'imposition"]], en:["Free top-up health cover (CSS)","Health insurance fund",["Carte Vitale health card","Tax notice"]]},
 ce:  {fr:["Chèque énergie","État (automatique)",["Aucune : envoyé automatiquement si la déclaration d'impôt est faite"]], en:["Energy voucher (chèque énergie)","State (automatic)",["None: sent automatically once the tax return is filed"]]},
 aspa:{fr:["Minimum vieillesse (ASPA)","Caisse de retraite",["Relevé de pension","RIB"]], en:["Minimum old-age pension (ASPA)","Pension fund",["Pension statement","Bank details (RIB)"]]}
};
const WHY = {
 fr:{pa:"Vous travaillez et votre revenu est modeste : la CAF complète.", rsa:"Vos ressources sont sous le montant minimum garanti.", apl:"Vous payez un loyer et vos revenus restent sous le plafond. Le montant dépend de votre ville.", asf:"Vous élevez seul(e) un enfant. Possible si l'autre parent ne verse pas ou peu de pension.", af:"Vous avez au moins deux enfants à charge.", css:r => r === 'probable' ? "Vos revenus sont sous le plafond : la complémentaire santé serait gratuite." : "Vos revenus sont proches du plafond : elle coûterait au plus 1 € par jour.", ce:"Votre revenu fiscal par part est sous le plafond.", aspa:"Vous avez 65 ans ou plus et vos ressources sont sous le minimum vieillesse."},
 en:{pa:"You work and your income is modest: the CAF tops it up.", rsa:"Your income is below the guaranteed minimum.", apl:"You pay rent and your income is under the ceiling. The amount depends on your town.", asf:"You are raising a child alone. Possible if the other parent pays little or no child support.", af:"You have at least two dependent children.", css:r => r === 'probable' ? "Your income is under the ceiling: top-up health cover would be free." : "Your income is close to the ceiling: it would cost at most €1 a day.", ce:"Your taxable income per share is under the ceiling.", aspa:"You are 65 or over and your income is below the minimum pension."}
};
const SMIC = 1430;
export function rules(p){
  const enf = Math.max(0, p.enfants_a_charge | 0), couple = p.vie === 'couple', rev = Math.max(0, +p.revenu_net_mensuel || 0);
  const loyer = Math.max(0, +p.loyer_mensuel || 0), age = +p.age || 40, working = p.activite === 'salarié' || p.activite === 'indépendant';
  const comp = 1 + (couple ? .5 : 0) + .3 * Math.min(enf, 2) + .4 * Math.max(0, enf - 2);
  const r = [];
  const add = (id, elig, m, rule) => r.push({id, eligibilite: elig, montant_mensuel: m == null ? null : Math.round(m), regle: rule});
  // Prime d'activité : forfait + 61 % des revenus d'activité + bonification − max(ressources, forfait) − forfait logement
  if (working && rev > 0 && age < 67){
    const F = 633 * comp, bon = rev < SMIC * .5 ? 0 : Math.min(184, (rev - SMIC * .5) / (SMIC * .5) * 184);
    const m = F + .61 * rev + bon - Math.max(rev, F) - (loyer > 0 ? 76 : 0);
    if (m >= 15) add('pa', 'probable', m, 'pa(revenu=' + Math.round(rev) + ', foyer=' + comp.toFixed(1) + ')');
  }
  // RSA : forfait − ressources − forfait logement
  if (age >= 25 || enf > 0){ const m = 646 * comp - rev - (loyer > 0 ? 78 : 0); if (m >= 15) add('rsa', 'probable', m, 'rsa(ressources=' + Math.round(rev) + ')'); }
  // APL (zone 2) : loyer retenu dans la limite du plafond − participation personnelle
  if (loyer > 0){
    const plaf = enf ? 386 + 56 * (enf - 1) : couple ? 343 : 280;
    const part = 37 + .28 * Math.max(0, rev - (550 + 250 * enf + (couple ? 250 : 0)));
    const m = Math.min(loyer, plaf) - part; if (m >= 10) add('apl', 'possible', m, 'apl(loyer=' + loyer + ', plafond=' + plaf + ')');
  }
  // Allocation de soutien familial : parent isolé
  if (!couple && enf > 0) add('asf', 'possible', 199 * enf, 'asf(enfants=' + enf + ')');
  // Allocations familiales : dès 2 enfants
  if (enf >= 2) add('af', 'probable', 151 + 193 * (enf - 2), 'af(enfants=' + enf + ')');
  // Complémentaire santé solidaire : plafond annuel selon la taille du foyer
  { const n = 1 + (couple ? 1 : 0) + enf, coef = [1, 1.5, 1.8, 2.1][n - 1] ?? 2.1 + .4 * (n - 4), plaf = 10166 * coef, an = rev * 12;
    if (an <= plaf) add('css', 'probable', null, 'css(revenus=' + Math.round(an) + ' <= ' + Math.round(plaf) + ')');
    else if (an <= plaf * 1.35) add('css', 'possible', null, 'css(revenus=' + Math.round(an) + ' <= ' + Math.round(plaf * 1.35) + ')'); }
  // Chèque énergie : revenu fiscal par unité de consommation
  { const uc = 1 + (couple ? .5 : 0) + .3 * enf, rfr = +p.rfr || rev * 12 * .9, q = rfr / uc;
    if (q < 11000) add('ce', 'probable', (q < 5600 ? 194 : q < 6700 ? 146 : q < 7700 ? 98 : 48) / 12, 'cheque_energie(rfr/uc=' + Math.round(q) + ')'); }
  // Minimum vieillesse
  if (age >= 65){ const plaf = couple ? 1605 : 1034; if (rev < plaf) add('aspa', 'probable', plaf - rev, 'aspa(ressources=' + Math.round(rev) + ')'); }
  const order = {probable:0, possible:1, 'peu probable':2};
  return r.sort((a, b) => order[a.eligibilite] - order[b.eligibilite] || (b.montant_mensuel || 0) - (a.montant_mensuel || 0));
}
function named(r){
  const lg = L(), [aide, organisme, pieces] = AIDS[r.id][lg], why = WHY[lg][r.id];
  return {...r, aide, organisme, pieces: [...pieces], pourquoi: typeof why === 'function' ? why(r.eligibilite) : why};
}
const ALL_RULES = ['pa','rsa','apl','asf','af','css','ce','aspa'];

/** Outil « simulateur officiel » : OpenFisca, appelé par notre serveur (/api/openfisca). */
async function officialCalc(p){
  try {
    const r = await fetch('/api/openfisca', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({profil: p}), signal: AbortSignal.timeout(15000)});
    if (!r.ok) return null; const d = await r.json(); return d && d.ok && Array.isArray(d.aides) ? d.aides : null;
  } catch { return null; }
}
/** Les montants officiels remplacent nos barèmes pour les aides qu'OpenFisca a calculées. */
function mergeOfficial(raw, of){
  const byId = new Map(raw.map(r => [r.id, r]));
  for (const o of of){
    if (!(o.montant_mensuel > 0)) { byId.delete(o.id); continue; }
    byId.set(o.id, {id:o.id, eligibilite: o.id === 'apl' || o.id === 'asf' ? 'possible' : 'probable', montant_mensuel: o.montant_mensuel, regle:'openfisca:' + o.variable, src:'of'});
  }
  const order = {probable:0, possible:1, 'peu probable':2};
  return [...byId.values()].sort((a, b) => order[a.eligibilite] - order[b.eligibilite] || (b.montant_mensuel || 0) - (a.montant_mensuel || 0));
}
const total = list => list.reduce((s, a) => s + (a.eligibilite !== 'peu probable' && a.montant_mensuel ? a.montant_mensuel : 0), 0);

/* ---------------- avis d'imposition d'exemple (fictif) ---------------- */
const EXAMPLE = {type:"avis d'imposition", annee_revenus:2025, salaires_annuels:19330, revenu_fiscal_reference:17400, nombre_parts:1.5, enfants_a_charge:1, vie:'seul', lisible:true};
function exampleCanvas(){
  const W = 900, H = 640, c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, W, H);
  g.strokeStyle = '#80859e'; g.lineWidth = 2; g.strokeRect(20, 20, W - 40, H - 40);
  g.fillStyle = '#0d0f2e'; g.font = 'bold 30px Arial'; g.fillText("AVIS D'IMPÔT 2026", 50, 80);
  g.font = '22px Arial'; g.fillText("sur les revenus de l'année 2025", 50, 115);
  g.fillStyle = '#c9000d'; g.font = 'bold 22px Arial'; g.fillText(AGENT_L.fr.spec, 520, 80);
  g.fillStyle = '#0d0f2e'; g.font = '20px Arial';
  const rows = [["Situation de famille","Célibataire"],["Nombre de parts","1,5"],["Personnes à charge","1 enfant"],["Salaires et traitements déclarés","19 330 €"],["Revenu fiscal de référence","17 400 €"],["Impôt sur le revenu net","0 €"]];
  rows.forEach(([k, v], i) => { const y = 190 + i * 62; g.fillStyle = i % 2 ? '#ffffff' : '#f5f6fa'; g.fillRect(40, y - 36, W - 80, 56); g.fillStyle = '#0d0f2e'; g.font = '22px Arial'; g.fillText(k, 60, y); g.font = 'bold 24px Arial'; g.fillText(v, 620, y); });
  g.fillStyle = '#5b5f7d'; g.font = 'italic 18px Arial'; g.fillText("Document fictif créé pour la démonstration de Tanit Citoyen (prototype étudiant).", 50, 600);
  return c;
}
const canvasFile = c => new Promise(res => c.toBlob(b => res(new File([b], 'avis-exemple.png', {type:'image/png'})), 'image/png'));

/* =========================================================================================
   1. AGENT « MES DROITS »
   ========================================================================================= */
let run = 0;               // identifiant de l'exécution en cours (une nouvelle annule l'ancienne)
let found = [];            // aides trouvées (nommées)
let prof = null;           // profil utilisé
let docData = null;        // données lues sur le document

const PROFILE_KEY = 'agent_profil';
function baseProfile(){ return C.jget(PROFILE_KEY) || {revenu_net_mensuel:1611, loyer_mensuel:620, age:34, enfants_a_charge:1, vie:'seul', activite:'salarié', rfr:17400}; }

async function readDocument(file, S, my){
  if (!live()){
    await S.log(0, t('lg_read_demo'), 'document.lire()'); await pause(500);
    return {...EXAMPLE};
  }
  await S.log(0, t('lg_read'), 'claude.vision.lire_avis()');
  const d = await C.sample().json(
    "Tu lis la photo d'un document fiscal français (avis d'imposition, ou à défaut fiche de paie). Extrais uniquement ce qui est écrit. " +
    "Champs : type (nature du document), annee_revenus, salaires_annuels (salaires et traitements déclarés, en euros par an), revenu_fiscal_reference, nombre_parts, enfants_a_charge, vie (« seul » ou « couple »), lisible. " +
    "Pour une fiche de paie, mets le net mensuel multiplié par 12 dans salaires_annuels. Mets null si une information n'est pas visible. N'invente rien.",
    {images:[file], schema:'avis'});
  if (my !== run) return null;
  return d;
}

function profileFromDoc(d, base){
  const p = {...base};
  if (typeof d.salaires_annuels === 'number' && d.salaires_annuels > 0) p.revenu_net_mensuel = Math.round(d.salaires_annuels / 12);
  else if (typeof d.revenu_fiscal_reference === 'number') p.revenu_net_mensuel = Math.round(d.revenu_fiscal_reference / 12 / .9);
  if (typeof d.revenu_fiscal_reference === 'number') p.rfr = d.revenu_fiscal_reference;
  if (typeof d.enfants_a_charge === 'number') p.enfants_a_charge = d.enfants_a_charge;
  if (d.vie === 'seul' || d.vie === 'couple') p.vie = d.vie;
  return p;
}

/** L'agent pose une question quand une information manque (le loyer n'est pas sur l'avis d'imposition). */
function askMissing(p){
  return new Promise(resolve => {
    const box = $('dAsk'); box.hidden = false; box.replaceChildren();
    const rent = document.createElement('input'); rent.type = 'number'; rent.inputMode = 'numeric'; rent.min = '0'; rent.id = 'dRent'; rent.value = p.loyer_mensuel ?? '';
    const act = document.createElement('select'); act.id = 'dAct';
    [['salarié','o_sal'],['indépendant','o_ind'],['sans emploi','o_chom'],['étudiant','o_etu'],['retraité','o_ret']].forEach(([v, k]) => { const o = mk('option', '', t(k)); o.value = v; act.append(o); }); act.value = p.activite || 'salarié';
    const age = document.createElement('input'); age.type = 'number'; age.inputMode = 'numeric'; age.min = '16'; age.max = '110'; age.id = 'dAge'; age.value = p.age || '';
    const l1 = mk('label'); l1.append(mk('span', '', t('ask_rent')), rent);
    const g = mk('div', 'grid2'); const l2 = mk('label'); l2.append(mk('span', '', t('ask_act')), act); const l3 = mk('label'); l3.append(mk('span', '', t('ask_age')), age); g.append(l2, l3);
    const go = mk('button', '', t('ask_go'));
    box.append(mk('span', 'tag', '?'), mk('h2', '', t('ask_h')), l1, g, go);
    box.scrollIntoView({behavior: calm ? 'auto' : 'smooth', block:'center'}); rent.focus({preventScroll:true});
    go.onclick = () => { box.hidden = true; resolve({...p, loyer_mensuel: Math.max(0, +rent.value || 0), activite: act.value, age: +age.value || p.age}); };
  });
}

async function explainAides(list, p, my){
  if (!live()) return list;
  try {
    const r = await C.sample().json(
      "Tu es un conseiller en accès aux droits en France. Un moteur de règles a déjà calculé ces aides pour la personne : " +
      JSON.stringify(list.map(a => ({aide:a.aide, organisme:a.organisme, eligibilite:a.eligibilite, montant_mensuel:a.montant_mensuel, regle:a.regle}))) +
      ". Situation : " + JSON.stringify(p) + ". Pour chaque aide, dans le même ordre, recopie exactement aide, organisme, eligibilite et montant_mensuel, " +
      "écris « pourquoi » (une phrase très simple, sans jargon) et « pieces » (2 à 3 pièces justificatives). N'ajoute aucune aide. N'affirme jamais un droit. " + AI_LANG(),
      {schema:'aides'});
    if (my !== run || !Array.isArray(r)) return list;
    // Les montants et l'éligibilité restent ceux des règles : l'IA n'écrit que les explications.
    return list.map((a, i) => ({...a, pourquoi: (r[i] && r[i].pourquoi) || a.pourquoi, pieces: (r[i] && Array.isArray(r[i].pieces) && r[i].pieces.length) ? r[i].pieces : a.pieces}));
  } catch { return list; }
}

function localForm(a, p){
  const s = C.session() || {}, F = L() === 'en'
    ? {name:"Full name", sit:"Household", kids:"Dependent children", inc:"Monthly earned income", rfr:"Reference taxable income", rent:"Monthly rent", job:"Work situation", addr:"Home address", bank:"Bank details (IBAN)", amt:"Estimated amount"}
    : {name:"Nom et prénom", sit:"Situation familiale", kids:"Enfants à charge", inc:"Revenus d'activité par mois", rfr:"Revenu fiscal de référence", rent:"Loyer par mois", job:"Situation professionnelle", addr:"Adresse du logement", bank:"Coordonnées bancaires (IBAN)", amt:"Montant estimé"};
  const fromDoc = docData ? 'document' : 'vous';
  const champs = [
    {libelle:F.name, valeur: s.method === 'demo' ? '' : (s.name || ''), source: s.method === 'demo' || !s.name ? 'a_completer' : 'vous'},
    {libelle:F.sit, valeur: t('sit')[p.vie] || p.vie, source: fromDoc},
    {libelle:F.kids, valeur: String(p.enfants_a_charge), source: fromDoc},
    {libelle:F.inc, valeur: eur(p.revenu_net_mensuel), source: fromDoc}
  ];
  if (p.rfr) champs.push({libelle:F.rfr, valeur: eur(p.rfr), source: fromDoc});
  if (a.id === 'apl' || a.id === 'pa' || a.id === 'rsa') champs.push({libelle:F.rent, valeur: eur(p.loyer_mensuel), source:'vous'});
  champs.push({libelle:F.job, valeur: t({'salarié':'o_sal','indépendant':'o_ind','sans emploi':'o_chom','étudiant':'o_etu','retraité':'o_ret'}[p.activite] || 'o_sal'), source:'vous'});
  if (a.montant_mensuel) champs.push({libelle:F.amt, valeur: t('about') + ' ' + eur(a.montant_mensuel) + ' ' + t('permonth'), source:'calcul'});
  champs.push({libelle:F.addr, valeur:'', source:'a_completer'}, {libelle:F.bank, valeur:'', source:'a_completer'});
  return {champs, pieces_manquantes: a.pieces.filter(x => !/avis d'imposition|tax notice/i.test(x))};
}

async function fillForm(a, p, my){
  const base = localForm(a, p);
  if (!live()) return base;
  try {
    const r = await C.sample().json(
      "Tu remplis le formulaire de demande « " + a.aide + " » (" + a.organisme + ") pour un citoyen français. Données connues : " + JSON.stringify(p) +
      (docData ? ". Données lues sur son avis d'imposition : " + JSON.stringify(docData) : "") + ". Nom de la personne : " + JSON.stringify((C.session() || {}).name || null) +
      ". Champs à produire, dans cet ordre : " + JSON.stringify(base.champs.map(c => c.libelle)) +
      ". Pour chaque champ : libelle (recopié), valeur (courte, en clair, chaîne vide si inconnue), source (« document » si lu sur l'avis, « vous » si donné par la personne, « calcul » si calculé, « a_completer » si inconnu). " +
      "N'invente aucune donnée personnelle (adresse, IBAN, nom inconnu : a_completer). Puis pieces_manquantes : les pièces justificatives à fournir pour cette aide, hors avis d'imposition déjà fourni. " + AI_LANG(),
      {schema:'formulaire'});
    if (my !== run || !r || !Array.isArray(r.champs) || !r.champs.length) return base;
    return {champs: r.champs.slice(0, 14), pieces_manquantes: Array.isArray(r.pieces_manquantes) ? r.pieces_manquantes.slice(0, 6) : base.pieces_manquantes};
  } catch { return base; }
}

function renderResults(list, onPick, picked){
  const box = $('dRes'); box.hidden = false; box.replaceChildren();
  const head = mk('div', 'row'); head.style.justifyContent = 'space-between';
  head.append(mk('h2', '', t('res_h')), mk('span', 'tag', t('about') + ' ' + eur(total(list)) + ' ' + t('permonth')));
  box.append(head);
  list.forEach(a => {
    const row = mk('div', 'aid-row' + (picked && a.id === picked.id ? ' on' : ''));
    const top = mk('div', 'row'); top.style.justifyContent = 'space-between';
    top.append(mk('b', '', a.aide), mk('span', 'tag ' + (a.eligibilite === 'probable' ? 'ok' : 'warn'), t('elig')[a.eligibilite]));
    top.append(mk('span', 'src ' + (a.src === 'of' ? 'src-document' : ''), a.src === 'of' ? t('src_of') : t('src_rules')));
    row.append(top, mk('div', 'amt', a.montant_mensuel ? t('about') + ' ' + eur(a.montant_mensuel) + ' ' + t('permonth') : t('health')), mk('p', 'small muted', a.pourquoi));
    if (onPick && picked && a.id !== picked.id){ const b = mk('button', 'ghost sm', t('other_aid') + ' ' + a.aide); b.onclick = () => onPick(a); row.append(b); }
    box.append(row);
  });
  box.append(mk('p', 'small muted', t('res_note')));
}

function renderForm(a, form, onValidate){
  const box = $('dForm'); box.hidden = false; box.replaceChildren();
  box.append(mk('span', 'tag', a.aide), mk('h2', '', t('form_h')), mk('p', 'small muted', t('form_p')));
  const inputs = form.champs.map((c, i) => {
    const l = mk('label', 'field' + (c.source === 'a_completer' ? ' todo' : '')), top = mk('span', 'row');
    top.style.justifyContent = 'space-between'; top.append(mk('span', '', String(c.libelle)), mk('span', 'src src-' + c.source, t('src')[c.source] || c.source));
    const inp = document.createElement('input'); inp.type = 'text'; inp.value = String(c.valeur ?? ''); inp.id = 'dF' + i;
    l.append(top, inp); box.append(l); return inp;
  });
  if (form.pieces_manquantes.length){
    box.append(mk('b', '', t('lg_missing')));
    const ul = mk('ul', 'list'); form.pieces_manquantes.forEach(p => ul.append(mk('li', '', String(p)))); box.append(ul);
  }
  const ck = mk('label', 'opt'), cb = document.createElement('input'); cb.type = 'checkbox'; cb.id = 'dCheck'; ck.append(cb, mk('span', '', t('form_check')));
  const msg = mk('p', 'small', ''); msg.setAttribute('aria-live', 'polite');
  const ok = mk('button', '', t('form_ok'));
  ok.onclick = () => {
    if (!cb.checked){ msg.textContent = t('form_need'); cb.focus(); return; }
    const left = inputs.filter(i => !i.value.trim()).length;
    onValidate(left, form);
  };
  box.append(ck, ok, msg);
}

async function runAgent(opts = {}){
  const my = ++run;
  ['dRes','dForm','dDone','dAsk'].forEach(id => { $(id).hidden = true; });
  $('dStart').hidden = true; $('dRestart').hidden = false;
  modeTag($('dMode'));
  const S = stepper($('dSteps'), t('st'));
  let p = opts.profil || baseProfile();
  try {
    /* Étape 1 : lire le document */
    S.start(0);
    if (opts.file){
      const thumb = opts.preview ? (() => { const im = document.createElement('img'); im.src = opts.preview; im.alt = ''; im.className = 'doc-thumb'; return im; })() : null;
      await S.log(0, t('lg_recv'), 'document.recevoir()', thumb);
      docData = await readDocument(opts.file, S, my); if (my !== run) return;
      if (!docData || docData.lisible === false){ await S.log(0, t('lg_unread')); S.done(0, 'fail'); return; }
      const d = docData, sit = t('sit');
      const lines = [[t('lg_type'), d.type], [t('lg_year'), d.annee_revenus], [t('lg_sal'), typeof d.salaires_annuels === 'number' ? eur(d.salaires_annuels) : null], [t('lg_rfr'), typeof d.revenu_fiscal_reference === 'number' ? eur(d.revenu_fiscal_reference) : null], [t('lg_parts'), d.nombre_parts], [t('lg_kids'), d.enfants_a_charge], [t('lg_sit'), sit[d.vie] || d.vie]];
      for (const [k, v] of lines) if (v != null && v !== '') await S.log(0, k + sep() + v, 'extraire');
      p = profileFromDoc(d, p);
      await S.log(0, t('lg_month') + sep() + eur(p.revenu_net_mensuel), 'calcul');
      S.done(0);
      p = await askMissing(p); if (my !== run) return;
    } else {
      await S.log(0, t('st_known'), 'profil.lire()'); S.done(0);
    }
    prof = p; C.jset(PROFILE_KEY, p);

    /* Étape 2 : calculer les aides (règles) puis les expliquer (IA) */
    S.start(1);
    await S.log(1, t('lg_of'), 'openfisca.calculate()');
    const of = await officialCalc(p); if (my !== run) return;
    let raw = rules(p);
    if (of && of.length){ raw = mergeOfficial(raw, of); await S.log(1, t('lg_of_ok'), 'openfisca.ok'); }
    else await S.log(1, t('lg_of_ko'), 'regles.charger()').then(li => li.classList.add('dim'));
    const keep = new Set(raw.map(r => r.id));
    for (const id of ALL_RULES){
      const r = raw.find(x => x.id === id), name = AIDS[id][L()][0];
      const tool = r && r.src === 'of' ? 'openfisca.' + r.regle.split(':')[1] + '()' : 'regles.' + id + '()';
      await S.log(1, name + sep() + (r ? t('elig')[r.eligibilite] + (r.montant_mensuel ? ', ' + t('about') + ' ' + eur(r.montant_mensuel) + ' ' + t('permonth') : '') : t('lg_excl')), tool).then(li => { if (!keep.has(id)) li.classList.add('dim'); });
    }
    found = raw.map(named);
    if (live()){ await S.log(1, t('lg_ai_explain'), 'claude.expliquer()'); found = await explainAides(found, p, my); if (my !== run) return; }
    await S.log(1, t('lg_total') + sep() + t('about') + ' ' + eur(total(found)) + ' ' + t('permonth'), 'total');
    S.done(1);
    saveWatch(p, found);
    if (!found.length){ renderResults([], null, null); return; }

    /* Étape 3 : remplir le dossier de l'aide la plus utile (ou celle demandée) */
    const pick = async a => {
      const me = ++run; // choisir une autre aide relance seulement l'étape 3
      renderResults(found, pick, a);
      const S3 = S; S3.el(2).querySelector('.st-log').replaceChildren(); S3.el(3).querySelector('.st-log').replaceChildren(); S3.el(3).dataset.state = 'wait';
      S3.start(2);
      await S3.log(2, t('lg_pick') + sep() + a.aide, 'dossier.choisir()');
      await S3.log(2, t('lg_fill'), live() ? 'claude.remplir_formulaire()' : 'formulaire.remplir()');
      const form = await fillForm(a, prof, me); if (me !== run) return;
      const todo = form.champs.filter(c => c.source === 'a_completer').length;
      await S3.log(2, (form.champs.length - todo) + ' ' + t('lg_fields') + ' · ' + todo + ' ' + t('lg_todo'), 'formulaire.verifier()');
      if (form.pieces_manquantes.length) await S3.log(2, t('lg_missing') + sep() + form.pieces_manquantes.join(', '), 'pieces.lister()');
      S3.done(2);
      /* Étape 4 : le citoyen valide */
      S3.start(3); S3.el(3).dataset.state = 'ask';
      await S3.log(3, t('lg_wait_you'), 'attendre(citoyen)');
      renderForm(a, form, (left, f) => {
        S3.done(3);
        const piecesDone = f.pieces_manquantes.map(n => ({n, ok:false}));
        piecesDone.unshift({n: L() === 'en' ? 'Tax notice' : "Avis d'imposition", ok: Boolean(docData)});
        addFollowed({name: a.aide, org: a.organisme, at: Date.now(), step: 1, days: 0, pieces: piecesDone, log: [], aideId: a.id});
        $('dForm').hidden = true;
        const done = $('dDone'); done.hidden = false; done.replaceChildren();
        const link = mk('a', 'btn', t('done_btn')); link.href = '#compte';
        done.append(mk('span', 'tag ok', t('done_h')), mk('h2', '', a.aide), mk('p', 'small muted', t('done_p')));
        if (left) done.append(mk('p', 'small', t('form_left')(left)));
        done.append(link);
        done.scrollIntoView({behavior: calm ? 'auto' : 'smooth', block:'center'});
      });
      $('dForm').scrollIntoView({behavior: calm ? 'auto' : 'smooth', block:'start'});
    };
    const first = (opts.focus && found.find(a => a.id === opts.focus)) || found.find(a => a.montant_mensuel) || found[0];
    await pick(first);
  } catch (err) {
    if (my !== run) return;
    const cur = [...$('dSteps').children].findIndex(li => li.dataset.state === 'run');
    if (cur >= 0){ await S.log(cur, errText(err)); S.done(cur, 'fail'); }
  }
}

function resetAgent(){
  run++; docData = null;
  $('dSteps').hidden = true; $('dSteps').replaceChildren();
  ['dRes','dForm','dDone','dAsk','dRestart'].forEach(id => { $(id).hidden = true; });
  $('dStart').hidden = false; modeTag($('dMode'));
}

/* =========================================================================================
   2. VEILLE AUTOMATIQUE
   ========================================================================================= */
const WATCH = 'veille', ALERTS = 'alertes';
function saveWatch(p, list){ const w = C.jget(WATCH) || {on:true}; C.jset(WATCH, {...w, profil:p, aides:list.map(a => ({id:a.id, m:a.montant_mensuel || 0}))}); }
const alerts = () => C.jget(ALERTS) || [];

async function lifeEvent(kind){
  const w = C.jget(WATCH) || {on:true};
  if (w.on === false){ $('vgMsg').textContent = t('vg_off'); return; }
  const before = w.profil || baseProfile(), p = {...before};
  if (kind === 'naissance') p.enfants_a_charge = (p.enfants_a_charge | 0) + 1;
  if (kind === 'demenagement') p.loyer_mensuel = (+p.loyer_mensuel || 0) + 250;
  if (kind === 'baisse') { p.revenu_net_mensuel = Math.round(p.revenu_net_mensuel * .6); p.rfr = Math.round((p.rfr || p.revenu_net_mensuel * 12 * .9) * .6); }
  if (kind === 'emploi') { p.activite = 'sans emploi'; p.revenu_net_mensuel = Math.round(p.revenu_net_mensuel * .57); p.rfr = Math.round((p.rfr || 0) * .7) || null; }
  if (kind === 'retraite') { p.activite = 'retraité'; p.age = Math.max(65, +p.age || 65); p.revenu_net_mensuel = Math.round(p.revenu_net_mensuel * .55); }
  const old = new Map((w.aides || rules(before).map(a => ({id:a.id, m:a.montant_mensuel || 0}))).map(a => [a.id, a.m]));
  const now = rules(p), news = [];
  const name = id => AIDS[id][L()][0];
  for (const a of now){
    if (!old.has(a.id)) news.push({kind:'new', id:a.id, text: t('vg_new')(name(a.id), a.montant_mensuel ? eur(a.montant_mensuel) : '')});
    else if ((a.montant_mensuel || 0) - old.get(a.id) >= 20) news.push({kind:'up', id:a.id, text: t('vg_up')(name(a.id), eur(a.montant_mensuel))});
  }
  for (const [id] of old) if (!now.find(a => a.id === id)) news.push({kind:'down', id, text: t('vg_down')(name(id))});
  C.jset(WATCH, {...w, profil:p, aides: now.map(a => ({id:a.id, m:a.montant_mensuel || 0}))}); C.jset(PROFILE_KEY, p);
  const evName = t('ev')[kind];
  if (!news.length) news.push({kind:'same', text: t('vg_same')});
  const list = [...news.map(n => ({...n, ev: evName, at: Date.now()})), ...alerts()].slice(0, 12);
  C.jset(ALERTS, list); renderWatch(); renderHomeBits();
  const first = news.find(n => n.kind === 'new' || n.kind === 'up');
  // L'IA ajoute une phrase d'explication à la première bonne nouvelle.
  if (first && live()){
    try {
      const { text } = await C.sample()("Changement de situation : " + evName + ". Nouveau profil : " + JSON.stringify(p) + ". Explique en 35 mots maximum, très simplement, sans Markdown, pourquoi la personne pourrait avoir droit à « " + name(first.id) + " », et dis que c'est une estimation. " + AI_LANG(), {modelTier:'quick'});
      const l = alerts(); if (l[0]) { l[0].why = text; C.jset(ALERTS, l); renderWatch(); }
    } catch {}
  }
}

function alertRow(a, withBtn){
  const row = mk('div', 'alert alert-' + a.kind);
  const top = mk('div', 'small muted', (a.ev ? a.ev + ' · ' : '') + C.fmtDate(a.at));
  row.append(top, mk('p', '', a.text));
  if (a.why) row.append(mk('p', 'small muted', a.why));
  if (withBtn && (a.kind === 'new' || a.kind === 'up')){
    const b = mk('button', 'sm', t('vg_prep'));
    b.onclick = () => { location.hash = '#droits'; setTimeout(() => runAgent({profil: (C.jget(WATCH) || {}).profil, focus: a.id}), 50); };
    row.append(b);
  }
  return row;
}

function renderWatch(){
  const box = $('dVeille'); if (!box) return;
  const w = C.jget(WATCH) || {on:true};
  box.replaceChildren();
  const head = mk('div', 'setting'), txt = mk('div'); txt.append(mk('b', '', t('vg_h')), mk('p', 'small muted', t('vg_p')));
  const sw = mk('label', 'switch'), inp = document.createElement('input'); inp.type = 'checkbox'; inp.checked = w.on !== false; inp.setAttribute('aria-label', t('vg_on'));
  inp.onchange = () => { C.jset(WATCH, {...(C.jget(WATCH) || {}), on: inp.checked}); };
  sw.append(inp, mk('span')); head.append(txt, sw); box.append(head);
  box.append(mk('b', 'small', t('vg_events')));
  const chips = mk('div', 'chips'); Object.entries(t('ev')).forEach(([k, label]) => { const b = mk('button', 'ghost sm', label); b.onclick = () => lifeEvent(k); chips.append(b); });
  box.append(chips);
  const msg = mk('p', 'small muted'); msg.id = 'vgMsg'; msg.setAttribute('aria-live', 'polite'); box.append(msg);
  const l = alerts();
  const list = mk('div', 'alerts'); list.setAttribute('aria-live', 'polite');
  if (l.length) l.slice(0, 5).forEach(a => list.append(alertRow(a, true))); else list.append(mk('p', 'small muted', t('vg_none')));
  box.append(list);
  const reset = mk('button', 'link small', t('vg_reset'));
  reset.onclick = () => { [WATCH, ALERTS, PROFILE_KEY].forEach(k => { try { localStorage.removeItem(k); } catch {} }); renderWatch(); renderHomeBits(); };
  box.append(reset);
}

/* =========================================================================================
   3. SUIVI DE DOSSIER AUTOMATISÉ
   ========================================================================================= */
const followed = () => (C.jget('dossiers') || []).map(d => ({pieces:[], log:[], days:0, org:'', ...d}));
function addFollowed(d){ const l = followed(); l.unshift(d); C.jset('dossiers', l.slice(0, 10)); renderHomeBits(); }
function saveFollowed(l){ C.jset('dossiers', l); renderHomeBits(); }

async function advance(i){
  const l = followed(), d = l[i]; if (!d) return;
  d.days += 15;
  const missing = d.pieces.filter(p => !p.ok).map(p => p.n);
  if (d.step < 2){ d.step = 2; d.lastMove = d.days; d.log.unshift({at: Date.now(), text: t('dos_sent'), d: d.days}); }
  else if (missing.length && d.step < 4){
    d.action = true;
    const draft = t('dos_tpl')(d.name, d.org || 'CAF', missing.join(', '));
    d.log.unshift({at: Date.now(), text: t('dos_stuck')(d.days - (d.lastMove || 0), missing.join(', ')), d: d.days, draft});
    saveFollowed(l); renderDossiers();
    if (live()){
      try {
        const { text } = await C.sample()("Rédige un court message poli (70 mots maximum, sans Markdown, sans objet) qu'un citoyen enverra lui-même à « " + (d.org || 'la CAF') + " » pour relancer sa demande de « " + d.name + " » déposée il y a " + d.days + " jours, en joignant ces pièces : " + missing.join(', ') + ". N'invente ni numéro de dossier ni nom. " + AI_LANG(), {modelTier:'quick'});
        const l2 = followed(); if (l2[i] && l2[i].log[0]) { l2[i].log[0].draft = text; saveFollowed(l2); renderDossiers(); }
      } catch {}
    }
    return;
  }
  else if (d.step === 2){ d.step = 3; d.lastMove = d.days; d.log.unshift({at: Date.now(), text: t('dos_review'), d: d.days}); }
  else if (d.step === 3){ d.step = 4; d.action = false; d.lastMove = d.days; d.log.unshift({at: Date.now(), text: t('dos_decision'), d: d.days}); }
  saveFollowed(l); renderDossiers();
}

function renderDossiers(){
  const box = $('dosList'); if (!box) return;
  const l = followed();
  if (!l.length){ box.replaceChildren(mk('div', 'card empty', t('ac_dos_empty'))); return; }
  box.replaceChildren(...l.map((d, i) => {
    const c = mk('div', 'card'), top = mk('div', 'row'); top.style.justifyContent = 'space-between';
    top.append(mk('h2', '', d.name)); if (d.action) top.append(mk('span', 'tag warn', t('dos_action')));
    c.append(top, mk('p', 'small muted', (d.org ? t('dos_org') + ' ' + d.org + ' · ' : '') + C.fmtDate(d.at)));
    const ol = mk('ol', 'timeline'); t('steps').forEach((st, k) => ol.append(mk('li', k <= d.step ? 'done' : '', st))); c.append(ol);
    if (d.pieces.length){
      c.append(mk('b', 'small', t('dos_pieces')));
      const ps = mk('div', 'opts');
      d.pieces.forEach((p, k) => {
        const lab = mk('label', 'opt'), cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = p.ok;
        cb.onchange = () => { const l2 = followed(); l2[i].pieces[k].ok = cb.checked; if (l2[i].pieces.every(x => x.ok)) l2[i].action = false; saveFollowed(l2); renderDossiers(); };
        lab.append(cb, mk('span', '', p.n)); ps.append(lab);
      });
      c.append(ps);
    }
    const det = document.createElement('details'); det.open = Boolean(d.action);
    det.append(mk('summary', '', t('dos_follow')));
    if (!d.log.length) det.append(mk('p', 'small muted', t('dos_none')));
    d.log.forEach((e, k) => {
      const row = mk('div', 'alert' + (e.draft ? ' alert-up' : ''));
      row.append(mk('div', 'small muted', (L() === 'fr' ? 'J+' : 'Day ') + e.d), mk('p', '', e.text));
      if (e.draft){
        row.append(mk('b', 'small', t('dos_draft')), mk('div', 'out small', e.draft));
        if (!e.sent){ const b = mk('button', 'sm ghost', t('dos_send')); b.onclick = () => { const l2 = followed(); l2[i].log[k].sent = true; saveFollowed(l2); renderDossiers(); }; row.append(b); }
        else row.append(mk('span', 'tag ok', t('dos_sent_r')));
      }
      det.append(row);
    });
    c.append(det);
    if (d.step < 4){ const b = mk('button', 'ghost sm', t('dos_sim')); b.onclick = () => advance(i); c.append(b); }
    c.append(mk('p', 'small muted', t('ac_sent_note')));
    return c;
  }));
}

/* ---------------- accueil : alertes et dossiers ---------------- */
function renderHomeBits(){
  const box = $('homeAgent'); if (!box || !C) return;
  const l = alerts().filter(a => a.kind !== 'same'), ds = followed(), act = ds.filter(d => d.action).length;
  box.hidden = !l.length && !ds.length; box.replaceChildren();
  box.append(mk('h2', '', t('al_h')));
  l.slice(0, 2).forEach(a => box.append(alertRow(a, true)));
  if (ds.length){ const a = mk('a', 'btn ghost', t('home_dos')(ds.length, act)); a.href = '#compte'; box.append(a); }
  // montant de la carte « aides » de l'accueil : celui de l'agent s'il a tourné
  const w = C.jget(WATCH);
  if (w && w.aides) $('homeAides').textContent = t('about') + ' ' + eur(w.aides.reduce((s, a) => s + (a.m || 0), 0));
}

/* =========================================================================================
   4. AGENT TANIT : relevé expliqué et résumé avant le vote
   ========================================================================================= */
const EX_VAR = [.011, .014, -.008, .002];  // variations d'exemple du trimestre, par compartiment (fictives)
function statement(){
  const cap = C.cap(), q = (cap.c || 0) / 4, paid = q * 12, shares = [.35, .30, .20, .15];
  const value = paid * 1.062, per = shares.map((s, i) => ({name: C.t('comp')[i], v: value * s, d: EX_VAR[i]}));
  const dq = per.reduce((s, x) => s + x.v * x.d, 0);
  return {q, paid, value, per, dq};
}
function renderStatement(){
  const box = $('tnStmt'); if (!box) return;
  const s = statement();
  box.replaceChildren(mk('span', 'small muted', t('tn_stmt')));
  const g = mk('div', 'legend stmt');
  [[t('tn_paid'), eur(s.q)], [t('tn_total'), eur(s.paid)], [t('tn_value'), eur(s.value)], [t('tn_var'), (s.dq >= 0 ? '+' : '') + eur(s.dq)]].forEach(([k, v]) => g.append(mk('span'), mk('span', '', k), mk('b', '', v)));
  s.per.forEach((x, i) => g.append(mk('span', 'sw c' + (i + 1)), mk('span', 'small', x.name), mk('b', 'small', (x.d >= 0 ? '+' : '') + (x.d * 100).toFixed(1).replace('.', L() === 'fr' ? ',' : '.') + ' %')));
  box.append(g);
}
const TN_DEMO = {
 fr: s => "Ce trimestre, vous avez versé " + eur(s.q) + ". Ce n'est pas un impôt en plus : c'est une partie de ce que vous payez déjà, qui devient des parts à votre nom.\n\nDepuis le début, vous avez versé " + eur(s.paid) + ". Vos parts valent aujourd'hui " + eur(s.value) + ".\n\nCe trimestre, les infrastructures et les entreprises stratégiques ont un peu monté. L'innovation a un peu baissé : c'est normal, ces placements sont faits pour le long terme.\n\nÀ retenir : votre capital peut baisser certaines années. Il est bloqué jusqu'à la retraite, sauf cas prévus. Ces chiffres sont des exemples.",
 en: s => "This quarter you paid in " + eur(s.q) + ". It is not an extra tax: it is part of what you already pay, turned into units in your name.\n\nSince the start you have paid in " + eur(s.paid) + ". Your units are now worth " + eur(s.value) + ".\n\nThis quarter, infrastructure and strategic companies went up a little. Innovation went down a little: that is normal, these investments are made for the long term.\n\nKey point: your capital can fall in some years. It stays locked until retirement, except in set cases. These figures are examples."
};
async function explainStatement(){
  const btn = $('tnBtn'), out = $('tnOut'), S = stepper($('tnSteps'), t('tn_steps')), s = statement();
  btn.disabled = true; out.textContent = '';
  try {
    S.start(0); await S.log(0, t('tn_paid') + sep() + eur(s.q) + ' · ' + t('tn_value') + sep() + eur(s.value), 'releve.lire()'); S.done(0);
    S.start(1); for (const x of s.per) await S.log(1, x.name + sep() + (x.d >= 0 ? '+' : '') + (x.d * 100).toFixed(1) + ' %', 'comparer()'); S.done(1);
    S.start(2);
    if (live()){
      const { text } = await C.sample()(C.TANIT + "Tu es l'agent Tanit. Explique ce relevé trimestriel d'exemple à un citoyen de tout âge, en 110 mots maximum, phrases courtes, mots très simples, sans Markdown, en 3 petits paragraphes et une phrase « À retenir ». Données (fictives) : " +
        JSON.stringify({verse_trimestre: Math.round(s.q), total_verse: Math.round(s.paid), valeur_parts: Math.round(s.value), variation_trimestre: Math.round(s.dq), compartiments: s.per.map(x => ({nom:x.name, variation_pct: +(x.d * 100).toFixed(1)}))}) +
        ". Dis que ce n'est pas un impôt en plus, que le capital peut baisser, et que les chiffres sont des exemples. Ne donne aucun conseil d'investissement. " + AI_LANG(), {modelTier:'quick', onText: ({text}) => { out.textContent = text; }});
      out.textContent = text || TN_DEMO[L()](s);
    } else { await pause(500); out.textContent = TN_DEMO[L()](s); }
    S.done(2);
    if (C.tts()) C.say($('tnSay'), () => out.textContent);
  } catch (err) { out.textContent = errText(err); S.done(2, 'fail'); }
  btn.disabled = false;
}

const VOTE_DEMO = {
 fr: [
  [["Plus de transition écologique","Moins d'émissions, énergie moins chère à long terme, emplois locaux.","Rendements plus lents au début, projets longs à construire."],["Plus d'industrie souveraine","Moins de dépendance aux autres pays, emplois industriels.","Risque de soutenir des entreprises peu rentables."]],
  [["Énergie","Des factures plus stables pour tous.","Gros projets, coûts qui peuvent déraper."],["Transports","Des trajets plus faciles, surtout hors des grandes villes.","Rendement faible et lent."],["Technologies critiques","Indépendance sur les puces, le cloud, l'IA.","Secteur très risqué, concurrence mondiale forte."],["Batteries et hydrogène","Une place dans les industries de demain.","Technologies encore incertaines."],["Défense","Plus de sécurité et d'autonomie.","Débat éthique, rendement incertain."]],
  [["Prudent","Moins de pertes possibles les mauvaises années.","Votre capital grandit moins vite."],["Équilibré","Un compromis entre gains et pertes.","Des baisses possibles certaines années."],["Dynamique","Plus de gains possibles sur 30 ans.","Des baisses plus fortes possibles, surtout près de la retraite."]]
 ],
 en: [
  [["More green transition","Fewer emissions, cheaper energy in the long run, local jobs.","Slower returns at first, long projects to build."],["More sovereign industry","Less dependence on other countries, industrial jobs.","Risk of backing companies that do not pay off."]],
  [["Energy","More stable bills for everyone.","Large projects whose costs can overrun."],["Transport","Easier journeys, especially outside big cities.","Low and slow returns."],["Critical technologies","Independence in chips, cloud and AI.","Very risky sector, strong global competition."],["Batteries and hydrogen","A place in tomorrow's industries.","Technologies still uncertain."],["Defence","More security and autonomy.","Ethical debate, uncertain returns."]],
  [["Cautious","Smaller possible losses in bad years.","Your capital grows more slowly."],["Balanced","A compromise between gains and losses.","Possible falls in some years."],["Dynamic","Higher possible gains over 30 years.","Bigger possible falls, especially close to retirement."]]
 ]
};
async function summariseVote(){
  const btn = $('vtBtn'), out = $('vtOut'); btn.disabled = true; out.replaceChildren(mk('p', 'small muted', C.t('wait')));
  const qs = [t('v1_q'), t('v2_q'), t('v3_q')], opts = [t('v1_opts'), t('v2'), t('v3')];
  let data = null;
  try {
    if (live()){
      const r = await C.sample().json(C.TANIT + "Tu es l'agent Tanit. Avant un vote citoyen, résume de façon strictement neutre chaque option, sans jamais recommander de choix. Votes : " +
        JSON.stringify(qs.map((q, i) => ({question:q, options:opts[i]}))) + ". Pour chaque vote, dans l'ordre, et pour chaque option dans l'ordre : option (recopiée), gain (une phrase très simple, 15 mots maximum), risque (une phrase très simple, 15 mots maximum). Aucun chiffre que tu ne peux pas justifier. " + AI_LANG(), {schema:'vote'});
      if (Array.isArray(r) && r.length) data = r.map(v => (v.options || []).map(o => [o.option, o.gain, o.risque]));
    }
  } catch (err) { out.replaceChildren(mk('p', 'small', errText(err))); }
  if (!data) data = VOTE_DEMO[L()];
  out.replaceChildren(...data.map((vote, i) => {
    const c = mk('div', 'vote-sum'); c.append(mk('b', '', qs[i] || ''));
    vote.forEach(([o, g, r]) => { const d = mk('div', 'pc'); d.append(mk('b', 'small', String(o)), mk('p', 'small plus', t('vt_gain') + sep() + String(g)), mk('p', 'small minus', t('vt_risk') + sep() + String(r))); c.append(d); });
    return c;
  }));
  btn.disabled = false;
}

/* =========================================================================================
   5. AGENT DÉCIDEURS : scénario → critères Eurostat → risques → note
   ========================================================================================= */
const CRIT = {
 k1:{fr:"Pas de garantie publique : sinon le risque reste à l'État (SEC 2010, 20.13 et suivants).", en:"No public guarantee: otherwise the risk stays with the State (ESA 2010, 20.13 ff.)."},
 k2:{fr:"Propriété des citoyens : les parts doivent être des actifs des ménages, pas de l'État.", en:"Citizen ownership: units must be household assets, not State assets."},
 k3:{fr:"Bilan séparé : sinon le fonds est consolidé avec les comptes publics.", en:"Separate balance sheet: otherwise the fund is consolidated with public accounts."},
 k4:{fr:"Contrôle : un État majoritaire fait classer le fonds dans les administrations publiques (S.13).", en:"Control: a majority State makes the fund part of general government (S.13)."}
};
function noteDemo(c, crit, risk){
  const fr = L() === 'fr', ko = crit.filter(x => !x.ok);
  return {
    objet: fr ? "Classement statistique du fonds Tanit (collecte de " + c + " Md€ par an) au regard du SEC 2010" : "Statistical classification of the Tanit fund (" + c + " bn€ collected a year) under ESA 2010",
    synthese: ko.length
      ? (fr ? "Avec " + ko.length + " condition(s) non respectée(s), le fonds risque d'être classé dans les administrations publiques. Sa collecte et ses engagements pèseraient alors sur le déficit et la dette au sens de Maastricht." : "With " + ko.length + " condition(s) not met, the fund risks being classified in general government. Its collection and liabilities would then count towards the Maastricht deficit and debt.")
      : (fr ? "Les quatre conditions du mémo sont réunies. Le classement hors administrations publiques est plausible, mais l'origine fiscale de la contribution reste le point le plus discuté." : "All four memo conditions are met. Classification outside general government is plausible, but the tax origin of the contribution remains the most debated point."),
    risque: risk,
    risques: fr ? ["La contribution vient de prélèvements obligatoires : Eurostat peut y voir une recette publique.", "La gouvernance doit prouver que l'État ne contrôle pas la politique d'investissement.", ...ko.map(x => "Condition non respectée : " + x.label)] : ["The contribution comes from compulsory levies: Eurostat may treat it as public revenue.", "Governance must show that the State does not control investment policy.", ...ko.map(x => "Condition not met: " + x.label)],
    questions: fr ? ["Une contribution affectée à des comptes individuels est-elle une recette publique ?", "Quels droits de nomination l'État peut-il garder sans exercer de contrôle ?", "Un précédent (fonds de pension, épargne salariale) est-il transposable ?"] : ["Is a contribution assigned to individual accounts public revenue?", "What appointment rights can the State keep without exercising control?", "Is there a transferable precedent (pension funds, employee savings)?"],
    recommandation: fr ? (ko.length ? "Rétablir les conditions manquantes avant toute saisine. Puis demander un avis préalable à l'INSEE et à Eurostat." : "Demander un avis préalable à l'INSEE et à Eurostat sur la base de ce montage, avant le projet de loi organique.") : (ko.length ? "Restore the missing conditions before any referral. Then ask INSEE and Eurostat for a prior opinion." : "Ask INSEE and Eurostat for a prior opinion on this set-up, before the organic law bill.")
  };
}
let lastNote = null;
async function runPolicy(){
  const btn = $('eBtn'); btn.disabled = true; $('eNote').hidden = true;
  const S = stepper($('eSteps'), t('ed_steps')), c = +$('eC').value;
  modeTag($('eMode'));
  try {
    S.start(0);
    await S.log(0, C.t('et_coll') + ' ' + c + ' ' + C.t('bn'), 'scenario.lire()');
    for (const n of [10, 20, 30]) await S.log(0, C.t('et_in')(n) + sep() + Math.round(C.fv(c, n)) + ' ' + C.t('bn'), 'projection(' + n + ')');
    S.done(0);
    S.start(1);
    const crit = ['k1','k2','k3','k4'].map(k => ({k, label: C.t(k), ok: $(k).checked, why: CRIT[k][L()]}));
    for (const x of crit) await S.log(1, x.label + sep() + (x.ok ? t('ed_crit_ok') : t('ed_crit_ko')), 'eurostat.' + x.k + '()').then(li => li.classList.add(x.ok ? 'ok' : 'ko'));
    const nko = crit.filter(x => !x.ok).length, risk = nko === 0 ? 'moyen' : 'élevé';
    await S.log(1, t('ed_risk')[risk], 'score()');
    S.done(1);
    S.start(2);
    let note = noteDemo(c, crit, risk);
    if (live()){
      await S.log(2, '…', 'claude.analyser()');
      const r = await C.sample().json(C.TANIT + "Tu es un agent d'analyse pour un décideur public français. Scénario : collecte de " + c + " Md€ par an. Critères testés (true = respecté) : " +
        JSON.stringify(crit.map(x => ({critere:x.label, respecte:x.ok}))) + ". Niveau de risque déjà calculé par les règles : " + risk +
        ". Rédige une note préparatoire : objet (une ligne), synthese (3 phrases), risque (recopie « " + risk + " »), risques (3 points fragiles, une phrase chacun : origine fiscale de la contribution, contrôle public, etc.), questions (3 questions à poser à l'INSEE et à Eurostat), recommandation (2 phrases). " +
        "Appuie-toi sur le SEC 2010 et le manuel Eurostat sur le déficit et la dette. Ne conclus jamais que le montage est conforme. " + AI_LANG(), {schema:'note'});
      if (r && r.objet) note = {...note, ...r, risque: risk};
    } else await pause(500);
    for (const r of note.risques) await S.log(2, r, 'risque');
    S.done(2);
    S.start(3); await S.log(3, t('nt_title'), 'note.rediger()'); S.done(3);
    lastNote = {...note, c, crit}; renderNote(lastNote);
  } catch (err) {
    const cur = [...$('eSteps').children].findIndex(li => li.dataset.state === 'run');
    if (cur >= 0){ await S.log(cur, errText(err)); S.done(cur, 'fail'); }
  }
  btn.disabled = false;
}
function noteText(n){
  return [t('nt_title').toUpperCase(), t('nt_to'), C.fmtDate(Date.now()), '',
    t('nt_obj') + sep() + n.objet, '', t('nt_syn'), n.synthese, '', t('ed_risk')[n.risque] || n.risque, '',
    t('nt_crit'), ...n.crit.map(x => '- ' + x.label + sep() + (x.ok ? t('ed_crit_ok') : t('ed_crit_ko')) + '. ' + x.why), '',
    t('nt_risks'), ...n.risques.map(x => '- ' + x), '', t('nt_q'), ...n.questions.map((x, i) => (i + 1) + '. ' + x), '',
    t('nt_reco'), n.recommandation, '', t('nt_warn'), 'Tanit Citoyen · prototype étudiant · Sciences Po AI Hackathon 2026'].join('\n');
}
function renderNote(n){
  const box = $('eNote'); box.hidden = false; box.replaceChildren();
  const head = mk('div', 'row'); head.style.justifyContent = 'space-between';
  head.append(mk('span', 'tag ' + (n.risque === 'élevé' ? 'warn' : ''), t('ed_risk')[n.risque] || n.risque), mk('span', 'small muted', t('nt_to')));
  box.append(head, mk('h2', '', t('nt_title')), mk('p', '', n.objet));
  const sec = (h, el) => { box.append(mk('b', '', h), el); };
  sec(t('nt_syn'), mk('p', 'small', n.synthese));
  const cl = mk('ul', 'crit'); n.crit.forEach(x => { const li = mk('li', x.ok ? 'ok' : 'ko'); li.append(mk('b', 'small', x.label + sep() + (x.ok ? t('ed_crit_ok') : t('ed_crit_ko'))), mk('span', 'small muted', x.why)); cl.append(li); }); sec(t('nt_crit'), cl);
  const rl = mk('ul', 'note-l'); n.risques.forEach(x => rl.append(mk('li', 'small', x))); sec(t('nt_risks'), rl);
  const ql = mk('ol', 'note-l'); n.questions.forEach(x => ql.append(mk('li', 'small', x))); sec(t('nt_q'), ql);
  sec(t('nt_reco'), mk('p', 'small', n.recommandation));
  const dl = mk('button', 'ghost', t('nt_dl'));
  dl.onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([noteText(n)], {type:'text/plain;charset=utf-8'})); a.download = 'note-tanit-eurostat.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); };
  box.append(dl, mk('p', 'small muted', t('nt_warn')));
  box.scrollIntoView({behavior: calm ? 'auto' : 'smooth', block:'start'});
}

/* =========================================================================================
   Branchements
   ========================================================================================= */
export function initAgents(ctx){
  C = ctx;
  $('dSample').onclick = async () => {
    const cv = exampleCanvas();
    runAgent({file: await canvasFile(cv), preview: cv.toDataURL('image/png')});
  };
  $('dDoc').onchange = async e => {
    const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    if (!C.consent().doc){ $('dStartMsg').textContent = t('dr_doc_off'); return; }
    let preview = null; try { preview = URL.createObjectURL(f); } catch {}
    runAgent({file: f, preview});
  };
  $('dRestart').onclick = resetAgent;
  $('tnBtn').onclick = explainStatement;
  $('vtBtn').onclick = summariseVote;
  $('eBtn').onclick = runPolicy;
}
/** Appelé par main.js après chaque changement de langue. */
export function agentsOnLang(){
  if (!C) return;
  renderWatch(); renderHomeBits(); renderStatement(); modeTag($('dMode')); modeTag($('eMode'));
  if (found.length && !$('dRes').hidden){ found = found.map(a => named(a)); renderResults(found, null, null); }
  if (lastNote && !$('eNote').hidden){ lastNote = {...lastNote, crit: lastNote.crit.map(x => ({...x, label: C.t(x.k), why: CRIT[x.k][L()]}))}; renderNote(lastNote); }
}
/** Appelé par main.js à chaque changement d'écran. */
export function agentsOnRoute(v){
  if (!C) return;
  if (v === 'droits'){ modeTag($('dMode')); renderWatch(); }
  if (v === 'accueil') renderHomeBits();
  if (v === 'capital') renderStatement();
  if (v === 'etat') modeTag($('eMode'));
  if (v === 'compte') renderDossiers();
}
/** Le montant change quand le simulateur bouge : le relevé suit. */
export const agentsOnCapital = () => { if (C) renderStatement(); };
