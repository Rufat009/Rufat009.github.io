---
name: Deviny
description: Source-derived shared website styles and homepage campaign overrides; rendered QA pending.
colors:
  bg: "#f5f5f0"
  surface: "#eaece5"
  line: "#ced3c8"
  text: "#202822"
  muted: "#596157"
  gold: "#806324"
  gold-field: "#e8c77f"
  inverse-text: "#f4f5ee"
  inverse-muted: "#c0c7b9"
  inverse-line: "#4c5749"
  white: "#fff"
  button-hover: "#3e4b3b"
  button-disabled: "#66735f"
  focus: "#89651d"
  input-surface: "#fbfcf8"
  input-line: "#969f90"
  placeholder: "#677061"
  invalid-line: "#a03535"
  error: "#9b2929"
  success: "#285632"
  success-surface: "#d8e6d4"
  home-bg: "#f7f7f2"
  home-text: "#232923"
  home-muted: "#596057"
  home-line: "#d4d8cd"
  home-gold: "#806124"
  home-graphite: "#252d26"
  home-inverse-muted: "#c8cec1"
  home-inverse-line: "#687262"
  home-button-active: "#171e18"
typography:
  display:
    fontFamily: "Deviny Sans, Arial, sans-serif"
    fontSize: "clamp(3rem, 6.3vw, 6rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Deviny Sans, Arial, sans-serif"
    fontSize: "clamp(2.2rem, 3.7vw, 3.6rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Deviny Sans, Arial, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Deviny Sans, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Deviny Sans, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.6
  home-display:
    fontFamily: "Deviny Sans, Arial, sans-serif"
    fontSize: "clamp(3.25rem, 5.6vw, 5.25rem)"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "-0.04em"
  home-headline:
    fontFamily: "Deviny Sans, Arial, sans-serif"
    fontSize: "clamp(2.35rem, 4.2vw, 3.75rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.04em"
rounded:
  control: "8px"
  action: "10px"
  compact-panel: "12px"
  home-action: "12px"
  image: "14px"
  panel: "16px"
spacing:
  form-gap: "22px"
  group: "24px"
  form-panel: "36px"
  section: "112px"
  section-tablet: "76px"
  section-mobile: "64px"
  home-section: "clamp(4.5rem, 8vw, 7rem)"
  home-column-gap: "clamp(2.5rem, 6vw, 6rem)"
  home-section-mobile: "64px"
components:
  button-primary:
    backgroundColor: "{colors.text}"
    textColor: "{colors.white}"
    rounded: "{rounded.action}"
    padding: "15px 23px"
  button-primary-hover:
    backgroundColor: "{colors.button-hover}"
  button-primary-disabled:
    backgroundColor: "{colors.button-disabled}"
  button-small:
    backgroundColor: "{colors.text}"
    textColor: "{colors.white}"
    rounded: "{rounded.action}"
    padding: "11px 16px"
  text-link:
    textColor: "{colors.text}"
  input:
    backgroundColor: "{colors.input-surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
  navigation:
    textColor: "{colors.muted}"
  reply-option:
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
  form-panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
    padding: "36px"
  home-button-primary:
    backgroundColor: "{colors.home-text}"
    textColor: "{colors.white}"
    rounded: "{rounded.home-action}"
    padding: "14px 16px 14px 23px"
  home-button-primary-active:
    backgroundColor: "{colors.home-button-active}"
  home-need:
    textColor: "{colors.home-text}"
    padding: "25px 0"
  home-faq:
    textColor: "{colors.home-text}"
    padding: "25px 0"
---

## Current implementation — final audit follow-through, October 20, 2026

This is the current source state; earlier dated decisions below are historical. Preserve the established neutral/gold/graphite identity, approved home hero/iPhone, three realistic editorial photographs and distinct section forms. The homepage contains 24 feature entries; communication and rejected illustrations remain absent.

Programs now explain selection through shorter copy and two photographic previews; the redundant numbered preview routes were removed. Training retains its three real four-step journeys. Progress copy names consistency and improvement relative to one's own history. Personal space keeps all six capabilities but gives profile/preferences/invites compact paragraphs and smaller heading/spacing, retaining privacy icons and the local theme preview.

Specialists have an open three-task working sequence in place of repetitive audience copy: create a program, inspect a client, plan a meeting. Role differences and document approval remain explicit. “Download” navigation names its store-section destination and stays on the specialist page there. All footers use a light-gold focus ring. Verified obsolete hero/workflow/disclosure CSS was removed; shared behavior and motion remain intact.

The current build and verification record is `.impeccable/review/final-polish-checks.json`; README gives the current route/asset map. Rendered visual acceptance remains pending under the earlier browser restriction. No fresh screenshots, deployment or installation validation are implied.


# Design System: Deviny

## Overview

This is a source-derived record of the website after the authorized homepage replacement on October 18, 2026. The shared visual base is a self-hosted sans serif, light neutral ground, graphite text, gold accents, rounded controls and ruled content. The Deviny name and existing logo are established assets. The homepage adds a campaign-scale typographic hierarchy and broad light, graphite and gold areas. Its composition is page-specific; the surface direction remains in `.impeccable/surfaces/scripts-build-py.md` and is not a new global brand requirement.

`global.css` supplies the shared styles. The builder loads `home.css` and `home.js` only on the EN, RU and AZ homepages. Frontmatter names prefixed `home-` describe those overrides; unprefixed names describe the shared base. Other routes retain their shared layouts and components. Obsolete image-cover styles still present in `global.css` are not the current homepage and do not define this record.

