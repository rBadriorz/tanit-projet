---
name: tanit-agents
description: Ajouter ou modifier un agent IA de Tanit Citoyen (src/legacy/agents.js) avec étapes visibles, mode démo sans clé, schéma JSON serveur et test Playwright.
---

# Agents de Tanit Citoyen

Principe à respecter partout : **les règles calculent, l'IA lit, explique et prépare, le citoyen valide**. Jamais d'envoi automatique, jamais de « vous avez droit » affirmatif.

## Où est quoi
- `src/legacy/agents.js` : les 5 agents (Mes droits, veille, suivi de dossier, agent Tanit, agent décideurs). Textes FR/EN dans `AGENT_L`, fusionnés dans `L` par `main.js`.
- `src/legacy/main.js` : appelle `initAgents(ctx)`, `agentsOnLang()`, `agentsOnRoute(v)`, `agentsOnCapital()`. Le contexte `C` donne `t`, `mk`, `eur`, `jget/jset`, `sample()`, `aiOn()`, `consent()`, `session()`…
- `src/legacy/body.html` : les écrans (`<section id="v-...">`). Ajouter un écran = l'ajouter aussi à `VIEWS` dans `main.js`.
- `src/routes/api/json.ts` : schémas JSON garantis (`document`, `aides`, `avis`, `formulaire`, `vote`, `note`). Le navigateur envoie un **nom** de schéma, jamais un schéma.
- `src/routes/api/openfisca.ts` : outil « simulateur officiel ». Appelle l'API publique OpenFisca France (sans clé), une requête par aide (`ppa`, `rsa`, `aide_logement`, `af`, `asf`, `aspa`). Entrées : `salaire_de_base` (brut ≈ net / 0,78), `chomage_net`, `retraite_brute`, `loyer`, `statut_occupation_logement`, `depcom` (Lyon d'exemple), 36 mois d'historique. Vérifié avec openfisca-france 177 : profil d'exemple → prime d'activité ≈ 270 €, APL ≈ 152 €, ASF ≈ 202 €. Si l'API ne répond pas, `rules()` dans agents.js sert de repli.

## Recette pour un nouvel agent
1. Textes : ajouter les clés dans `AGENT_L.fr` **et** `AGENT_L.en` (la démo est en anglais).
2. Étapes visibles : `const S = stepper(boxOl, t('mes_etapes'))`, puis `S.start(i)`, `await S.log(i, texte, 'outil.nom()')`, `S.done(i)` (ou `'fail'`). Chaque appel d'outil ou d'IA a sa ligne de journal : c'est ce que le jury doit voir.
3. IA : `if (live()) { await C.sample().json(prompt + AI_LANG(), {schema:'nom'}) }` ; texte libre : `C.sample()(prompt, {modelTier:'quick', onText})`. Toujours un `try/catch` qui retombe sur la réponse d'exemple.
4. Mode démo : sans clé ou si l'IA est refusée, `live()` est faux. Prévoir une réponse d'exemple FR/EN, mêmes étapes, et afficher `modeTag(el)`.
5. Schéma : ajouter l'entrée dans `SCHEMAS` de `json.ts` (`additionalProperties:false`, tous les champs dans `required`, `num` pour les nombres nullables).
6. Stockage : `C.jget/jset` (localStorage). Ajouter toute nouvelle clé à la liste d'effacement (`wipeYes`) et à `kept` dans `main.js`.

## Vérifier
- `npm run build` puis `npx vitest run`.
- `npm run dev` puis parcours : langue → présentation → « sans compte » → « tout accepter » → onglet Mes droits → « avis d'exemple ». Tester aussi en anglais.
- Pour tester les branches IA sans clé : Playwright avec `page.route('**/api/json', ...)` et `page.route('**/api/sample', ...)` qui renvoient des réponses simulées.
