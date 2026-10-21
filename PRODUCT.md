# Deviny

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
People who train, trainers and nutritionists share one product. A consumer may start by finding a partner, meeting a specialist, choosing a program or training independently. Professionals create programs and work with clients. Do not narrow the audience to strength-training logbook users. Age, geography and segment priority have not been validated by research or analytics.

## Product Purpose
Deviny connects people, specialists, programs and training in one app. The owner confirmed this intent on October 18, 2026 after explicitly rejecting the workout-tracker positioning. The central value is the connection between meeting people, choosing how to train, doing the work and sharing results. The journal supports that journey; it does not define the product category. The website explains this connection and offers a genuine next action. The app will launch in App Store and Google Play. The owner requested mock store links until the real listings are available; installation never requires contacting the team.

## Operating Context
Static marketing website with EN, RU and AZ pages, hosted on GitHub Pages. Four core page types: home, specialists, about with team, and contextual contacts; localized 404 and legacy team redirects support recovery and old links. The October 18, 2026 source audit compares current iOS master (13cc2ce) and Backend master (a8e64ba), with the owner's current launch decisions. The owner rejected the initial audit's tracker-first interpretation; docs/positioning-correction-20261018.md supersedes its strategic conclusions. Source verification is not runtime, release or conversion verification.

## Capabilities and Constraints
Static HTML/CSS/JavaScript, generated with Python standard library. Preserve canonical routes, three languages, navigation, accessibility and the existing Web3Forms integration. The user confirmed contact@deviny.me; no current installation URL is available. content/distribution.json holds appStoreUrl and googlePlayUrl, currently authorized generic storefront placeholders with linksArePlaceholders=true. Replace them with real app listings after release and update the future-release copy. The form is for questions, support and partnerships only. The user removed subscriptions from this launch and all public copy. Explain program purchases plainly; offer-dependent support must not imply universal availability. Basic/Standard/Pro do not belong in the main consumer flow. Do not invent prices, results, reviews or adoption figures. Publishing, DNS and deployment require a separate explicit instruction.

## Brand Commitments
Deviny name and existing logo. The original user brief grounds the website in the app's neutral light/graphite surfaces and gold accent. All factual copy and product demonstrations must remain faithful to the app. The user requested parallax or another visible motion effect and has rejected the existing dark collage design. The landing page is intended for production: source/provenance notes, test-build labels and audit language belong only in internal documentation. The user explicitly rejected a public animation pause button; automatic motion must be brief and respect system reduced motion.

## Evidence on Hand
`docs/landing-message-audit-20261018.md`, the historical `docs/product-audit.md`, and `docs/evidence/asset-provenance.json`. `assets/product/exercises-ru.webp` is a real September test-build exercise catalog screenshot; it demonstrates exercise selection, not recording sets or history. It is retained for history and no longer displayed after the owner rejected the lower screenshot section. `assets/product/training.webp` is an illustration used by the app's welcome screen, not a screenshot of a workout. The subsequent `assets/product/training-together.webp` editorial scene depicts fictional people; the owner rejected it as generic, and its variants are retained unused for history. The current lower section explains solo, partner and program scenarios through short copy and CSS/SVG diagrams, not product screenshots or member evidence. Existing team photos and names come from the previous site; no new biographical claims are authorized.

## Product Principles
- Lead with people, specialists and programs; explain how training and results connect them.
- Treat recording workouts as a supporting capability, never the product category or a proven primary audience.
- Explain relationships through concrete situations, not a catalogue or a vague ecosystem slogan.
- Show real evidence and keep launch qualifications understandable.
- Give specialists a distinct path.
- Keep the next action honest and usable.

## Accessibility & Inclusion
Keyboard operation, visible focus, sufficient contrast, responsive layouts at 360/390/768/1440 px, enlarged text and reduced motion. Important text is always available and scrolling remains native.

## October 20 architecture follow-through
The owner requested implementation of the structure audit. Contact modes cover support, specialist-tool questions and partnerships; all require a name, reply contact and message. The owner’s launch correction supersedes the earlier access-inquiry approach. About and Team are one page, with compatible legacy team addresses. The homepage separates people, program choice and actual training scenarios; program payment is conditional in copy rather than advertised as an enabled launch capability. The specialist route offers an optional question action, never a registration or connection gate.

The published legal links remain unchanged. The sibling Backend legal handoff explicitly marks its October 9 sources as drafts awaiting legal review/publication; they are not copied to the marketing site. Public automated checks are blocked by Cloudflare 1010 at the edge, so they do not establish origin-document availability or absence. No live form messages, deployment, production protection or sibling source changes are authorized by this local implementation work.

The October 20 audit follow-through keeps the four-page structure and approved hero while reducing repeated explanations. Both consumer and professional paths lead to installation; professional questions are optional. Social previews are localized brand compositions, not product screenshots or member evidence. Analytics integration remains a release-dependent task; no conversion claim is made from source checks.

## Current coverage and launch boundary

The homepage retains 24 source-backed capabilities, distributed through people/GymBro, clubs, program selection, training, progress, personal control and professional tools. The owner explicitly removed the communication chapter and its four standalone entries; do not restore it. Communication is still naturally mentioned in the shared-training scenario. Preserve the 24 remaining entries while removing repetitive explanations.

Program selection explains authors/content, training scenarios explain actions, and progress explains history/achievements/rankings. Smaller profile, language/theme and invitation explanations must not compete with the central proposition. Professional copy describes actual work: creating programs, opening client details and planning meetings. Program publication requires approved professional documents. The final source check additionally inspected SafeLeaderboardSection.swift, StudentDetailView.swift, ExpertDashboardView.swift and ScheduleView.swift; none of these inspections constitutes runtime acceptance or a release guarantee.

The owner-authorized generic store links remain until genuine listings exist. No access gate, subscription offer, deployment, analytics service or real form submission is implied by local site refinements. Current instructions and README take precedence over historical design/audit records.


## Training section removal — October 21, 2026
The owner explicitly removed the complete “From a plan to a workout” homepage section, including its workout demonstration, partner/saved-result scene and exercise catalogue, workout editor and history explanations. This supersedes earlier requirements to retain those three standalone capability entries. The remaining 21 entries stay; do not reintroduce the removed section. Remove its local navigation link and scene-only assets/code in every locale. This changes landing-page scope, not the application's capabilities.