**Rendered QA is pending.** The prior localhost browser security denial remains in force, with no workaround used. There are no current desktop/mobile captures and no basis for claiming owner-approved branding or visual verification. `.impeccable/review/home-redesign-source-notes.json` records 58 detector findings: 49 old-design-system advisories and 9 warning instances. The warnings have not been declared clean; contrast, overflow, enlarged text and media-context findings still require rendered review. The finish verdict in `.impeccable/review/home-redesign-verdict.md` is `recapture`, requesting current full-page desktop (1440px) and mobile (390px) evidence before a new finish review. The source provenance scan covered 4 rasters with 0 missing records; provenance is not visual QA.

**Key Characteristics:**

- One shared type family, with a larger, tighter homepage hierarchy.
- A reference-led hero: invitation and action on the left; a tilted device with a light feed illustration and two feature links on the right.
- Broad graphite and gold homepage sections, with thin rules instead of a repeated card grid.
- Native expandable rows and training-mode radio controls, visible focus and native scrolling.
- One brief device entrance with bounded layered parallax and reduced-motion support.

## Colors

The frontmatter preserves the source color values. The `home-` prefix is documentation scope, corresponding to body or section overrides in the homepage stylesheet.

### Primary

- **Gold / Home gold:** small emphasis, heading emphasis, step numbers and disclosure icons on their respective light surfaces.
- **Gold field:** the homepage hero disc and closing action area, the shared specialist band and text selection. Program-type headings use this same light gold on graphite.

### Neutral

- **Background, text, muted and line:** the shared page ground, primary text, supporting copy and rules. Their `home-` equivalents apply throughout the homepage unless a section overrides them.
- **Home graphite:** the homepage programs area and footer. Programs use home-bg for light text, home-inverse-muted for supporting copy and home-inverse-line for rules. The footer retains the shared inverse-text, inverse-muted and inverse-line values.
- **Surface:** the shared contact panel. White, button-hover and button-disabled serve the shared action states; homepage actions add home-button-active.
- **Field and feedback colors:** input-surface, input-line, placeholder, invalid-line, error, success and success-surface belong to form controls and feedback. Focus is the visible keyboard outline.

The closing gold area uses a local brown supporting-text color (`#4c452e`), also present in the shared specialist band. Local decorative fills and device-frame colors are component details, not new palette roles. The sidecar's synthetic tonal ramps are preview aids, not additional production colors.

## Typography

The site self-hosts Google Sans under the CSS family **Deviny Sans**, with Arial and sans-serif fallbacks. The variable font declaration covers normal weights (400–700), uses `font-display: swap`, and ships with `assets/fonts/OFL.txt`. There is no separate display or monospace family.

The shared display, headline, title, body and label roles remain the baseline for nonhome pages. Homepage display and headline roles are explicitly scoped variants. Homepage first- and second-level headings use tighter tracking, while body text remains open and readable. Main home paragraphs range from (1rem) to (1.125rem), generally with line-height (1.7–1.75). Purchase information uses a smaller supporting size. The owner removed the hero platform caption and its device icon, plus the FAQ device-support claim, in all three languages.

The hero keeps its existing 1150px, 950px and 420px variants. People, programs, training and FAQ share one section-heading scale: clamp(2.35rem,4.2vw,3.75rem), line-height 1.1. Program-type headings use the subordinate clamp(2rem,2.8vw,2.75rem), weight 400. Closing copy uses clamp(2.75rem,5.2vw,5rem), line-height 1.08. Language controls retain shared 0.75rem text and a 44px minimum height.

## Layout

The shared container is capped at (1280px). The homepage raises that cap to (1320px). Both use `calc(100% - 112px)` until the shared gutters change to subtraction of (72px) at (1150px), (48px) at (800px), and (36px) at (620px). Shared section spacing remains in the unprefixed spacing tokens. The homepage's repeated people and training sections use the home-section rhythm; individual full-width bands have their own vertical padding.

On the homepage, the heading, explanation and actions form one left column, with a tilted device containing a light feed illustration on a solid gold disc to the right. The owner explicitly selected https://deviny.me/ as the composition reference while retaining the current typography and palette. Two floating feature links lead to partners and programs. They are navigation, not notifications, testimonials or evidence of adoption. Below 950px, text and actions precede the scene in a single column. Scene height is 660px on wide screens, 570px at 1150px, 620px when stacked at 950px, 550px at 700px and 480px at 420px. Stacked hero copy and actions are centered. The people link sits at the lower left and the graphite program link at the upper right, keeping the device top free. These are source facts; rendered responsive validation is pending.

The home component sequence is: introduction and device scene; people scenarios in native disclosure rows; a full-width graphite programs area; a training-mode explorer with a heading, introduction, short scenario copy and relationship diagrams; a ruled professional route; a centered FAQ container capped at (920px); and a full-width gold closing action. The FAQ text itself remains left-aligned. People, programs and the training introduction use equal columns with a shared fluid gap and become single-column at 800px. Each training scenario pairs copy with a diagram and stacks at 700px. Where `:has()` is supported, scenarios share one grid area and inactive panels use `visibility: hidden`, retaining the tallest panel's height. The closing area stacks at 950px. Section spacing is clamp(4.5rem,8vw,7rem), becoming 64px up to 700px.

The specialist and contact routes retain the shared typography and palette. About now combines product purpose with the responsive team grid; old team addresses redirect to its team section. Localized 404 pages use the same header, footer and recovery actions. Most shared two-column layouts stack at (800px). Team portraits use four columns, two at (1150px), then an auto-fitting grid at (620px). Navigation collapses at (800px), with JavaScript restoring desktop behavior at `min-width: 801px`. Homepage header height/logo overrides have a separate (700px) breakpoint; they do not move the shared menu breakpoint.

## Elevation & Depth

Color fields, crops and thin rules establish most depth. The shared action-hover shadow remains (`0 6px 16px #20282219`). The hero iPhone frame uses neutral offset drop shadows (`14px 28px 24px #00000021` and `2px 5px 5px #00000026`). The lower training diagrams use flat tonal fields without shadows.

