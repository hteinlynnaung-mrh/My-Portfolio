# Htein Lynn Aung Portfolio

A bilingual developer portfolio with two independent web runtimes:

- Next.js 16, React 19, and TypeScript are the primary runtime used by npm, Docker, and Vercel.
- Laravel 13, PHP 8.3+, and Blade are a parallel server-rendered runtime using the same public assets.

Choose one runtime for a deployment. They are separate render paths and do not share a server-side portfolio API.

## Features

- Responsive sections for profile, skills, experience, education, repositories, blogs, contact, and footer links.
- English/Japanese content and UI translations, stored in localStorage under lang.
- Light/dark theme selection, stored under portfolio-theme, with system-theme fallback.
- ScrollSpy navigation, scroll-reveal animation, reduced-motion handling, and a Three.js technology globe.
- Browser-side read-only integrations for pinned repositories, GitConnected, and Medium through RSS2JSON.
- Prototype admin dashboard and JSON generator pages. Neither authenticates users, persists changes, or writes to the Laravel database.

## Architecture

Next.js: Next.js App Router -> app/layout.tsx -> app/page.tsx -> public CSS/JS -> browser-rendered portfolio data.

Laravel: routes/web.php -> PortfolioController -> resources/views -> public CSS/JS -> browser-rendered portfolio data.

public/user-data/data.js is the browser source of truth for bilingual content. public/user-data/portfolio.json is a committed export snapshot; neither runtime currently fetches it. Laravel contains only default framework models and migrations, with no portfolio-specific tables or API controllers.

## Stack

| Area | Implementation |
| --- | --- |
| Primary runtime | Next.js 16, React 19, TypeScript 5.9 |
| Alternate runtime | Laravel 13, PHP 8.3+, Blade |
| Styling | public/css/style.css, public/css/animate.css, app/globals.css |
| Browser modules | Native ES modules, Lit HTML CDN module, Three.js CDN script |
| UI assets | Google Fonts, Font Awesome, Devicon, plus Bootstrap/jQuery/Waypoints in legacy Blade flow |
| Data | public/user-data/data.js and public/user-data/urls.js |
| Database | SQLite by default for Laravel; framework tables only |
| Testing | PHPUnit 12 through Laravel |
| Deployment | Vercel and Docker for Next.js; PHP web server with Laravel public/ for Laravel |

The Laravel Vite files are retained scaffold files. The current portfolio build is not a Vite bundle.

## Requirements and local setup

Next.js requires Node.js/npm compatible with the checked-in Next.js version:

    npm install
    npm run dev

Open http://localhost:3000. Production mode is npm run build followed by npm run start.

Docker runs the same production build:

    docker compose up --build

Laravel requires PHP 8.3+, Composer 2.x, and SQLite or another configured Laravel-supported database:

    composer install
    cp .env.example .env
    php artisan key:generate
    touch database/database.sqlite
    php artisan migrate
    php artisan serve

Open http://localhost:8000. composer run setup is available, but its final npm step is the Next.js build.

## Routes

| Method | URI | Next.js | Laravel | Purpose |
| --- | --- | --- | --- | --- |
| GET | / | app/page.tsx | PortfolioController@home | Portfolio |
| GET | /admin | app/admin/page.tsx | PortfolioController@admin | Static dashboard prototype |
| GET | /json-generator | app/json-generator/page.tsx | PortfolioController@jsonGenerator | Client-side JSON draft generator |

Laravel also exposes api/index.php as a PHP entry point for public/index.php. There is no routes/api.php, public JSON API, login endpoint, or write endpoint.

## Project structure

    app/                         Next.js routes and Laravel application classes
      page.tsx                   Next portfolio shell
      admin/page.tsx             Dashboard prototype
      json-generator/page.tsx    React client-side generator
      Http/Controllers/          Laravel page controller
    components/                  ScrollSpy and ScrollReveal client components
    public/                      Shared CSS, JavaScript, images, and data
      index.js                   Browser renderer and external-content loaders
      js/i18n.js                 English/Japanese translations
      js/theme.js                Theme preference and controls
      js/main.js                 Legacy navigation and accordion behavior
      js/technology-skills-globe.js  Three.js globe and fallback
      user-data/                 Source data, URL builders, and JSON snapshot
    resources/views/             Laravel Blade pages
    routes/                      Laravel web and console routes
    database/                    Default migrations, factory, and seeder
    tests/                       Laravel feature/unit tests
    Dockerfile                   Multi-stage Next.js image
    compose.yaml                 Local Docker Compose service
    vercel.json                  Vercel configuration
    SPEC.md                      Detailed implementation specification

## Data and localization

Edit public/user-data/data.js to change the English en and Japanese jp bio, skills, experience, education, contact links, and footer. Keep both language objects structurally aligned. Static labels use data-i18n keys from public/js/i18n.js; add keys to both dictionaries for new localized UI text.

public/user-data/portfolio.json has the export shape { schemaVersion, source, languages }. Each language contains bio, skills, experience, education, contactLinks, and footer. Synchronize it after changing the JavaScript source when the snapshot must remain current.

The Next.js generator creates a temporary browser JSON draft with bio, skills, experience, education, and contactLinks. It does not save files or include footer data. The Laravel generator also supports footer data and icon fields and pre-fills a hard-coded copy of the current data; it is still client-side only.

## External integrations

URLs are built in public/user-data/urls.js. The browser requests GitConnected, pinned repositories, and Medium RSS2JSON data. GitConnected currently only uses basics.name to update the document title. Rendering is capped at four repositories and three blog entries. Failures are logged or rendered as empty content; no API credentials are required.

CDN dependencies include fonts, Font Awesome, Devicon, Three.js, Lit HTML, and—on the Blade/legacy path—Bootstrap, jQuery, Waypoints, and Modernizr. Pin CDN versions when reproducible production builds are required.

## Verification

    npm run build
    php artisan test
    php artisan view:cache
    php artisan route:list
    git diff --check

The current test suite verifies HTTP 200 for all three Laravel routes. There is no dedicated Next.js unit/integration suite or browser end-to-end suite.

## Deployment

Vercel uses vercel.json and npm run build. Docker builds the multi-stage image and runs next start as the non-root node user on port 3000.

For Laravel, point the web server document root at public/, keep APP_KEY and credentials in the environment, set APP_DEBUG=false, use HTTPS, and make storage/ and bootstrap/cache/ writable:

    composer install --no-dev --prefer-dist --optimize-autoloader
    php artisan migrate --force
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache

## Maintenance rules

- Update en and jp data and translation dictionaries together.
- Keep the categorized skill list in public/index.js aligned with data.js and the globe list when appropriate.
- Update both Next.js and Blade shells when shared markup or asset loading changes.
- Treat external responses as untrusted input and preserve responsive and reduced-motion behavior.
- Do not treat /admin as an authenticated admin surface; add authentication, authorization, CSRF protection, validation, and persistence before adding writes.

See SPEC.md for the detailed runtime, data, integration, and operational contract.
