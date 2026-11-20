# Tanit Citoyen — Sciences Po AI Hackathon 2026

Équipe : Rym (ingénieure, build), Carmen (droit et finance, autrice du mémo Tanit), Anatole (affaires publiques), Yves et Victor (finance).
Rendu : samedi 21 novembre 2026 à 16 h (Paris) : lien du prototype, vidéo de démo, slides. Pas de délai supplémentaire.
Notation : problème 15 %, solution et déploiement 35 %, prototype fonctionnel 25 %, qualité du prototype 25 %.

## Le produit
- Prototype mobile-first, français et anglais (démo en anglais), hébergé par Lovable (TanStack Start).
- Écrans : choix de la langue, accueil, capital Tanit (simulateur, compartiments, relevé trimestriel), vote citoyen (3 votes), mes aides (lecture de document par l'IA, estimation, dossier pré-rempli validé par le citoyen), question (assistant), espace décideurs (stock d'actifs, test des conditions Eurostat).
- L'appli vit dans `src/legacy/` : `body.html` (écrans), `tanit.css` (styles), `main.js` (logique et textes), `agents.js` (agents de l'appli), `claude.js` (appels au serveur). `src/routes/index.tsx` la monte telle quelle : modifier ces fichiers plutôt que réécrire en React.
- Appels IA : routes `src/routes/api/` (`health`, `sample`, `json`) et `src/lib/anthropic.server.ts`, seul endroit qui voit la clé (secret Lovable `ANTHROPIC_API_KEY`).
- Pour la voix (« Écouter »), on utilise la synthèse vocale du navigateur : l'API Anthropic n'en propose pas.
- Les schémas JSON des réponses sont dans `src/routes/api/json.ts` : si on change un prompt JSON dans `src/legacy/`, il faut mettre à jour le schéma.

## Parcours et compte (v0.4)
- Entrée : langue → présentation (3 écrans) → connexion simulée (FranceConnect fictif, ou e-mail + code 123456, ou sans compte) → consentements → appli.
- Compte (avatar en haut) : mes démarches avec suivi, confidentialité (interrupteurs de consentement, données gardées, tout effacer), préférences (langue, taille du texte), mentions légales, déconnexion. Politique de confidentialité : `#politique`.
- L'IA respecte les consentements : `aiOn()` et `consent().doc`.
- Architecture cible : voir `ARCHITECTURE.md`.

## Agents dans l'appli (v0.5, `src/legacy/agents.js`)
- **Mes droits** (`#droits`, onglet « Mes droits ») : 4 étapes visibles à l'écran. 1) l'IA lit l'avis d'imposition (photo, ou avis d'exemple fictif dessiné en canvas), 2) le simulateur officiel OpenFisca calcule les aides (`src/routes/api/openfisca.ts`, API publique sans clé ; repli sur les barèmes simplifiés de `rules()` s'il ne répond pas) et l'IA n'écrit que les explications, 3) l'IA remplit le formulaire (sources : document, vous, calcul, à compléter), 4) le citoyen coche « j'ai relu » et valide (envoi simulé). L'agent pose une question si une info manque (loyer, situation, âge).
- FranceConnect reste simulé (habilitation nécessaire) : c'est la cible, pas une intégration réelle.
- Pour ajouter ou modifier un agent : skill `.claude/skills/tanit-agents`.
- **Veille** : boutons « ma situation change » (naissance, déménagement, baisse de revenus, perte d'emploi, retraite) → nouveau calcul, alertes (accueil + écran Mes droits).
- **Suivi de dossier** (Compte → Mes démarches) : pièces à cocher, bouton « avancer de 15 jours (démo) », rappel automatique si des pièces manquent, message de relance prêt (le citoyen l'envoie lui-même).
- **Agent Tanit** : relevé trimestriel d'exemple expliqué (écran Capital) et résumé neutre des options avant le vote (écran Vote).
- **Agent décideurs** (écran État) : scénario → 4 critères Eurostat → risques → note téléchargeable (.txt).
- Sans clé API ou si l'IA est refusée : « mode démo », mêmes étapes avec des réponses d'exemple, étiquette visible. Schémas JSON côté serveur : `avis`, `formulaire`, `vote`, `note` dans `src/routes/api/json.ts`.

## Règles
- Thème clair uniquement : fond blanc, cartes plates à filet fin, pas d'ombres ni de dégradés. Pas de mode sombre.
- Accessible à tous les âges : gros boutons (52 px min), contrastes forts, phrases courtes, focus visible.
- Couleurs bleu `#000091` et rouge `#c9000d`. Ne pas utiliser le logo Marianne ni la marque de l'État : bandeau « prototype étudiant » obligatoire.
- L'IA estime, le citoyen valide. Jamais d'envoi automatique, jamais de « vous avez droit » affirmatif.
- Hypothèses de rendement et barème 1 à 4 % : à valider par Yves et Victor.

## Agents Claude Code (`.claude/agents/`)
veille-sondages, benchmark-international, analyse-juridique (relecture Carmen), retours-terrain, jury-contradicteur, revue-interface (audit accessibilité et design, à relancer après chaque changement d'interface).

## Workflow
- Ce dossier est synchronisé avec Lovable via GitHub (`rBadriorz/tanit-projet`, branche `main`). Chaque push sur `main` remonte dans l'éditeur Lovable.
- Compte GitHub : **rBadriorz uniquement, jamais PA-Andries.** L'identité git et l'authentification (`gh`, compte rBadriorz) sont réglées dans la config locale de ce dépôt : ne pas les changer. Avant chaque push, vérifier que `gh api user --jq .login` renvoie `rBadriorz`.
- **Toujours faire `git pull` avant de commencer**, car Lovable peut avoir poussé des changements entre-temps.
- Après chaque modification validée, faire soi-même `git add`, `git commit` et `git push` sur `main`.
- Respecter AGENTS.md (règles de Lovable) : jamais de force push, de rebase ni d'amend sur des commits déjà poussés ; garder `main` dans un état qui fonctionne ; ne pas toucher aux fichiers générés ni aux secrets.