The homepage device composition is the only automatic motion scene. Its focal sequence shows people and programs extending from the feed: the gold disc opens through a circular mask, a thin elliptical connection line draws, the device settles from 24px / 3° and the two feature links move outward by 18px. The whole entrance finishes within 1 second, with cubic-bezier(.16,1,.3,1). Default content is visible without JavaScript.

The iPhone retains its natural proportions and a −5° planar rotation. Pointer input over the whole hero is bounded to ±14px / ±9px; rotation varies by at most ±1.12°. Scroll contributes up to ±19.2px on larger screens or ±7.8px up to 700px. Foreground links and the gold backdrop move in opposing directions at different depths. Time-based interpolation produces the same settling rate across display refresh rates. Animation frames stop once settled, and temporary will-change hints are removed. Intersection and document-visibility state pause the entrance and stop the controller. Reduced motion clears all offsets and entrance effects, retaining a static composition and ordinary button feedback. No continuous animation, scroll capture or public pause control.

## Shapes

The shared controls and actions retain their established radii; homepage actions use a 12px radius. Floating feature links use a 16px radius (14px up to 420px) and offset neutral shadow. Their content is a compact editorial preview: paired illustrative portraits for people, a calendar symbol for programs and a directional arrow on both. The hero device uses Hoverify’s licensed iPhone 17 Pro Silver bitmap (1332×2748). Its screen opening is 1206×2622 at (63,63), with 186px corners, all mapped proportionally. The frame supplies the rim, bezel, side keys, antenna lines and Dynamic Island; CSS does not redraw them. Training diagrams use 16px panels, circular person nodes and a rounded program node; their radio labels use 12px corners. Device corners are specific to the mockup, not general container tokens.

Rules are generally (1px). The homepage graphite and closing gold bands span the viewport without rounded outer corners. The shared contact panel and team portraits retain their existing rounded shapes.

## Components

### Actions and links

Shared nonhome actions retain their existing styling. On the homepage, hero and closing actions share a 12px radius, 60px minimum height, 24px gap and gold circular arrow. At 420px and below, both use a 56px minimum height and more compact padding. The header retains its compact 46px height. Hover rotates the circular arrow; the existing pressed and keyboard-focus states remain.

Text links underline on hover. Their shared minimum height is (44px), raised to (48px) on home. Shared controls and native summaries keep the focus outline (3px), offset by (5px); training radio labels use a (4px) offset. The homepage footer uses a light gold focus outline against its graphite background; footer navigation, social and legal links have a 44px minimum target height.

### Navigation

The shared header and language links use muted text, changing to main text and an underline on hover/current state. The homepage header removes the bottom rule, increases desktop height to (100px) and logo width to (132px), then uses (82px)/(112px) at (700px). The compact header action is hidden at (1150px). The mobile menu is a vertical list with (50px) minimum link height. Its measured height and opacity transition over 300ms on opening and 220ms on closing; the two icon strokes become a cross. Escape and outside-click closing remain shared, with focus restored when needed. Desktop resizing clears collapsed/inert state. Without JavaScript, navigation stays available.

### Native disclosures

Homepage people scenarios use grouped native `details` elements with a common `name`; the first starts open. Native browser behavior controls expansion without JavaScript. With Web Animations available, the controller preserves grouping while animating measured heights (300ms open / 220ms close) and content opacity. A repeated click reverses from the current rendered size. Inactive content becomes inert immediately; aria-expanded and the plus marker follow the requested state. Browser-native reveal actions synchronize the enhanced state. Summaries use large medium-weight labels, a gold inline SVG plus, a hover color change and thin separators. The plus rotates (45deg) when open over (0.2s). No JavaScript is required.

The home FAQ uses independent native details rows, regular-weight summary text (1.125rem desktop, 1rem phone), the same rotating SVG marker and shared focus treatment. FAQ summaries have no separate authored hover color. Answers remain normal document text. Print styles expose the answer paragraphs; rendered print behavior remains unverified.

### App proof and illustrative imagery

The owner explicitly approved a feed mockup with people, posts and photographs after rejecting the exercise-library screenshot and the subsequent branded photo. The hero now contains two localized demonstration posts, fictional first-name profiles, photographs from the existing generated assets, the Deviny header and five navigation symbols. Its layout follows FeedView.swift (header, author/role, caption, media, reactions) in a light palette. It has no invented engagement counts, testimonials or verified badges. The whole mockup is a non-interactive image role with a localized description identifying demonstration content; its interior is hidden from assistive navigation. It is not a runtime screenshot. The owner subsequently rejected both the lower screenshot section and its generated training-partner photograph replacement. Those lower assets remain unused for history; the current lower section uses diagrams. The existing community photograph remains in the hero feed. Keep descriptive alt text in public markup and source/test-build qualifications in internal records.

### Training-mode explorer

Three native radios select solo, partner or program scenarios; partner is selected initially. Each scenario contains a short heading, explanation and genuine next-action link, paired with a CSS/SVG diagram connecting the person, optional partner or program, and workout. The diagrams are hidden from assistive technology because the story copy carries the meaning. This is an explanation of training situations, not a simulated app screen.

The selectors use a light neutral fill, graphite selected state and visible keyboard focus. Labels have a 54px minimum height, increasing to 58px up to 700px. CSS `:has()` progressively enables selection; without support the controls are hidden and all three scenarios remain readable. No new dependency is required. Selection crossfades the whole scenario over 260ms with an 8px vertical offset. Visibility is delayed until the outgoing fade finishes; a small progressive JavaScript enhancement makes inactive panels inert and aria-hidden immediately. Native radios and the CSS fallback remain usable without JavaScript. Reduced motion removes these transitions and transforms. Print hides the controls and diagrams and exposes all story text. These behaviors are source-derived and await rendered and keyboard verification.

