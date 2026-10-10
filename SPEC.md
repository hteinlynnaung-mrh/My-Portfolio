# Technical Specification

## 1. Purpose and implementation status

This specification describes the code that currently exists in the repository. It documents a portfolio site with two available runtimes:

1. A Next.js App Router application, used by the npm scripts and configured for Vercel.
2. A Laravel 13 application that serves equivalent Blade views through `routes/web.php`.

The runtimes share `public/css`, `public/js`, `public/user-data`, and image assets, but they are separate render paths. A deployment should select one runtime rather than attempting to run both handlers for the same request.

Portfolio content is mostly static browser-side data. Laravel provides page routing and framework infrastructure, but there are no custom portfolio domain tables or server-side portfolio APIs.

## 2. Repository and runtime architecture

### 2.1 Next.js request flow

```text
Browser request
    -> Next.js App Router
    -> app/layout.tsx
    -> app/page.tsx, app/admin/page.tsx, or app/json-generator/page.tsx
    -> shared public CSS and browser modules
    -> client-side portfolio rendering and external read requests
```

The Next.js application contains:

- `app/layout.tsx`: metadata, global CSS, Font Awesome, Devicon, Google Fonts, animation CSS, and the Three.js CDN script.
- `app/page.tsx`: portfolio shell, navigation, sections, theme controls, language controls, and script loading.
- `app/admin/page.tsx`: static dashboard placeholder.
- `app/json-generator/page.tsx`: client-side form that generates portfolio JSON from entered data.
- `components/ScrollSpy.tsx`: client-side active-section navigation tracking.
- `components/ScrollReveal.tsx`: client-side IntersectionObserver animation behavior.
- `app/globals.css`: global and generator/admin page overrides.

`next.config.ts` currently disables the powered-by response header. `vercel.json` declares the Next.js framework and uses `npm run build`.

### 2.2 Laravel request flow

```text
Browser request
    -> routes/web.php
    -> PortfolioController
    -> resources/views/*.blade.php
    -> public/css and public JavaScript modules
```

Laravel files provide:

- `routes/web.php`: `/`, `/admin`, and `/json-generator` routes.
- `app/Http/Controllers/PortfolioController.php`: returns the three Blade views without domain logic.
- `resources/views/home.blade.php`: server-rendered portfolio shell.
- `resources/views/admin.blade.php`: static Bootstrap admin placeholder.
- `resources/views/json-generator.blade.php`: Blade/JavaScript JSON generator.
- `public/index.php`: Laravel’s front controller.
- `api/index.php`: includes the public front controller for a PHP-compatible deployment entry point.

### 2.3 Shared browser modules

- `public/index.js` imports bilingual data, renders bio/skills/timeline/links, and fetches external content.
- `public/js/i18n.js` stores the selected language, provides `t(key)`, and replaces `[data-i18n]` content.
- `public/js/theme.js` manages light/dark mode, persisted preference, system fallback, and localized theme labels.
- `public/js/main.js` contains the legacy navigation, accordion, and animation behavior used by the Blade flow and loaded by the Next portfolio page.
- `public/js/profile-card.js` handles external profile-card behavior.
- `public/js/technology-skills-globe.js` builds the Three.js globe, technology nodes, links, particles, tooltip, theme response, resize behavior, pointer interaction, and reduced-motion behavior.

### 2.4 Build pipeline

