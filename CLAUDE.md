# René (provisional name) — Sciences Po AI Hackathon 2026

App name: René (constant in src/bottega/config.ts). Pivot from the earlier "Tanit" idea (removed). Neighbours take over local shops whose owners retire: a lead buyer keeps the majority, residents join from €100 through a licensed crowdfunding partner, an AI co-pilot builds the valuation, bank file and story.

## Code
- App: `src/bottega/` (`config.ts` = APP_NAME / tagline / trust line — never hard-code the name; `types.ts`; `data/` fictional seed data + `scripted.ts` AI fallbacks; `components/`; `screens/`; `lib/agent.ts` client agent calls; `store.tsx` state + localStorage + internal navigation).
- Routes: `/` (app), `/shop/$shopId` (QR deep link, `?apply=1`), `/poster/$shopId`, `/poster/successor/$shopId` (print A4), `/api/bottega/agent` (Claude), `/api/health`.
- Claude calls: `src/lib/anthropic.server.ts` (official SDK, secret `ANTHROPIC_API_KEY`, `claude-opus-5-5`, low effort, server-side fallbacks). Every AI feature has a scripted fallback (no key, error, >12 s, or Presenter "scripted").
- Public link: set `PUBLIC_URL` in `src/bottega/config.ts` to the published Lovable URL; every QR code, share link and link preview uses it (`src/bottega/lib/url.ts`, `lib/seo.ts`). Preview image: `public/og-image.png`.
- Desktop shows the app in a phone frame with a jury QR and a Presenter panel; < 500 px wide = full screen.

## Rules
- Logo: `src/assets/rene-logo.svg` is the logo exactly as supplied by the team (text in Poppins 600, loaded in __root.tsx); `rene-logo-dark.svg` = colour swap for dark brown backgrounds; `rene-mark.svg` = beaver only (favicon, map pins); `rene-mascot.svg` = the cute assistant mascot (Ask René button, chat avatar); `*-outlined.svg` = same with the text as a path, for PNG / PDF exports. Use `<Logo>` / `<Mark>` from `src/bottega/components/Logo.tsx`; do not redraw the logo.
- Colours: palette defined once in `src/bottega/theme.ts` (René brown #8B5A2B primary, white background); use the Tailwind tokens (primary, primary-dark, primary-light, page, surface, ink, muted, line, warning, success, danger) or `P.*`, never raw hex. Green only for success, red only for errors and closed shops.
- All UI text in English. Everything fictional (the "Demo · fictional data" pill was removed from the interface at the team's request).
- Never name the crowdfunding platform we talk to; write "our licensed crowdfunding partner". No real bank names.
- Trust line on every investing screen. Investment is simulated: no payment fields.
- `package.json` `sideEffects` must keep `"**/*.css"`; never set it to `false`. Check `bun run build` and the prod preview.

## Workflow
- Synced with Lovable via GitHub (`rBadriorz/tanit-projet`, branch `main`). Always `git pull` first; commit and push to `main` after each validated change.
- GitHub account: **rBadriorz only, never PA-Andries.** Identity is set in the repo's local git config: don't change it. Check `gh api user --jq .login` returns `rBadriorz` before pushing.
- Respect AGENTS.md: no force push, rebase or amend of pushed commits; keep `main` working; don't touch generated files or secrets.