### Shared fields and contact panel

Fields retain persistent labels, full-width input/select treatment and the control radius. Textareas have minimum height (145px). Invalid fields change border color; errors appear below the control, and success feedback gains a fill. Reply choices are native radio labels with a stronger border and pale fill when selected. There is no extra authored hover/disabled appearance for those choices.

The contact panel retains the surface color, panel radius and form-panel padding; padding changes to (28px) at (1150px) and (26px 20px) at (620px). Form rows use form-gap. Status text stays in document flow. The sidecar preserves these shared controls and adds source-derived homepage action/disclosure previews; it does not fabricate app UI or imagery.

## Do's and Don'ts

- **Do** keep homepage overrides scoped to the three homepages and preserve shared components on other routes.
- **Do** use the self-hosted Deviny Sans family with its fallback stack and license.
- **Do** preserve native disclosures and radios, visible labels, keyboard focus, native scrolling and reduced-motion behavior.
- **Do** keep image provenance internal and public image descriptions factual.
- **Don't** treat source documentation or provenance checks as rendered QA or owner-approved branding.
- **Don't** promote unused legacy styles, synthetic preview ramps or one-off photo/device details into general tokens.
- **Don't** present the illustrative feed or editorial photographs as runtime evidence, actual users or testimonials.
- **Don't** add a public motion pause control; preserve the brief entrance and system/visibility safeguards.


### Hero feed illustration

The device is 302px wide on wide screens, 254px at 1150px, 282px when stacked at 950px, 250px at 700px and 218px at 420px, additionally constrained to 60–62% of its scene width. It establishes an inline-size container; cqw units scale the internal screen as one illustration, without tiny focusable controls. Two posts use existing community-hero.webp and training.webp media, also cropped through CSS for avatars. Native app structure informs the composition, not pixel-exact app verification. The partner link sits at the lower left; the program link occupies the upper right below the phone’s top edge. Existing bounded parallax and reduced motion remain. Current source check: 15 pages, 399 local references, 72 image elements, 0 errors. Motion-controller behavior checks pass. No current rendered desktop/mobile QA.


### iPhone frame

The owner rejected the CSS-built chassis. The hero now uses the independently drawn, commercially licensed iPhone 17 Pro Silver frame from Hoverify, with original transparent pixels and built-in hardware. The approved feed sits beneath its screen aperture. The status bar uses the frame’s documented 62px safe area at the 402px viewport. The frame is decorative and hidden from assistive navigation; the feed retains its localized image description. Native aspect ratio, a −5° planar rotation and offset drop shadows replace the former perspective and handmade hardware. Bounded parallax is unchanged. No current rendered desktop/mobile QA is available.

### Hero composition follow-up

The owner approved the licensed frame and requested stronger harmony and a modern focal moment. Copy, product claims, the feed and the iPhone asset are preserved. The hero now uses a tighter text measure, a more prominent primary action with a gold arrow, one gold disc and a fine connection ellipse. People and program links differ in imagery and surface color. Only the hero is affected. Automated checks cover source links, image semantics and motion lifecycle; they do not replace visual/browser QA, which remains unavailable under the existing security restriction.

### Whole-page harmony pass

Historical pass, preceding the training-section replacement below.

The owner requested removal of the platform caption and a consistency check of the whole landing page. Removed the hero text/icon and the unsupported iPad FAQ claim across EN/RU/AZ. Shared section spacing, equal-column grids and one h2 scale now connect the people, programs and training sections. Program subheadings are visibly subordinate, closing typography is quieter, and the primary action repeats the hero treatment. Both product illustrations use one reusable iPhone-frame helper. Footer focus and touch targets are adjusted on the homepage only.

Source checks: 15 canonical pages, 402 local references, 75 image entries, zero errors. Existing motion behavior checks pass. Comparison confirms only the three homepage HTML outputs changed; 27 other HTML files are unchanged. Authored text contrast ratios checked are 5.35–8.81; these are color calculations, not rendered contrast measurements. Current browser visual QA remains unavailable under the earlier restriction. See `.impeccable/review/page-harmony-checks.json`.

### Training-section replacement

Historical implementation, superseded by the training-mode explorer below.

The owner rejected the lower exercise screenshot and the section as a whole. “From a plan to a workout” now follows the programs section with a short introduction, a wide editorial photograph and two notes about training independently or with a program, then sharing by choice. The second device, gold proof panel and numbered list have been removed. EN, RU and AZ carry equivalent copy. The lazy-loaded photograph has 1681×936 and 840×468 WebP variants, descriptive localized alt text and adjacent generation provenance. The original screenshot remains archived as an unused asset. Hero composition and motion are unchanged.

Source checks: 15 canonical pages, 399 local references, 72 image entries, zero errors; motion behavior checks pass. Only the three home HTML outputs changed, with 27 other HTML files unchanged. The asset was visually inspected; rendered page and mobile QA remain unavailable under the earlier browser restriction. See `.impeccable/review/training-story-checks.json`.

### Training-mode explorer replacement

The owner rejected the lower “From a plan to a workout” / “От плана — к тренировке” photograph as generic. The replacement uses native solo, partner and program radio scenarios, with partner selected initially, short explanatory copy and CSS/SVG relationship diagrams. It adds no raster, JavaScript or dependency. The rejected photo variants remain unused for history. Palette, typography, hero composition, `home.js` and other routes are unchanged.

Source checks: 15 canonical pages, 405 local references, 69 image elements, zero errors. Only the EN/RU/AZ homepage HTML outputs changed; 27 other HTML files are unchanged. All three preview routes return HTTP 200 and match the generated content; existing motion-controller checks pass. The prior browser security denial still prevents rendered QA, and no alternate browser or renderer was used. Radio operation, responsive layout and visual quality remain unverified; the review disposition stays `recapture`. See `.impeccable/review/training-modes-checks.json`.

