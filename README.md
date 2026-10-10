# Htein Lynn Aung Portfolio

A responsive developer portfolio implemented with a Next.js App Router frontend and a parallel Laravel/Blade implementation. The site presents profile information, bilingual portfolio content, skills, experience, education, repositories, articles, contact links, theme controls, and an interactive Three.js technology globe.

## Current architecture

This repository contains two web runtimes that share the same public assets and browser-side portfolio modules:

- **Next.js is the current npm/Vercel application.** The App Router pages live in `app/`, `npm run build` runs `next build`, and `vercel.json` declares the Next.js framework.
- **Laravel remains a complete server-rendered application.** Laravel routes in `routes/web.php` return Blade views through `PortfolioController`. It can be run with `php artisan serve` and uses the same `public/` CSS, JavaScript, images, and user data.
- **The two implementations are not rendered together.** Use the Next.js server or the Laravel server as the selected runtime; both expose the same primary URLs.

Portfolio content is intentionally frontend-oriented: the main data is stored in `public/user-data/data.js`, not in custom portfolio database tables. Laravel’s database, user model, migrations, and default infrastructure remain available for future backend-managed features.

## Features

- Responsive portfolio layout with desktop sidebar, mobile navigation, ScrollSpy, and scroll-reveal animations.
- English/Japanese language switching persisted in `localStorage` under `lang`.
- Localized section headings, profile name, theme controls, skill-group labels, and portfolio data.
- Light/dark theme switching persisted under `portfolio-theme`, with system-theme fallback and reduced-motion support.
- Categorized skill chips with responsive wrapping and a responsive animated Three.js technology globe.
- Smaller globe sphere and hexagonal technology icons tuned for the skills section.
- Browser-side GitHub, pinned-repository, GitConnected, and Medium/RSS2JSON integrations with graceful failure handling.
- Next.js placeholder admin dashboard and JSON generator pages.
- Equivalent Laravel Blade pages for the portfolio, admin placeholder, and JSON generator.
- Laravel feature coverage for the three Laravel routes.

## Technology stack

| Area | Technology |
| --- | --- |
| Primary frontend runtime | Next.js 16, React 19, TypeScript |
| Alternate/server-rendered runtime | Laravel 13, PHP 8.3+, Blade |
| Frontend styling | `public/css/style.css`, `public/css/animate.css`, `app/globals.css` |
| Browser modules | Vanilla JavaScript ES modules, Lit HTML from CDN, Three.js from CDN |
| UI assets | Font Awesome, Devicon, Google Fonts, jQuery and Waypoints where used by the legacy Blade flow |
| Data | `public/user-data/data.js` and `public/user-data/urls.js` |
| Database | SQLite by default for Laravel; no portfolio-specific tables |
| Testing | PHPUnit 12 through Laravel’s test runner |
| Deployment configuration | Vercel Next.js configuration in `vercel.json` |

`resources/js/app.js` and `vite.config.js` are retained Laravel/Vite scaffold files. They are not the source of the current Next.js portfolio build, and the portfolio page does not depend on a generated Vite bundle.

## Requirements

For the Next.js runtime:

- Node.js and npm compatible with the installed Next.js version.

For the Laravel runtime:

- PHP 8.3 or newer.
- Composer 2.x.
- SQLite enabled for the default local database, or another Laravel-supported database configured in `.env`.

Both runtimes need internet access when browser-side CDN assets or external content integrations are enabled.

## Local setup

### Next.js

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Create a production build with:

```bash
npm run build
npm run start
```

The build output confirms the App Router pages for `/`, `/admin`, and `/json-generator`.

### Laravel

```bash
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan serve
```

Open `http://localhost:8000`.

The optional Laravel setup shortcut is:

```bash
composer run setup
```

It installs Composer dependencies, creates the environment file when missing, generates an application key, runs migrations, installs npm dependencies, and runs the repository’s `npm run build` command. Because that npm script is currently the Next.js build, use the explicit Laravel steps when you only want to start the Blade runtime.

## Routes

Both runtimes expose these page URLs:

