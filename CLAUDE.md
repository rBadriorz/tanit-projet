# Tanit Citoyen — Sciences Po AI Hackathon 2026

Équipe : Rym (ingénieure, build), Carmen (droit et finance, autrice du mémo Tanit), Anatole (affaires publiques), Yves et Victor (finance).
Rendu : samedi 21 novembre 2026 à 16 h (Paris) : lien du prototype, vidéo de démo, slides. Pas de délai supplémentaire.
Notation : problème 15 %, solution et déploiement 35 %, prototype fonctionnel 25 %, qualité du prototype 25 %.

## Le produit
- `tanit-citoyen.html` : prototype mobile-first, une seule page, français et anglais (démo en anglais).
- Écrans : choix de la langue, accueil, capital Tanit (simulateur, compartiments, relevé trimestriel), vote citoyen (3 votes), mes aides (lecture de document par l'IA, estimation, dossier pré-rempli validé par le citoyen), question (assistant), espace décideurs (stock d'actifs, test des conditions Eurostat).
- Appli Vite + serveur Node : `index.html` (HTML et CSS), `src/main.js` (logique), `src/claude.js` (remplace `window.claude.use`), `server/index.js` (seul endroit qui voit la clé, lue dans `.env`). `tanit-citoyen.html` est l'ancienne version claude.ai, gardée pour référence.
- Pour la voix (« Écouter »), on utilise la synthèse vocale du navigateur : l'API Anthropic n'en propose pas.
- Les schémas JSON des réponses (lecture de document, aides) sont dans `server/index.js` : si on change un prompt JSON dans `src/main.js`, il faut mettre à jour le schéma.

## Parcours et compte (v0.4)
- Entrée : langue → présentation (3 écrans) → connexion simulée (FranceConnect fictif, ou e-mail + code 123456, ou sans compte) → consentements → appli.
- Compte (avatar en haut) : mes démarches avec suivi, confidentialité (interrupteurs de consentement, données gardées, tout effacer), préférences (langue, taille, thème), mentions légales, déconnexion. Politique de confidentialité : `#politique`.
- L'IA respecte les consentements : `aiOn()` et `consent().doc`.
- Architecture cible : voir `ARCHITECTURE.md`.

## Règles
- Thème clair uniquement : fond blanc, cartes plates à filet fin, pas d'ombres ni de dégradés. Pas de mode sombre.
- Accessible à tous les âges : gros boutons (52 px min), contrastes forts, phrases courtes, focus visible.
- Couleurs bleu `#000091` et rouge `#c9000d`. Ne pas utiliser le logo Marianne ni la marque de l'État : bandeau « prototype étudiant » obligatoire.
- L'IA estime, le citoyen valide. Jamais d'envoi automatique, jamais de « vous avez droit » affirmatif.
- Hypothèses de rendement et barème 1 à 4 % : à valider par Yves et Victor.

## Agents de recherche (`agents/`, à déplacer une fois dans `.claude/agents/`)
veille-sondages, benchmark-international, analyse-juridique (relecture Carmen), retours-terrain, jury-contradicteur, revue-interface (audit accessibilité et design, à relancer après chaque changement d'interface).

## Workflow
- Ce dossier est synchronisé avec Lovable via GitHub (`rBadriorz/tanit-projet`, branche `main`). Chaque push sur `main` remonte dans l'éditeur Lovable.
- Compte GitHub : **rBadriorz uniquement, jamais PA-Andries.** L'identité git et l'authentification (`gh`, compte rBadriorz) sont réglées dans la config locale de ce dépôt : ne pas les changer. Avant chaque push, vérifier que `gh api user --jq .login` renvoie `rBadriorz`.
- **Toujours faire `git pull` avant de commencer**, car Lovable peut avoir poussé des changements entre-temps.
- Après chaque modification validée, faire soi-même `git add`, `git commit` et `git push` sur `main`.
- Respecter AGENTS.md (règles de Lovable) : jamais de force push, de rebase ni d'amend sur des commits déjà poussés ; garder `main` dans un état qui fonctionne ; ne pas toucher aux fichiers générés ni aux secrets.
- Dans ce dépôt, l'appli d'origine vit dans `src/legacy/` (`body.html`, `tanit.css`, `main.js`, `claude.js`) et les appels IA dans `src/lib/anthropic.server.ts`. Les chemins `index.html`, `src/main.js` et `server/index.js` cités plus haut correspondent à l'ancien dossier `tanit`.