### Interaction continuity — October 20, 2026

All local section links use native smooth scrolling. Same-origin document and language navigation opt into native cross-document View Transitions: a 220ms opacity crossfade, with ordinary navigation as the unsupported-browser fallback. No link interception or page-load delay is added. Form fields, reply choices, links and controls use short color/border feedback. Browsers supporting intrinsic-size interpolation and discrete display transitions also soften form validation and status appearance.

The shared motion variables are `--motion-fast: 160ms`, `--motion-state: 260ms`, `--motion-view: 220ms` and `--motion-ease: cubic-bezier(.16,1,.3,1)`. Height animations are bounded to an active menu or disclosure and restore natural sizing on completion. Resizing, hiding the document or enabling reduced motion settles active transitions. Reduced motion uses immediate state changes, ordinary scrolling and no page crossfade. Hero parallax and entrance remain unchanged.

Source checks pass for 15 canonical pages, 405 local references and 69 image elements. Behavioral checks cover interrupted/reversed transitions, stale completion, accordion grouping, browser-native reveal synchronization, focus, desktop menu reset, reduced motion and unsupported-feature fallbacks. These use simulated layout/WAAPI values and do not establish rendered smoothness. Current visual review remains unavailable under the prior browser security restriction. Evidence: `.impeccable/review/ui-motion-checks.json`.

### Architecture follow-through — October 20, 2026

The information architecture now has four core page types in three languages, plus localized noindex 404 pages and team-address compatibility redirects. The header explicitly labels People, Programs, Specialists and Get started; the footer links to About (including the team), Specialists, Contacts and the home FAQ. Specialist-page header and closing actions both use the specialist inquiry. Contact-page headers omit the redundant self-link action.

People explain whom to find, programs explain author/content choice, and training uses a four-step concrete workflow per native-radio scenario. The partner scenario connects discovery, chat, training and its GymBro record. This is a semantic explanation, not a runtime app screenshot or fabricated customer evidence. The approved hero device, feed and motion remain. About replaces its repeated feature catalogue/photo with two short purpose/choice statements, the four existing team members and a collaboration action.

Contextual contact headings explain the selected action. The owner’s launch correction removes access requests entirely. Support, specialist questions and collaboration require a name, reply contact and meaningful message. A small topic-change action keeps context switchable without losing input. Topic changes use a short opacity acknowledgment when motion is allowed. Success, delivery failures and timeout states retain honest next steps. Shared colors, type, radii, focus and prior motion tokens remain the visual authority. Native 404 recovery provides a home action, contact and language navigation.

Source checks, contact mocks, navigation/compatibility checks and prior motion behavior tests pass. Current page rendering/actual smoothness remain unverified under the earlier browser restriction. Public legal-document probes return Cloudflare 1010; sibling drafts are not published. See `.impeccable/review/architecture-checks.json`.

### Store launch correction — October 20, 2026

The consumer path uses paired App Store and Google Play buttons in the hero and closing block. Both are graphite, with compact store icons and labels; they wrap naturally and center with the hero on small screens. The header and training links lead to the stores section. Future-release copy is explicit without inventing a date. The approved iPhone scene and existing hero motion remain. Store URLs are owner-authorized generic storefront placeholders in distribution.json. Contacts are only for questions, support and partnerships; specialist inquiries are optional, never an access prerequisite. Source and isolated behavior checks pass; no new rendered visual QA is claimed.

## Audit follow-through — October 20, 2026

The owner authorized the fresh audit recommendations. Hero copy now connects partner/specialist discovery to actual training and explicitly includes independent workouts; its approved heading, feed/device assets and parallax remain. People explain whom to find, programs explain content/author choice, and training explains action. GymBro is defined on its first visible mention. Training introductions and step descriptions are shorter; the selected four-step route has a single staggered node/connector acknowledgment (460–800ms total), with immediate reduced-motion fallback and no idle loop. Section spacing is slightly tighter. Mobile scene height decreases from 550 to 480px (<=700px) and from 480 to 420px (<=420px), with proportionate device sizes.

Specialists now have the same App Store/Google Play install path as consumers. Header download stays on the specialist page; both hero and closing show the two store buttons and future-release note. Questions remain secondary text links. Offer-clarity copy addresses the professional author. Shared store styling moved to global.css. No subscription/access gate, reviews, adoption counts, additional pages, dependencies for the website runtime, live form submissions or deployment were added.

Localized 1200×630 PNG social cards use the existing font and code-drawn brand geometry; Open Graph and large-card metadata reference these assets on every canonical/utility page. scripts/build-social.py is an authoring-only Pillow exporter, while scripts/build.py remains Python-standard-library-only. Cards are committed outputs; no deployment image processing is required.

Validation: static checks pass (12 canonical pages, 3 utility pages, 6 legacy redirects, 408 local references, 66 images), including social PNG dimensions and both store buttons on consumer/professional pages. Contact, navigation, UI-motion and hero-motion suites pass. HTTP source checks pass on home/specialists in EN/RU/AZ and all 3 PNG assets. The RU social card was inspected as an asset; no fresh site rendering, mobile layout, accessibility conformance, conversion or real-device smoothness is claimed under the earlier browser restriction.

Release-dependent work remains: replace authorized storefront placeholders with actual app listings and update future-release copy when released; connect store-click measurement to the chosen analytics setup after launch. Current data-store attributes identify each destination. No tracking service was introduced without an existing analytics destination.

## Specialist hero — October 20, 2026

