> Актуальный первый экран изменён по референсу владельца: [hero-reference-20261018.md](hero-reference-20261018.md). Панорамный hero и его движение ниже — история предыдущей версии.

# Новая главная — последний дизайн-проход, 18 октября 2026

Главная полностью заменена: новый шаблон, `home.css`, `home.js` и фотография `community-hero.webp`. Генерация и проверка: 15 страниц, 372 локальные ссылки/ресурса, 51 img-вхождение, 0 ошибок. JS syntax прошёл; локальные home-адреса и ресурсы отвечают HTTP 200. Проверка provenance: 4 растра, 0 missing.

**Rendered QA отсутствует.** Независимый reviewer вернул `recapture`, поскольку нет текущих full-page 1440/390 px. Ранее полученный browser-policy отказ localhost не обходился. Старые снимки и успешные source-checks не являются визуальной проверкой. Detector этого прохода: 58 находок, не чистый результат; после него нейтрализована цветная тень. Подробности: [отчёт переработки](home-redesign-20261018.md), `.impeccable/review/home-redesign-source-notes.json`, `home-redesign-verdict.md`.

Ниже — история предыдущих состояний.

---

# Исправление после обратной связи о позиционировании — 18 октября 2026

Владелец отклонил определение Deviny как журнала/трекера и подтвердил связь людей, специалистов, программ и совместных тренировок. Тексты RU/EN/AZ, порядок блоков, about/footer и метаданные исправлены. Журнал показан позднее как инструмент внутри общего процесса. Предыдущие оценки ясности текста ниже не подтверждают правильность отклонённого позиционирования. Актуальная логика: [исправление позиционирования](positioning-correction-20261018.md).

Проверки этого исправления: `.impeccable/review/positioning-checks.json`. Текущая браузерная отрисовка не проверена из-за ранее полученного отказа политики localhost; новый обход не предпринимался. Это проверка источников и HTML, не конверсии или runtime приложения.

---

# Аудит структуры и текста — 18 октября 2026

Текущая версия пересобрана по исходникам iOS master `13cc2ce` и Backend master `a8e64ba`. Проверены роли, журнал, повтор тренировок, программы и условия сопровождения; подробности в [аудите](landing-message-audit-20261018.md). Исходники продукта не изменялись. Независимое чтение текста: пять исходных замечаний закрыты, одно закрыто частично — нет актуальных экранов записи подходов и истории. Во всех трёх языках удалено обещание бессрочного доступа, а состав сопровождения привязан к конкретному предложению.

Последний source-check: **15 canonical-страниц, 366 локальных ссылок/ресурсов, 51 img-вхождение, 0 ошибок**. Генерация, синтаксис JavaScript и `git diff --check` прошли. Все основные действия используют локализованную тему доступа; условные App Store/TestFlight-сценарии проверены в памяти без записи тестовых URL в публичные страницы. `iosInstallUrl` остаётся `null`. Проверены отсутствие подписки, служебных подписей и управления анимацией, отсутствие таблицы пакетов на главной. Preview EN/RU/AZ отвечает HTTP 200.

Детектор этого прохода вернул **36 source-предупреждений**, а не чистый результат: 12 о контрасте, 9 о мелком тексте, 6 об отступах, 6 о цветах вне общей шкалы и 3 о радиусе телефона. После него размер языковых ссылок поднят до 12px, добавлены явные светлые print-поверхности. Статический детектор смешивает media-контексты и не подтверждает вычисленный контраст; отступы и намеренная рамка телефона требуют проверки отрисовки. Повторно детектор не запускался; предупреждения не объявлены закрытыми. Артефакты: `.impeccable/review/message-static-checks.json`, `message-structure-checks.json`, `message-detector.json`, `message-review.json`.

**Текущая браузерная проверка по-прежнему отсутствует:** доступ к localhost отклонён политикой browser-инструмента, обход не выполнялся. Нет оснований заявлять проверенные адаптивность, увеличенный текст, конверсию или понимание страницы всеми посетителями. Native-сценарии в этом текстовом изменении повторно не запускались. Новые screenshots не создавались; расположенные ниже результаты относятся к предыдущим состояниям.

---

# Текущая визуальная версия — 18 октября 2026

После замечания о production убраны все подписи с происхождением изображений и тестовой сборкой, а также кнопка управления анимацией. Автоматическая анимация однократная, 4,2 секунды; параллакс и reduced-motion сохранены. FAQ, контакты и предложения переписаны для посетителей. Проверены все 15 сгенерированных страниц на отсутствие служебных надписей; отчёт `.impeccable/review/public-copy-checks.json`.