`package.json` defines only Next.js commands:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start"
}
```

Laravel’s `vite.config.js` and `resources/js/app.js` are retained scaffold files. The current `npm run build` command is not a Vite build; it is the Next.js production build. The active portfolio page loads its main scripts directly from `public/`.

## 3. Page composition and behavior

### 3.1 Main portfolio sections

The main page contains:

1. Desktop sidebar and mobile navigation controls.
2. About section populated from localized bio data.
3. Skills section containing categorized skill chips and the 3D globe.
4. LinkedIn and GitHub profile cards.
5. Work experience timeline.
6. Education timeline.
7. Top repositories accordion.
8. Latest blogs accordion.
9. Contact links and footer.

The Next page uses `PortfolioSection` for common section framing. Blade uses explicit `<section>` templates but preserves the same `data-section` names so shared navigation behavior can identify sections.

### 3.2 Navigation and animation

The navigation uses `data-nav-section` values corresponding to section `data-section` values. `ScrollSpy.tsx` updates the active link and `aria-current` as the page scrolls. `ScrollReveal.tsx` observes `.animate-box` elements and adds animation classes when they enter the viewport. The shared CSS disables or simplifies reveal behavior when `prefers-reduced-motion: reduce` is active.

The legacy `public/js/main.js` also supports navigation and accordion interactions. Changes to navigation should be checked against both the Next component path and the Blade path.

## 4. Skills and Three.js globe

### 4.1 Skill chips

`public/index.js` groups localized skill records into programming, frameworks, databases, tools, and language categories. `public/css/style.css` controls chip dimensions, wrapping, colors, icon sizes, group spacing, responsive breakpoints, and the compact top/bottom spacing of the Skills section.

### 4.2 Globe data and rendering

`public/js/technology-skills-globe.js` owns a separate technology list for the interactive globe. Each technology can have an icon class and color. The renderer:

- creates a Three.js scene, perspective camera, renderer, sphere core, wireframe grid, and atmospheric sprite;
- distributes nodes across a spherical radius using a Fibonacci-style layout;
- generates canvas textures containing hexagons and Devicon glyphs;
- links nearby nodes and adds particle effects;
- supports pointer hover, dragging, touch behavior, tooltip display, resizing, visibility changes, and theme changes;
- falls back to styled text chips if Three.js or WebGL setup is unavailable;
- reduces activity under `prefers-reduced-motion`.

Current visual tuning uses a smaller core/grid sphere, smaller atmosphere, reduced node radius, and smaller hexagonal node sprites. The CSS container remains responsive at 560px desktop height, 500px below 992px, and 430px below 768px.

When visible skills change, update both the categorized records in `public/user-data/data.js`/`public/index.js` and the globe technology list when appropriate. The two lists are intentionally separate because the chip renderer and 3D renderer use different icon/data requirements.

## 5. Data model and localization

### 5.1 Portfolio data

`public/user-data/data.js` exports the selected language’s:

- `bio`
- `skills`
- `experience`
- `education`
- `contactLinks`
- `footer`

The file contains parallel `en` and `jp` structures. It calls `getLanguage()` from `i18n.js` at module load time, so a language change reloads the page to rebuild all content from the selected dataset.

`public/user-data/urls.js` builds the external URLs for GitHub, Medium, GitConnected, and pinned repositories.

### 5.2 Translation behavior

`public/js/i18n.js` contains English and Japanese dictionaries for navigation, section headings, skill groups, profile name, theme labels, profile labels, statistics, date phrases, footer labels, and contact text. `applyTranslations()` updates elements with `data-i18n` attributes. `setLanguage()` writes `localStorage.lang` and reloads the page.

The profile name is localized as `Htein Lynn Aung` / `ティン リン アウン`. The HTML document language metadata is currently static (`en`) and is not dynamically changed when the user switches language.

### 5.3 Theme behavior

`public/js/theme.js` reads `portfolio-theme`, otherwise uses `prefers-color-scheme`, and updates `document.documentElement.dataset.theme`. All `[data-theme-toggle]` controls share the same state. The control icon, accessible label, pressed state, and visible label are updated for both English and Japanese.

## 6. External integrations

The browser performs read-only requests to public external services:

| Service | Source | Use |
| --- | --- | --- |
| GitHub | `public/index.js` / URL builders | Profile and repository content |
| Medium via RSS2JSON | `public/user-data/urls.js` | Blog/article feed |
| GitConnected | `public/user-data/urls.js` | Profile/portfolio data |
| Pinned repository service | `public/user-data/urls.js` | Pinned repository list |
| CDN assets | page templates/layout | Fonts, icons, Three.js, Lit, Bootstrap, jQuery, Waypoints |

External requests are not transactional dependencies. They can fail because of network problems, CORS, service availability, API changes, or rate limits. The browser modules catch failures and render empty or fallback states where implemented. No API keys or application credentials are required by the current integrations.

## 7. Laravel backend and database

### 7.1 Routes and controller

| Method | URI | Action | Authentication |
| --- | --- | --- | --- |
| GET | `/` | `PortfolioController@home` | Public |
| GET | `/admin` | `PortfolioController@admin` | Public placeholder |
| GET | `/json-generator` | `PortfolioController@jsonGenerator` | Public |

`PortfolioController` only returns views. There are no POST/PUT/DELETE portfolio operations.

### 7.2 Database

The default `.env.example` uses SQLite, database sessions, database cache, and database queues. The migration set is Laravel’s default infrastructure:

| Table group | Tables |
| --- | --- |
| Identity | `users`, `password_reset_tokens`, `sessions` |
| Cache | `cache`, `cache_locks` |
| Queue | `jobs`, `job_batches`, `failed_jobs` |

`App\\Models\\User` is the only application model. The default seeder creates a test user if one does not already exist. There are no portfolio, skills, projects, blogs, contacts, or certificates tables, and no custom Eloquent relationships.

### 7.3 Authentication and authorization

Laravel’s default web/session infrastructure is available, but the current routes are not protected by `auth` middleware. Sanctum, Passport, JWT, custom policies, and gates are not installed or used. The admin pages are placeholders and are not secure administrative surfaces.

Before adding admin writes, implement authentication, authorization policies/gates, CSRF-protected forms, validation, and server-side persistence.

## 8. Security and privacy posture

- Keep `APP_KEY`, database credentials, mail credentials, and future API credentials out of source control.
- Set `APP_DEBUG=false` and use HTTPS in production.
- Treat all external API responses as untrusted data.
- Keep Blade output escaped except where trusted HTML is intentionally required.
- Add CSRF and server-side validation to any future state-changing form.
- Do not treat the visible admin link or placeholder page as authorization.
- Review CDN dependencies and pin versions where reproducible deployments are required.
- The current browser-side language and theme preferences are non-sensitive local storage values.

## 9. Queues, schedules, and mail

The default queue connection is database-backed and its migrations exist, but there are no custom jobs, listeners, notifications, mailables, or queued workflows. `routes/console.php` currently contains only Laravel’s example `inspire` command; no scheduled portfolio task is registered.

The default mailer is `log`. Standard service configuration placeholders exist for mail/cloud providers, but the current application does not send mail, publish notifications, or store portfolio uploads on S3.

## 10. Testing and operational checks

The implemented feature test checks that Laravel returns HTTP 200 for `/`, `/admin`, and `/json-generator`. There is no dedicated Next.js unit, integration, or browser end-to-end test suite.

Run the current checks with:

```bash
npm run build
php artisan test
php artisan view:cache
php artisan route:list
git diff --check
```

Use `npm run build` to type-check and produce the Next.js production build. Use Laravel commands to validate the parallel Blade runtime.

## 11. Deployment contract

### Next.js/Vercel

Vercel uses `vercel.json` and `npm run build`. The application expects the static assets under `public/` and external CDN/API access from the browser.

### Laravel

The Laravel deployment must serve the project’s `public/` directory as the web root. A typical production sequence is:

```bash
composer install --no-dev --prefer-dist --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Create the storage link only if public storage files are introduced. Ensure `storage/` and `bootstrap/cache/` are writable. A queue worker and scheduler are unnecessary until corresponding application features are added.

## 12. Known limitations and maintenance rules

1. The Next and Blade page structures are parallel copies, not a shared component system. Shared changes may need edits in both `app/` and `resources/views/`.
2. Portfolio data is duplicated by language in a browser-side module rather than managed in Laravel.
3. The main static data and external integration code are loaded directly from `public/`; the Vite scaffold is not the active portfolio bundler.
4. The globe’s technology list and the chip renderer’s skill list can drift unless updated together.
5. The document `lang` attribute is not updated dynamically with the selected language.
6. External services can change independently and are not contract-tested in this repository.
7. The admin and JSON generator pages are prototypes; they do not persist data or enforce authentication.

When changing the application:

- update both translation dictionaries for every new localized key;
- keep `en` and `jp` data shapes aligned;
- preserve responsive and reduced-motion behavior;
- verify both Next and Laravel route flows when shared assets or markup change;
- run the build, Laravel tests, view cache, route list, and diff checks before delivery.