The owner requested a more interesting first section on the professional page. The hero keeps the established off-white, graphite, gold and self-hosted typography, but uses a larger editorial headline (“Ваша практика. В одном месте.”) beside a single tilted graphite workflow composition. Three connected semantic list items describe real professional tools: programs, clients and scheduling. There are no fabricated clients, metrics, prices, app controls or dashboard screenshots. A gold field and drawn orbit connect the scene to the approved consumer identity. Both store actions and the optional question remain in the copy column. Existing trainer/nutritionist descriptions become a two-column open strip below the scene, stacking on narrow screens.

Only specialist pages load specialists.css. At <=800px the workflow becomes a compact three-column sequence; at <=480px the audience strip stacks. The graphic has a brief 850–950ms entrance/line draw, no loop, and a static unrotated reduced-motion version. Normal text and controls are visible by default. Other pages, routes, form integration, launch placeholders, shared interactions and all lower specialist sections remain unchanged.

Verification: generated EN/RU/AZ sources and HTTP routes pass. Static checks: 12 canonical pages, 3 utility pages, 6 legacy redirects, 411 local references and 66 images, zero errors. Existing contact, navigation and UI-motion behavioral suites pass. Detector has only the pre-existing print-style contrast/palette signals and the known gold-section palette advisory; no new hero signal. Fresh browser rendering, mobile geometry, measured performance and actual animation smoothness remain unverified under the earlier browser restriction.

## Professional getting-started route — October 20, 2026
The owner rejected the dense text in “Как начать работу.” Replace the two-column text list with a single open three-stage route: profile → document review → program publication. Distinct code-native SVG diagrams illustrate the task, not a product screenshot or an already-approved account. Numbered nodes connect horizontally on desktop and vertically below 700px. Each step has a short heading and instruction; the review prerequisite is explicit beside the document stage. All three locales are updated. No new interactions, animation, assets, runtime dependencies or changes to the hero/lower sections. Static checks pass: 12 canonical, 3 utility, 6 redirects, 411 references, 66 images. HTTP/source checks confirm all three stages, approval prerequisite and retained store actions in EN/RU/AZ. Detector shows only existing print/palette signals. Fresh rendered layout remains unavailable under the prior browser restriction.

## Client trust section — October 20, 2026
The owner requested the same visual clarity for “Что важно вашим клиентам.” Replace the three plain text columns with a graphite section: two open illustrated features (professional identity/documents and program content before choosing), a separate offer-clarity row, and a team-contact row with a real mailto link. The SVG diagrams are conceptual; they contain no invented approval, qualifications, prices or customer evidence. Shortened offer copy explains program/support/consultation scope without assuming every offer is paid or includes all services. Gold and light text use the existing dark-section palette. At <=800px the two features stack; narrower illustrations preserve room for copy on phones. No new motion, interactions, raster assets or runtime dependency; hero, onboarding, closing/store paths and forms are unchanged.

EN/RU/AZ source/HTTP checks pass, including two illustrated features, offer terms, real email, retained onboarding prerequisite and both store actions. Static validation: 12 canonical, 3 utility, 6 legacy redirects, 411 references, 66 image elements; zero errors. Detector output remains limited to print-style/palette signals; the new #aaa border signal is inside @media print. Fresh rendered layout and mobile appearance remain unverified under the earlier browser restriction.

## Full feature visibility — October 20, 2026 (historical; superseded below)
The owner explicitly requested all product highlights on the landing page, including clubs and useful chat capabilities. This supersedes earlier brevity decisions that reduced social features to a single sentence. A visible “Inside Deviny” index replaces the abbreviated People accordion, while retaining legacy support/how-works/why-choose anchors. Header and hero exploration links lead to the new overview; five topic anchors allow direct navigation. All 28 entries are present without expansion, selection or JavaScript.

Five open chapters cover community (clubs, shared challenges, activity/rankings, discussions, feed/likes/comments/reposts, friends/follows, GymBro); chat (direct messages, photos/voice, audio/video, notification/read states); training (exercise filters/technique demonstration, session logging, history/repeat, Journey, achievements/levels, leaderboards); programs (training/nutrition, author/documents/reviews, global search/filters, purchased content/current step, role-dependent professional tools); and personal space (profile/sharing, visibility, reporting/blocking, PIN/biometrics, three languages/themes, referral invites). Existing program/training workflow sections explain the path in more depth. Store launch placeholders, approved hero/device/motion, specialist pages and contact integration remain.

Clubs use an ivory surface; communication uses graphite/gold; the remaining chapters use open two-column definition lists and dividers. Below 800px category headings stack above their features; below 520px individual entries become one column. All text is visible by default and no new animations, raster assets, dependencies or tracking were introduced. Native code and Backend were inspected read-only; no native/source/backend changes or real messages were made. The source coverage and boundaries are recorded in docs/evidence/landing-feature-coverage-20261020.json. API-only club chat/events/announcements, unsupported chat conveniences, postponed subscriptions and security/commerce guarantees are not invented as shipped features.

Validation: 12 canonical pages, 3 utility documents, 6 legacy redirects, 426 local references and 66 image elements; zero static errors. HTTP/source checks verify the same 28 unique capabilities, all five categories and store actions in EN/RU/AZ. Existing UI-motion, hero-motion and navigation suites pass. Detector border/padding warnings correspond to outer section dividers with 32–48px inner padding; print-only palette/contrast signals are not treated as measured screen defects. Fresh browser/mobile rendering and actual performance remain unverified under the earlier browser restriction.


## Distributed feature story — October 20, 2026

This ordinary homepage extension supersedes the five-topic index described above; that earlier section remains a historical record. The established typography, palette, global tokens and approved first viewport are preserved. Source in `scripts/build.py` and `home.css` now distributes all 28 confirmed feature IDs once per locale through distinct semantic sections: an open people/GymBro split; a gold club emblem with club life; author/content choice beside two program-format sheets; a graphite communication poster; the existing training-mode route followed by exercise, editor and history tools; staggered open progression; a quiet privacy/choice composition; and the professional-tools link. FAQ and paired store actions close the page.

