# Deviny website

Static HTML/CSS/JS for GitHub Pages at **deviny.me**. EN lives at `/`, RU at `/ru/`, AZ at `/az/`.

Four core page types: home, specialists, about (including the team) and contacts. The sitemap contains 12 canonical pages. Three localized 404 documents are excluded from indexing. Old team URLs redirect to the matching About/team section; extensionless core aliases remain supported.

```sh
python3 scripts/build.py
python3 scripts/check.py
node scripts/check-ui-motion.cjs
node scripts/check-product-scenes.cjs
node scripts/check-contact-flow.cjs
node scripts/check-navigation.cjs
node scripts/check-home-motion.cjs
python3 scripts/preview.py --port 4173
```

Open `http://127.0.0.1:4173/ru/`. Python is a local authoring/preview tool; deployment serves the committed HTML and requires no server runtime or npm dependencies.

Edit copy in `content/site.json`, templates in `scripts/build.py`, shared styling in `global.css`, homepage styling/motion in `home.css` and `home.js`, and the specialist hero in `specialists.css`. Rebuild and retain the generated HTML. Keep `CNAME` and the existing Web3Forms integration unchanged unless the owner authorizes a change.

Store buttons read `appStoreUrl` and `googlePlayUrl` from `content/distribution.json`. The owner authorized mock links: they currently open the generic App Store and Google Play storefronts (`linksArePlaceholders: true`). Replace these with the real listings, set the flag to false, and update the coming-soon copy in all three locales after release. There is no access-request flow. The generator and checker enforce the matching HTTPS store hosts.

- [Complete homepage redesign and verification scope](docs/home-redesign-20261018.md)
- [Current product positioning and message structure](docs/positioning-correction-20261018.md)
- [Earlier source audit; tracker positioning superseded](docs/landing-message-audit-20261018.md)
- [Current localized website copy](content/site.json)
- [October 18 Russian copy, historical](docs/landing-copy-ru-20261018.md)
- [Product audit and evidence](docs/product-audit.md)
- [Implementation and release handoff](docs/implementation.md)
- [QA results](docs/qa-report.md)
- [Historical visual before/after review](docs/review.html)
- [Current design system; rendered QA pending](DESIGN.md)

Contact-form testing uses `/__qa__/ru/contacts.html?mock=success` on the local preview server. Normal contact pages use the live service. No public publishing or deployment is implied by running these commands.

Contact modes are generated from `contactModes` in `content/site.json`: `support`, `specialist` (questions about professional tools) and `collaboration`. All require a name, reply contact and message. An obsolete or unknown topic falls back to support. Drafts and actual selected intent survive language switching. Behavioral tests use isolated stubs and do not send real messages.

`python3 scripts/check-external.py` performs read-only public legal URL checks: exit 0 means available, 1 means error/unavailable, 2 means automated requests blocked by Cloudflare. Current probes return Cloudflare 1010 before origin access; this is not a broken-path or legal-approval verdict. Backend legal source drafts were not copied into the public website. Live document approval and any Cloudflare production-rule changes remain separate owner-controlled work.

Social cards are committed at `assets/social/deviny-{en,ru,az}.png` (1200×630). To refresh them after changing `socialTitle`/`socialText`, run `scripts/build-social.py` with a Python environment containing Pillow, then rebuild HTML. This authoring helper is not a Pages/runtime dependency. Specialist and consumer install paths use the same configured stores; professional questions remain secondary. After real listings launch, replace placeholders, update future-release copy, and connect store-click measurement to the chosen analytics setup.

## Current homepage

The homepage places 24 retained capability entries once per locale: people/GymBro → clubs → programs → training/tools → progression → personal control → professional tools → FAQ → stores. The communication chapter was removed at the owner's request; its four entries remain in the internal source catalogue only. Preserve all 24 displayed entries and their anchors when editing.

The approved hero/iPhone/parallax stays intact. Clubs use a realistic group image; training/nutrition previews use corresponding photographs with keyboard-accessible tabs. Training has three selectable four-step scenarios. Progress uses a CSS podium; personal space combines three compact profile/preferences/invitation facts with a light/dark privacy preview. FAQ uses native grouped disclosures. The specialist page explains three concrete work tasks before onboarding and client-facing terms.

Current generated photos are `club-outdoors-photo`, `program-strength-photo` and `program-nutrition-photo` under `assets/product/`, each with 1080px/560px WebP exports and exact prompt/source/hash sidecars. They illustrate fictional scenes, not actual members or native UI. Prompts and source mapping: `docs/evidence/realistic-media-{prompts,sources}-20261020.json`. All six rejected stylized scenes, `training-together` and the rejected exercise screenshot remain unused historical files.

Current verification: 12 canonical pages, 3 utility pages, 6 redirects, 438 local references and 75 image elements. Run the commands above plus `node scripts/check-product-scenes.cjs`. Current evidence: `.impeccable/review/final-polish-checks.json`. Browser rendering/capture remains unavailable under the prior security restriction; source and simulated behavioral checks do not certify mobile geometry, animation smoothness or conversion.

Earlier decisions and superseded compositions are recorded chronologically in DESIGN.md and docs/qa-report.md. The current summary in this README takes precedence over historical descriptions of access requests, 28 displayed capabilities, chat previews or stylized illustrations.