| Method | URI | Next.js page | Laravel route | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/` | `app/page.tsx` | `PortfolioController@home` | Main portfolio |
| GET | `/admin` | `app/admin/page.tsx` | `PortfolioController@admin` | Static admin placeholder |
| GET | `/json-generator` | `app/json-generator/page.tsx` | `PortfolioController@jsonGenerator` | Portfolio JSON generator |

Laravel also has `api/index.php` as a thin entry point to `public/index.php`. There is no `routes/api.php`, public JSON API, authentication endpoint, webhook, or token-authenticated API surface.

## Project structure

```text
app/
  page.tsx                 Next.js portfolio page
  layout.tsx               Next metadata, global styles, CDN styles, Three.js loader
  admin/page.tsx           Next.js admin placeholder
  json-generator/page.tsx  Next.js client-side JSON generator
  globals.css              Small Next/global overrides
components/
  ScrollSpy.tsx            Active navigation section tracking
  ScrollReveal.tsx         IntersectionObserver-based reveal behavior
public/
  index.js                 Main browser renderer and external content loaders
  js/i18n.js               English/Japanese translations and language persistence
  js/theme.js              Theme state and localized theme controls
  js/main.js               Legacy navigation, accordion, and animation behavior
  js/profile-card.js       External profile-card rendering
  js/technology-skills-globe.js  Three.js globe and hexagonal technology icons
  user-data/data.js        English/Japanese portfolio data
  user-data/urls.js        External integration URL builders
  css/style.css            Shared portfolio layout and component styles
  images/                  Profile and public image assets
resources/views/           Laravel Blade versions of the pages
routes/                    Laravel web and console routes
app/Http/Controllers/      Laravel page controller
database/                  Laravel migrations, factories, and seeders
tests/                     PHPUnit tests
next.config.ts             Next.js configuration
vercel.json                Vercel Next.js deployment configuration
README.md                  Project usage and architecture guide
SPEC.md                    Detailed implementation specification
```

## Portfolio data and localization

Edit `public/user-data/data.js` to update the bilingual bio, skills, experience, education, contact links, footer links, and related labels. The module selects `en` or `jp` from `localStorage.lang` through `public/js/i18n.js`.

Static labels use `data-i18n` attributes in the page markup. `public/index.js` calls `applyTranslations()` after the page shell is rendered. Changing language stores the new value and reloads the page so all data and labels are rebuilt consistently. Add new static labels to both translation dictionaries before adding a new `data-i18n` key.

Theme labels are translated in `public/js/theme.js`. Theme preference is stored separately from language preference under `portfolio-theme`.

## External browser integrations

The browser reads public external endpoints configured in `public/user-data/urls.js`:

- GitHub profile/repository information.
- GitConnected portfolio information.
- Pinned repositories through `pinned.berrysauce.dev`.
- Medium RSS through `api.rss2json.com`.

These requests are non-transactional and may be affected by CORS, rate limits, network failures, or third-party changes. The UI falls back to empty/error states where supported. No application credentials are currently required for these reads.

## Verification

Recommended checks after changes:

```bash
npm run build
php artisan test
php artisan view:cache
php artisan route:list
git diff --check
```

`npm run build` validates the Next.js TypeScript application. `php artisan test`, view caching, and route listing validate the Laravel side. There is currently no dedicated browser end-to-end test suite.

## Deployment

### Vercel / Next.js

`vercel.json` selects the Next.js framework and uses `npm run build`. Deploy the repository as a Next.js project with the required public assets available under `public/`.

### Laravel server

For a Laravel deployment:

```bash
composer install --no-dev --prefer-dist --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Point the web server document root at `public/`. Keep `APP_KEY` and any future credentials in the deployment environment, set `APP_DEBUG=false`, use HTTPS, and make `storage/` and `bootstrap/cache/` writable by the application process.

The current project has no custom queued jobs or scheduled tasks. A queue worker and scheduler are not required for the existing portfolio pages.

## Maintenance notes

- Keep the skill categories in `public/index.js` aligned with the technology list in `public/js/technology-skills-globe.js` when visible skills change.
- Keep English and Japanese data structures aligned in `public/user-data/data.js`.
- Update both Next and Blade markup when a shared static label or page structure changes.
- Preserve responsive breakpoints, reduced-motion behavior, and readable light/dark theme contrast.
- Treat external response data as untrusted input and keep rendering escaped or safely templated.
- Protect any future admin write operations with authentication, authorization, CSRF protection, validation, and server-side persistence.

See [`SPEC.md`](SPEC.md) for the detailed system specification and known limitations.