The program sheets stack at widths up to 520px with automatic content height, 24px headings and 15px body copy. This source override follows the smaller-phone rules and resolves the earlier narrow-column source risk. Other section layouts collapse through the existing responsive breakpoints. All capability copy is present in HTML without opening an index or running JavaScript. Existing hero/device assets, brief motion, training interactions, anchors, launch placeholders and three-language coverage remain. No rasters, fonts or dependencies were added; no app/backend changes, submissions or deployment occurred. These section-specific forms do not establish new global tokens.

Verification supplied by the build handoff: static checks pass for 12 canonical pages, 3 utility documents, 6 redirects, 414 local references and 66 image entries. HTTP/source checks confirm all 28 feature IDs exactly once and both store actions on each EN/RU/AZ homepage. UI-motion, hero-motion and navigation suites pass; simulated behavior and HTTP/source checks do not establish rendered geometry, mobile readability, accessibility conformance or animation smoothness. The single detector record is `.impeccable/review/distributed-story-detector.json`; print and padding findings were considered in their source context, not certified visually clean.

The independent finish reviewer returned **recapture**: no verified material source defect was identified, and the mobile sheet source risk is resolved, but no current page screenshots exist. The earlier browser security denial prohibits localhost/browser rendering, Playwright, capture and alternative rendering workarounds. Current desktop/mobile visual acceptance remains pending; this documentation records the implemented source and evidence limit, not a visual pass.


## Editorial illustration curation — October 20, 2026

The owner requested fewer icons and selective meaningful pictures while preserving readability. The homepage now uses two transparent illustrations in the existing off-white, graphite, sage and gold palette: a fictional four-person community scene in clubs, and a three-level podium/trophy beside rankings. These replace the club emblem and support a new progression composition; they are decorative companions to complete semantic copy, not product screens or evidence of members/awards. GymBro avatars, program/search icons, chat signal/bell icons and the privacy lock ornament are removed. Ordered training steps use numbers. The approved hero/device/motion, all 28 capability IDs once per locale, store pairs and public copy remain.

Both assets were generated with built-in image_gen. Original alpha is preserved; only proportional resize and WebP export were applied. Desktop exports are 1080×810, small exports 560×420; both combined are 251170 and 90252 bytes respectively. Images use lazy loading, responsive srcset, intrinsic dimensions and empty alt/aria-hidden because adjacent text supplies the meaning. Exact prompts, source originals and hashes are in docs/evidence/editorial-illustration-*.json and the four WebP sidecars. Prompt storage is a JSON sidecar fallback, not embedded WebP metadata. Program sheets retain a single column and natural height below 520px, without an empty icon gutter. These are section-specific treatments, not new global design tokens.

Build and static validation pass: 12 canonical, 3 utility, 6 redirect documents, 420 local references, 72 image elements, zero errors. HTTP checks confirm current files, all 28 capabilities exactly once and two store pairs per homepage in EN/RU/AZ; four illustration assets return 200 with matching hashes. UI-motion, hero-motion and navigation suites pass. Independent source review returned recapture with no material source defect. Fresh rendered desktop/mobile proportions and visual acceptance remain unavailable under the prior browser security restriction; no workaround rendering was used. Evidence: .impeccable/review/editorial-illustration-checks.json and editorial-illustration-review.json. No deployment or sibling-source change.


## Expanded pictorial story — October 20, 2026
The owner clarified that clubs and podium were examples, not an exhaustive list. This supersedes the previous two-image limit. Four additional built-in image_gen scenes now carry other meanings: GymBro partners preparing together; a program/nutrition still life; a woman recording a voice message; and workout equipment. Alongside clubs and rankings, these form six distinct editorial accents. Privacy, professional navigation, FAQ and closing stay typographic; the approved hero is unchanged. No public copy, capability, claim or action was added or removed.

Each scene has its own composition: GymBro pairs art with short partner details; programs replace tall rotated sheets with one shared still life and two compact format descriptions; communication places a human scene above its two media formats on graphite; training places equipment beside its intro and keeps the interactive route below. At <=650px the compositions stack; at <=420px program/chat descriptions become single-column. Text stays outside pictures. Images have intrinsic dimensions, responsive WebP variants, lazy loading and decorative accessibility markup. No new motion or runtime dependency.

The four new desktop exports total 366596 bytes; 560px variants total 132034 bytes. All original alpha is preserved; only proportional resize and WebP encoding were applied. Exact prompts and source paths: docs/evidence/editorial-expansion-{prompts,sources}-20261020.json. Every export carries a JSON sidecar with prompt, source, dimensions, processing, bytes and SHA-256.

Validation passes: build; 12 canonical/3 utility/6 redirect documents; 432 local references; 84 image elements; zero static errors. HTTP/source checks confirm all 28 capabilities once per locale, six editorial scenes and two store pairs on each homepage, and matching files for all 12 illustration variants. Hero-template and localized-copy hashes match the baseline. UI-motion, hero-motion and navigation behavioral suites pass. Independent source review: recapture, no established material source defect. Current rendered desktop/mobile proportions remain unaccepted under the earlier browser security restriction; no renderer workaround was used. Evidence: .impeccable/review/editorial-expansion-{checks,review,baseline}.json. No deployment or app/backend source change.