Первый экран дополнительно переработан в цельную обложку с изображением, заголовком и действием; настоящий экран приложения перенесён к описанию тренировочного сценария. На мобильном фото располагается над текстом на сплошном фоне. Повторная генерация, JS syntax и проверка 375 локальных ссылок/ресурсов прошли. Layout-детектор вернул `[]`: `.impeccable/review/hero-cover-static-checks.json`, `hero-cover-detector.json`. Это проверки исходников; актуальных browser-captures по-прежнему нет.

Предыдущий светлый редизайн после обратной связи реализован в `global.css`, `scripts/build.py` и `script.js`; обновлены 15 страниц. Генератор и проверка 384 локальных ссылок/ресурсов прошли, JavaScript прошёл `node --check`, `git diff --check` ошибок не нашёл. Детектор Impeccable вернул пустой список. Девять пар цветов из CSS расчётно соответствуют AA для обычного текста (минимум 5.01:1); это не аудит вычисленных стилей браузера. Артефакты: `.impeccable/review/static-checks.json`, `detector.json`, `color-contrast.json`.

**Браузерная проверка новой версии не выполнена.** Инструмент отклонил доступ к локальному адресу по browser security policy; обход блокировки не выполнялся. Текущих снимков desktop/mobile нет. Независимый finish-reviewer вернул `recapture`: требуется новая визуальная проверка. Адаптивность, увеличенный текст, контраст поверх изображений и состояния формы после смены CSS нельзя считать подтверждёнными прежними проверками. Preview отвечает HTTP 200 по `http://127.0.0.1:4173/ru/`.

Ниже сохранён исторический отчёт предыдущей тёмной версии. Его измерения и снимки относятся к сентябрьской реализации.

---

# Результаты проверки — 24 сентября 2026

Реализация проверена локально на macOS в Chromium-браузере Codex. Публикация и реальные отправки формы не выполнялись. На `deviny.me` по-прежнему опубликована старая версия; `CNAME` сохранён.

## Обновление первого экрана после обратной связи

Первый экран переработан: новый заголовок, многослойная композиция из реального экрана приложения и приветственной иллюстрации, параллакс мыши/прокрутки, плавное движение слоёв, бегущая линия и появление следующих секций. Кнопка паузы доступна с клавиатуры; предпочтение сохраняется в текущей вкладке. Вне viewport и в неактивной вкладке движение первого экрана приостанавливается; системный reduced-motion отключает эффекты.

После этой правки повторно проверены главные страницы EN/RU/AZ: 12 сочетаний 360/390/768/1440 px без горизонтального переполнения; 6 проверок текста 200%; 6 запусков axe при 390/1440 px без нарушений. Проверены реакция на курсор, изменение слоёв при прокрутке, остановка вне экрана, пауза/возобновление с клавиатуры. Reduced-motion проверен локальной эмуляцией matchMedia при загрузке страницы, а не сменой системной настройки. Снимки главной в галерее обновлены.

Доказательства: `evidence/hero-motion-responsive.json`, `evidence/hero-motion-a11y.json`, `evidence/hero-motion-interactions.json`. Остальные страницы и форма сохраняют результаты предыдущего полного прохода ниже.

## Автоматические и браузерные проверки

