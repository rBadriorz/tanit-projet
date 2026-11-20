import { createFileRoute } from "@tanstack/react-router";
import { common, errorCode, hasKey, json, rateLimited, streamMessages } from "@/lib/anthropic.server";

// Schémas JSON fixes : le navigateur choisit un nom, pas un schéma, et la réponse est garantie valide.
const num = { anyOf: [{ type: "number" }, { type: "null" }] };
const SCHEMAS: Record<string, { effort: string; schema: object; unwrap: (d: any) => unknown }> = {
  document: {
    effort: "low",
    schema: {
      type: "object",
      properties: {
        revenu_net_mensuel: num,
        enfants_a_charge: num,
        vie: { anyOf: [{ type: "string", enum: ["seul", "couple"] }, { type: "null" }] },
        lisible: { type: "boolean" },
      },
      required: ["revenu_net_mensuel", "enfants_a_charge", "vie", "lisible"],
      additionalProperties: false,
    },
    unwrap: (d) => d,
  },
  aides: {
    effort: "medium",
    schema: {
      type: "object",
      properties: {
        aides: {
          type: "array",
          items: {
            type: "object",
            properties: {
              aide: { type: "string" },
              organisme: { type: "string" },
              eligibilite: { type: "string", enum: ["probable", "possible", "peu probable"] },
              montant_mensuel: num,
              pourquoi: { type: "string" },
              pieces: { type: "array", items: { type: "string" } },
            },
            required: ["aide", "organisme", "eligibilite", "montant_mensuel", "pourquoi", "pieces"],
            additionalProperties: false,
          },
        },
      },
      required: ["aides"],
      additionalProperties: false,
    },
    unwrap: (d) => d.aides,
  },
  // Agent « Mes droits », étape 1 : lecture de l'avis d'imposition.
  avis: {
    effort: "low",
    schema: {
      type: "object",
      properties: {
        type: { type: "string" },
        annee_revenus: num,
        salaires_annuels: num,
        revenu_fiscal_reference: num,
        nombre_parts: num,
        enfants_a_charge: num,
        vie: { anyOf: [{ type: "string", enum: ["seul", "couple"] }, { type: "null" }] },
        lisible: { type: "boolean" },
      },
      required: ["type", "annee_revenus", "salaires_annuels", "revenu_fiscal_reference", "nombre_parts", "enfants_a_charge", "vie", "lisible"],
      additionalProperties: false,
    },
    unwrap: (d) => d,
  },
  // Agent « Mes droits », étape 3 : formulaire pré-rempli.
  formulaire: {
    effort: "low",
    schema: {
      type: "object",
      properties: {
        champs: {
          type: "array",
          items: {
            type: "object",
            properties: {
              libelle: { type: "string" },
              valeur: { type: "string" },
              source: { type: "string", enum: ["document", "vous", "calcul", "a_completer"] },
            },
            required: ["libelle", "valeur", "source"],
            additionalProperties: false,
          },
        },
        pieces_manquantes: { type: "array", items: { type: "string" } },
      },
      required: ["champs", "pieces_manquantes"],
      additionalProperties: false,
    },
    unwrap: (d) => d,
  },
  // Agent Tanit : résumé neutre des options avant le vote.
  vote: {
    effort: "low",
    schema: {
      type: "object",
      properties: {
        votes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              options: {
                type: "array",
                items: {
                  type: "object",
                  properties: { option: { type: "string" }, gain: { type: "string" }, risque: { type: "string" } },
                  required: ["option", "gain", "risque"],
                  additionalProperties: false,
                },
              },
            },
            required: ["options"],
            additionalProperties: false,
          },
        },
      },
      required: ["votes"],
      additionalProperties: false,
    },
    unwrap: (d) => d.votes,
  },
  // Agent décideurs : note préparatoire.
  note: {
    effort: "medium",
    schema: {
      type: "object",
      properties: {
        objet: { type: "string" },
        synthese: { type: "string" },
        risque: { type: "string", enum: ["faible", "moyen", "élevé"] },
        risques: { type: "array", items: { type: "string" } },
        questions: { type: "array", items: { type: "string" } },
        recommandation: { type: "string" },
      },
      required: ["objet", "synthese", "risque", "risques", "questions", "recommandation"],
      additionalProperties: false,
    },
    unwrap: (d) => d,
  },
};

const IMG_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export const Route = createFileRoute("/api/json")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (rateLimited(request, "json")) return json({ error: "rate_limited" }, 429);
        if (!hasKey()) return json({ error: "other" }, 503);
        const body = (await request.json().catch(() => null)) as any;
        const { prompt, schema: name, images = [] } = body ?? {};
        const spec = SCHEMAS[name];
        if (!spec || typeof prompt !== "string" || prompt.length > 20_000 || !Array.isArray(images) || images.length > 2) {
          return json({ error: "other" }, 400);
        }
        for (const im of images) {
          if (!im || !IMG_TYPES.has(im.media_type) || typeof im.data !== "string" || im.data.length > 7_000_000) {
            return json({ error: "images_unavailable" }, 400);
          }
        }
        const content = [
          ...images.map((im: any) => ({ type: "image", source: { type: "base64", media_type: im.media_type, data: im.data } })),
          { type: "text", text: prompt },
        ];
        try {
          let text = "";
          let stop: string | null = null;
          for await (const ev of streamMessages({
            ...common(spec.effort),
            output_config: { effort: spec.effort, format: { type: "json_schema", schema: spec.schema } },
            messages: [{ role: "user", content }],
          })) {
            if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") text += ev.delta.text;
            if (ev.type === "message_delta" && ev.delta?.stop_reason) stop = ev.delta.stop_reason;
          }
          if (stop === "refusal" || stop === "max_tokens") return json({ error: "other" }, 502);
          return json({ data: spec.unwrap(JSON.parse(text)) });
        } catch (err) {
          const code = errorCode(err);
          return json({ error: code }, code === "rate_limited" ? 429 : 502);
        }
      },
    },
  },
});
