import { createFileRoute } from "@tanstack/react-router";
import { json, rateLimited } from "@/lib/anthropic.server";

// Outil « simulateur officiel » de l'agent Mes droits.
// OpenFisca France est le moteur open source qui code la législation socio-fiscale (utilisé par
// mes-aides / 1jeune1solution / LexImpact). Son API web publique ne demande ni clé ni habilitation.
// On lui envoie la situation (sans nom ni adresse) et il calcule les aides du mois.
// En cas d'échec (réseau, délai, variable inconnue), le navigateur garde nos barèmes simplifiés.
const OPENFISCA = process.env["OPENFISCA_URL"] || "https://api.fr.openfisca.org/latest/calculate";

// id de l'aide dans l'appli → variable OpenFisca (entité famille, période mensuelle)
const VARIABLES: Record<string, string> = {
  pa: "ppa",
  rsa: "rsa",
  apl: "aide_logement",
  af: "af",
  asf: "asf",
  aspa: "aspa",
};

type Profil = {
  revenu_net_mensuel?: number;
  loyer_mensuel?: number;
  age?: number;
  enfants_a_charge?: number;
  vie?: string;
  activite?: string;
};

const ym = (d: Date) => d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0");
function lastMonths(n: number) {
  const now = new Date();
  return Array.from({ length: n + 1 }, (_, i) => ym(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1))));
}
const byMonth = (months: string[], v: unknown) => Object.fromEntries(months.map((m) => [m, v]));

function situation(p: Profil, variable: string) {
  const months = lastMonths(36); // mois en cours + 36 mois passés : couvre les ressources N-2 de l'aide au logement
  const M = months[0];
  if (!M) throw new Error("no month");
  const rev = Math.max(0, Math.round(Number(p.revenu_net_mensuel) || 0));
  const age = Math.min(110, Math.max(16, Math.round(Number(p.age) || 35)));
  const enf = Math.min(8, Math.max(0, Math.round(Number(p.enfants_a_charge) || 0)));
  const couple = p.vie === "couple";
  const year = new Date().getUTCFullYear();
  const revenu =
    p.activite === "sans emploi" ? { chomage_net: byMonth(months, rev) }
    : p.activite === "retraité" ? { retraite_brute: byMonth(months, Math.round(rev / 0.91)) }
    : p.activite === "étudiant" ? {}
    : { salaire_de_base: byMonth(months, Math.round(rev / 0.78)) }; // brut ≈ net / 0,78 : OpenFisca recalcule le net et l'imposable

  const individus: Record<string, object> = {
    demandeur: { date_naissance: { ETERNITY: year - age + "-01-01" }, ...revenu },
  };
  if (couple) individus["conjoint"] = { date_naissance: { ETERNITY: year - age + "-01-01" } };
  const enfants = Array.from({ length: enf }, (_, i) => "enfant" + (i + 1));
  enfants.forEach((e, i) => { individus[e] = { date_naissance: { ETERNITY: year - 6 - 2 * i + "-01-01" } }; });
  const parents = couple ? ["demandeur", "conjoint"] : ["demandeur"];
  const loyer = Math.max(0, Math.round(Number(p.loyer_mensuel) || 0));

  return {
    individus,
    familles: { famille: { parents, enfants, [variable]: { [M]: null } } },
    foyers_fiscaux: { foyer: { declarants: parents, personnes_a_charge: enfants } },
    menages: {
      menage: {
        personne_de_reference: ["demandeur"],
        ...(couple ? { conjoint: ["conjoint"] } : {}),
        enfants,
        ...(loyer > 0
          ? { loyer: byMonth(months, loyer), statut_occupation_logement: byMonth(months, "locataire_vide") }
          : { statut_occupation_logement: byMonth(months, "proprietaire") }),
        depcom: byMonth(months, "69123"), // commune d'exemple (Lyon, zone 2) : l'adresse n'est pas demandée
      },
    },
    _month: M,
  };
}

async function calc(p: Profil, id: string, variable: string) {
  const s = situation(p, variable);
  const month = s._month;
  delete (s as { _month?: string })._month;
  const res = await fetch(OPENFISCA, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(s),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(variable + " " + res.status);
  const out = (await res.json()) as any;
  const v = Number(out?.familles?.famille?.[variable]?.[month]);
  if (!Number.isFinite(v)) throw new Error(variable + " NaN");
  return { id, variable, montant_mensuel: Math.round(v) };
}

export const Route = createFileRoute("/api/openfisca")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (rateLimited(request, "openfisca")) return json({ ok: false, error: "rate_limited" }, 429);
        const body = (await request.json().catch(() => null)) as { profil?: Profil } | null;
        if (!body?.profil || typeof body.profil !== "object") return json({ ok: false, error: "other" }, 400);
        // Une requête par aide : si une variable change de nom un jour, les autres restent calculées.
        const settled = await Promise.allSettled(Object.entries(VARIABLES).map(([id, v]) => calc(body.profil!, id, v)));
        const aides = settled.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
        const errors = settled.flatMap((r) => (r.status === "rejected" ? [String(r.reason?.message || r.reason).slice(0, 120)] : []));
        if (errors.length) console.warn("[openfisca]", errors.join(" | "));
        return json({ ok: aides.length > 0, source: "openfisca", aides, errors: errors.length });
      },
    },
  },
});