| Проверка | Фактический результат | Доказательство |
|---|---|---|
| Генерация | 15 статических canonical-страниц EN/RU/AZ, 12 совместимых адресов без расширения | `scripts/build.py` |
| Ссылки и SEO | 360 локальных ссылок/ресурсов, 54 img-вхождения; 0 ошибок. Один h1/main, уникальные ID, canonical/OG, взаимные hreflang, размеры/alt, sitemap, неизменные CNAME и Web3Forms | `evidence/static-checks.json` |
| Адаптивность | 60 сочетаний: 5 страниц × 3 языка × 360/390/768/1440 CSS px. Горизонтального переполнения и битых видимых изображений нет | `evidence/responsive.json` |
| Доступность axe-core 4.13.0 | 30 сочетаний: все страницы/языки при 390 и 1440 px. **0 обнаруженных нарушений WCAG 2/2.1 A/AA**. Это автоматический аудит, не сертификация | `evidence/accessibility.json` |
| Текст 200% | Базовый размер 16 → 32 px через QA-стиль; 30 сочетаний страниц/языков при 360 и 1440 px, без горизонтального скролла | `evidence/text-scale.json` |
| Форма | 19 зафиксированных сценариев: пустые поля, неправильный email/короткий текст, Telegram, WhatsApp, success/HTTP error/network/malformed на трёх языках, повтор после ошибки, блокировка дубликатов | `evidence/form-checks.json` |
| Навигация | Путь атлета и специалиста, тема обращения, мобильное меню/Escape, клавиатурный FAQ, skip-link, язык с якорем и черновиком, старые `?lang=`, `#pricing` и `/about` | `evidence/interactions.json` |
| Без скриптов страницы | Основное содержимое и навигация видимы; native FAQ работает. Проверено на тестовой странице с удалёнными script-тегами. Mailto и noscript fallback присутствуют в HTML | `evidence/interactions.json` |
| Юридические ссылки | Privacy и Terms действительно открылись в браузере. urllib получил 403 от сервера, что отдельно зафиксировано | `evidence/legal-browser-check.json` |
| Изоляция репозиториев | HEAD и tracked diff iOS/Backend совпадают с состоянием до работы | `evidence/source-state-before.json`, `evidence/source-state-after.json` |

Axe оставил ручную проверку контраста подписей поверх изображения на главной и About. Подпись `#D9DDE3` имеет подложку `#050607` с alpha 217/255; даже на полностью белом изображении расчётный контраст **10.40:1**. Видимый focus, переносы, изображения и ключевые страницы просмотрены в браузере. Скринридер VoiceOver и отдельный Safari-сеанс не тестировались.

В ходе QA исправлены: потеря выбранной темы при смене языка, слишком мягкая проверка номера WhatsApp, возможность редактировать отправляемый текст во время ожидания, переполнение при увеличении текста, скрытие skip-link при 200% и скачок мобильного меню при первом отображении.

## Производительность

Шесть локальных измерений главной страницы, без ограничения CPU/сети, при 390 и 1440 CSS px. Использованы браузерные PerformanceObserver и Navigation/Paint entries. Наблюдение первого экрана завершалось через 500 мс после выполнения axe; это диагностическое измерение localhost, а не полевые Core Web Vitals и не Lighthouse.

| Язык | Ширина | Наблюдавшийся LCP | Наблюдавшийся CLS |
|---|---:|---:|---:|
| EN | 390 | 208 мс | 0 |
| RU | 390 | 172 мс | 0 |
| AZ | 390 | 192 мс | 0 |
| EN | 1440 | 108 мс | 0 |
| RU | 1440 | 200 мс | 0 |
| AZ | 1440 | 184 мс | 0 |

Запрошенные ресурсы страницы (без документа и временного axe) — около 233 KB на узком экране и desktop; браузер также предварительно загружал ближайшие lazy-изображения. Реальный экран приложения — около 51 KB WebP, иллюстрация — около 124 KB. Внешних шрифтов, иконковых библиотек, фреймворков и аналитики в новой странице нет. Детали: `evidence/hero-motion-performance.json`, `evidence/asset-provenance.json` (первоначальное измерение сохранено в `evidence/performance.json`). Оценка Lighthouse не заявляется; production latency и мобильную сеть нужно измерять после разрешённой публикации.

## Форма и границы проверки

Web3Forms URL и публичный access key прежние. Mock существует только в локальном preview-сервере. Успех появляется исключительно после HTTP success и JSON `success: true`; при ошибке поля остаются заполненными, кнопка снова доступна. Во время медленного ответа повторные Enter дали один запрос. Telegram-контакт после ошибки дополнительно проверен визуально: DOM-представление инструмента скрывало значение этого поля, хотя оно оставалось на экране.

Реальная доставка в почтовый ящик и получатель ключа не подтверждались отправкой. Сервис, получатель и production-настройки не менялись.

## Снимки и native

Открыть [сравнение до/после и галерею](review.html). «До» — опубликованный русский сайт, «после» — локальная реализация, одинаковые CSS-ширины 390/1440 px. Снимки показывают viewport; в галерее также есть отдельные блоки главной, страницы специалистов/команды/контактов и состояния формы.

Native-сборка iOS и Keychain smoke-test прошли; **это не полное end-to-end тестирование продукта**. Доступные сценарии и ограничения перечислены в [продуктовом аудите](product-audit.md). Исходники iOS и Backend не изменялись.