## Illustration removal — October 20, 2026
The owner rejected the cartoon/stylized picture treatment. This supersedes both editorial-illustration decisions above. All six generated editorial images are removed from every locale homepage, and the image helper/image-only CSS selectors are removed. Assets and prompt provenance remain unused on disk for history. No replacement imagery or decorative icons were added. GymBro is a single quiet panel, clubs use a text-led introduction, program formats stay compact, communication has vertical formats, training intro is h2 plus paragraph, and progress has three direct responsive text columns. Hero and localized copy hashes are unchanged; all 28 capabilities and paired stores remain. Build/static/HTTP source checks pass (12 canonical, 3 utility, 6 redirects, 414 references, 66 images, zero errors; no rejected-image references in EN/RU/AZ). Independent source review found no established defect; disposition recapture because fresh browser rendering remains unavailable under the prior restriction. Evidence: .impeccable/review/illustration-removal-checks.json. No deployment.


## Product scenes and visual rhythm — October 20, 2026
The owner rejected the text-only result after removing cartoon imagery. This refinement preserves the existing visual identity and approved hero, and replaces four paragraph-led compositions with purposeful product scenes: GymBro discovery relationships and city/time/goal criteria; a club network whose three links lead to the relevant feature descriptions; training/nutrition previews with a three-step route; and text/photo/voice conversation previews. The two selectors have real local behavior. Chat content is fictional illustrative dialogue, not real member evidence or an exact native screenshot. Its photo reuses the existing approved community-hero.webp. Previously rejected training-together, exercise screenshot and all six stylized illustrations remain unused.

No new raster or dependency. The narrative CSS tail was consolidated instead of adding another override layer. Core feature copy and all 28 capability IDs remain; only new scene labels/examples were localized in EN/RU/AZ. The first-viewport template hash is unchanged. New product-scenes.js provides roving tabs, arrows/Home/End, focus visibility, inactive-panel inert/aria-hidden, stable grid height and a readable no-JS fallback. CSS transitions respect reduced motion. The waveform is a static representation with no misleading play button; no messages, audio or network requests are sent by previews.

Build/static checks pass: 12 canonical, 3 utility, 6 redirects, 429 references, 69 images, zero errors. HTTP confirms current three-language output, two widgets/five panels, all 28 unique capabilities, unchanged store pairs and served styles/scripts. Product-preview keyboard/focus/isolation tests and existing UI/hero/navigation suites pass. Independent source review initially caught accidental reuse of the historically rejected photo; it was removed before delivery, and targeted confirmation found that issue resolved with no further source defect. Disposition remains recapture: browser rendering remains unavailable under the prior security restriction, and no visual acceptance or actual-device smoothness is claimed. Evidence: .impeccable/review/product-scenes-checks.json. No deployment, native/backend modification or contact submission.


## Lower sections refinement — October 20, 2026
The owner explicitly requested removal of the entire communication section and a more engaging progression, personal-space and FAQ treatment. This supersedes the requirement to retain all 28 standalone capability entries on the homepage: the four communication entries are intentionally removed with the section; the other 24 remain once per locale. Program previews, hero, people/clubs and training remain.

Progress uses graphite with an open two-point journey and a flat CSS podium representing ordinal places 2/1/3, without fabricated users or performance data. Personal space places profile/appearance/invites beside a local light/dark appearance preview containing privacy/safety/app-lock explanations. Native radio controls affect only this preview, not accounts or the site theme; :has fallback hides unsupported controls, keyboard focus and reduced motion are provided. FAQ has an introductory/support column and four grouped native disclosures; the first answer is open, and the existing interruption-safe animation controller handles transitions. No new raster or runtime dependency.

Build/static/HTTP checks pass on EN/RU/AZ: 12 canonical, 3 utility, 6 redirects, 429 local references, 66 images, zero errors. All24 intended entries, theme controls, podium, first-open grouped FAQ and support route confirmed. Existing program-preview, disclosure/UI motion, hero and navigation suites pass. Independent source review found a duplicated heading selector introduced while removing chat CSS; corrected to .programs-story h2 and checked in source. No other source defect reported. Disposition recapture: current browser rendering remains unavailable under the earlier security restriction. Evidence: .impeccable/review/lower-sections-checks.json. No deployment or live submissions.


## Realistic editorial imagery — October 20, 2026
The owner requested generated realistic imagery and selective icons. Three new photographic illustrations now support the homepage: recreational runners in the clubs section replace its previous relationship diagram; strength equipment/notebook and a food bowl appear in their respective program tabs. These are fictional editorial scenes, not real Deviny members, testimonials, native UI or prescribed nutrition. The approved hero, GymBro diagram, training interactions, progression podium and FAQ remain. Three small authored eye/shield/lock SVGs accompany privacy headings and inherit preview-theme colors. Communication remains removed and the other 24 capabilities remain once per locale.

All three photographs were generated using built-in image_gen. Six opaque proportional WebP exports (1080px and 560px) live in assets/product; exact prompts, source paths, dimensions, processing and hashes are preserved in their .webp.json sidecars and docs/evidence/realistic-media-{prompts,sources}-20261020.json. Large exports total 342,352 bytes; small exports total 120,214 bytes. Responsive images have explicit intrinsic dimensions, localized alt text, lazy loading and async decoding. Club imagery preserves its natural aspect; program imagery shares a 2.2:1 display ratio to keep tab geometry consistent. No rejected imagery was restored. No new runtime dependency or animation was added.

Build/static validation passes: 12 canonical pages, 3 utility pages, 6 redirects, 438 local references and 75 image elements; zero errors. EN/RU/AZ HTTP/source checks confirm all photos, decorative privacy icons and 24 retained capabilities; the hero template hash is unchanged. Product-preview, disclosure/UI-motion, hero-motion and navigation behavioral suites pass. Independent read-only review found no material source defects; sidecar hashes, no-JS program availability and anchors were checked. Disposition: recapture. Browser rendering remains unavailable under the earlier security restriction, so actual crops, mobile composition and rendered visual acceptance are unverified. Evidence: .impeccable/review/realistic-media-checks.json. No deployment.