Оставшиеся решения владельца и команды перечислены в [передаче реализации](implementation.md): ссылка скачивания при её появлении, коммерческие условия и фактический запуск сопровождения, сведения команды, контрольное письмо и отдельное разрешение на deployment.


## Architecture follow-through, October 20, 2026

Current local source check: 12 canonical pages, 3 localized utility 404 pages, 6 legacy team redirect documents, 414 local references, 66 image entries, zero errors. Old extensionless core addresses remain identical aliases. About contains the existing four team profiles and old team addresses redirect to its team section. Specialist header/hero/closing actions share the specialist inquiry. Each training scenario has a concrete four-step workflow.

`check-contact-flow.cjs`, `check-navigation.cjs`, `check-ui-motion.cjs` and `check-home-motion.cjs` pass. Contact tests cover all locales, access with only reply contact, optional comments, topic changes, channels, drafts, payload intent, success/failure/network/malformed/timeout and duplicate protection. No live messages were sent. Navigation tests cover localized 404, language query precedence, restored draft limits and legacy team paths. DOM/layout/WAAPI values are simulated, not browser render evidence.

All 12 canonical preview routes return HTTP 200 with the generated bytes. Missing routes at EN/RU/AZ return custom HTTP 404 recovery pages in the corresponding language. Current CSS and JavaScript are served. Browser/capture restriction still prevents fresh rendered verification.

Separate external probes return HTTP 403 / Cloudflare 1010 at the edge for both legal URLs, with no origin availability established. Backend October 9 source legal files are labelled drafts awaiting review/publication and were not copied into public marketing pages. The owner's approved legal-version clarification remains pending. No deployment or production protection changes occurred. Evidence: `.impeccable/review/architecture-checks.json`, `.impeccable/review/architecture-preview-checks.json`, `docs/evidence/external-link-check-20261020.json`.

## Store launch correction — October 20, 2026
The owner clarified public launch through App Store and Google Play and explicitly requested mock links. This supersedes all earlier access-inquiry decisions. Hero/closing now carry paired store links to authorized generic storefronts, with coming-soon copy. Header/training CTA leads to the stores section. Contacts cover support, specialist-tool questions and partnerships only, with required messages and preserved drafts/error handling. No access request, default request body, TestFlight-only strategy or specialist connection gate remains. All locales and generated routes are updated. No new imagery, dependency, deployment, live submission or sibling change. No rendered visual validation is claimed.

Validation: 12 canonical pages, 3 localized noindex 404 pages, 6 legacy team redirects, 408 local references and 66 image elements; zero source errors. Contact tests cover all 3 topics × 3 locales, required messages, obsolete access-topic fallback, channels, drafts, payloads, success/failure/network/malformed/timeout and duplicates. Navigation and both motion suites pass. No real messages are sent.

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


## Final audit follow-through — October 20, 2026
All seven actionable source/content findings from final-audit-20261020.json are addressed. EN/RU/AZ program, training and progress copy now has distinct purposes; illustrative program step lists were removed, with both image tabs preserved. The 24 capability entries remain. Personal preferences/sharing/invites are compact paragraphs; the three privacy features, icons and local theme preview remain. The specialist audience strip was replaced by three concrete work tasks, backed by read-only inspection of native client details, expert progress and schedule views. Ranking wording is backed by SafeLeaderboardSection.swift and its localized consistency/progress explanations. Document approval and role distinctions remain explicit.

Download navigation uses an accurate label and stays on the specialist store section on that page. Shared footer focus uses light gold. Verified-unused hero-cover/workflow-screen and home-need styles were removed (see final-polish-cleanup.json); README and PRODUCT now describe the actual current state. DESIGN starts with the current summary before historical records. The approved home hero template hash is unchanged; no new imagery or runtime dependencies.

Validation: 12 canonical pages, 3 utility pages, 6 redirects, 438 local references, 75 images; zero static errors. All 12 canonical local HTTP routes return200. Program, UI-motion, hero-motion, navigation and contact behavioral suites pass; no real messages sent. Independent read-only review reports no material source regressions and disposition recapture. The remaining detector warning is the existing bounded contact feedback height/margin/padding transition, not measured jank. Browser/rendered desktop/mobile acceptance remains unavailable under the prior security restriction. Authorized store placeholders remain; fresh public legal checks returned Cloudflare1010, so origin document availability and approval are not established. No production deployment. Evidence: .impeccable/review/final-polish-checks.json.
