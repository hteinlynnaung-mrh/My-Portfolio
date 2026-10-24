# Technical Specification

## 1. Scope and status

This document describes the implementation in the repository: a portfolio with two independent render paths.

1. Next.js 16 App Router is the primary npm, Vercel, and Docker runtime.
2. Laravel 13 with Blade is a parallel PHP runtime.

Both expose the same three page URLs and reuse public assets. They are not one request pipeline. Portfolio content is browser-side and static; Laravel supplies routing and default framework infrastructure, not a portfolio backend.

## 2. Runtime architecture

### 2.1 Next.js

    HTTP request -> Next.js App Router -> app/layout.tsx
      -> app/page.tsx, app/admin/page.tsx, or app/json-generator/page.tsx
      -> public CSS/JS -> localized rendering and external reads

- app/layout.tsx defines metadata, global CSS, Google Fonts, Font Awesome, Devicon, animation CSS, and the Three.js CDN script.
- app/page.tsx defines the portfolio shell, navigation, sections, theme controls, language controls, and external script loading.
- components/ScrollSpy.tsx tracks the active section.
- components/ScrollReveal.tsx applies viewport-based animation classes.
- app/admin/page.tsx is a static dashboard prototype with hard-coded sample statistics.
- app/json-generator/page.tsx is a client-side React form that generates JSON in component state and can copy it to the clipboard.
- next.config.ts disables the X-Powered-By response header.

The Next build statically prerenders /, /admin, and /json-generator.

### 2.2 Laravel

    HTTP request -> routes/web.php -> PortfolioController
      -> resources/views/*.blade.php -> public CSS/JS

PortfolioController only returns home, admin, and json-generator views. resources/views/home.blade.php is a separate shell, not generated from the Next components. api/index.php includes the Laravel public front controller for PHP-compatible hosting.

### 2.3 Browser modules

- public/index.js imports portfolio data, renders bio/skills/timelines/contact/footer content with Lit HTML, and fetches external content.
- public/js/i18n.js stores the language, translates data-i18n elements, updates document.documentElement.lang to en or ja, and dispatches languagechange.
- public/js/theme.js manages portfolio-theme, system fallback, theme controls, and translated labels.
- public/js/main.js provides legacy jQuery/Waypoints navigation, mobile menu, animation, and accordion behavior. Both portfolio shells load it.
- public/js/profile-card.js supports profile-card behavior.
- public/js/technology-skills-globe.js owns the Three.js globe, pointer interaction, tooltip, theme updates, resize/visibility handling, and fallback renderer.

### 2.4 Build pipeline

package.json contains only dev, build, and start commands for Next.js. The Laravel Vite scaffold remains in the repository but is not used by the current npm build. The portfolio loads browser modules directly from public/.

## 3. Routes and pages

| Method | URI | Next implementation | Laravel implementation | Behavior |
| --- | --- | --- | --- | --- |
| GET | / | app/page.tsx | PortfolioController@home | Portfolio |
| GET | /admin | app/admin/page.tsx | PortfolioController@admin | Static dashboard prototype |
| GET | /json-generator | app/json-generator/page.tsx | PortfolioController@jsonGenerator | Client-side JSON draft generator |

All Laravel routes are public GET routes. There are no write routes, routes/api.php, authentication endpoints, or persistence operations.

The portfolio shell contains about, skills, profile cards, experience, education, repositories, blogs, contact, and footer sections. The Next shell uses PortfolioSection; the Blade shell has separate markup. Navigation data-nav-section values correspond to section data-section values.

## 4. Client behavior

### 4.1 Navigation and motion

Next uses ScrollSpy and ScrollReveal. The legacy Blade path uses jQuery/Waypoints from main.js. Shared CSS contains responsive breakpoints and reduced-motion behavior. The mobile menu toggles the offcanvas body class. Navigation changes must be checked in both shells.

### 4.2 Theme and language

lang defaults to en and may be set to jp. Switching language updates localStorage, translates labels, updates html lang to en or ja, dispatches languagechange, and refreshes browser-rendered data and theme controls. The Next layout initially declares lang=en and the browser module corrects it after hydration.

portfolio-theme accepts light or dark. If absent, the browser uses prefers-color-scheme. Controls update data-theme, icon, label, aria-label, and aria-pressed. The preference is local and non-sensitive.

### 4.3 Skills and globe

public/index.js groups data.js skills into programming, frameworks/libraries, databases, tools/technologies, and language categories. The category names are separate from the skill records.

technology-skills-globe.js has its own technology list and creates a Three.js scene with a perspective camera, globe core, wireframe, atmosphere, hexagonal icon textures, links, particles, tooltip, hover, drag/touch interaction, resize handling, and theme response. If Three.js/WebGL initialization is unavailable, it renders styled text fallback chips. Reduced motion limits animation. Update both lists when visible skills change.

## 5. Data contracts

### 5.1 Source data

public/user-data/data.js contains parallel en and jp records:

    bio: string[]
    skills: { name, icon, color }[]
    experience: { title, duration, subtitle, details, tags, icon }[]
    education: { title, duration, subtitle, details, tags, icon }[]
    contactLinks: { label, link, icon }[]
    footer: { label, data }[]

The module exports current-language data at module load time and getPortfolioData() for re-reading after a language event. urls.js builds GitConnected, Medium/RSS2JSON, and pinned-repository URLs.

### 5.2 JSON snapshot

public/user-data/portfolio.json is a committed export:

    {
      "schemaVersion": 1,
      "source": "public/user-data/data.js",
      "languages": {
        "en": { "bio": [], "skills": [], "experience": [], "education": [], "contactLinks": [], "footer": [] },
        "jp": { "bio": [], "skills": [], "experience": [], "education": [], "contactLinks": [], "footer": [] }
      }
    }

Neither runtime fetches it and there is no synchronization mechanism.

### 5.3 Generator outputs

The Next generator is an in-memory draft tool. It outputs bio, skills, experience, education, and contactLinks. Skills contain only name; experience/education details remain strings; contacts use text and link. It does not output footer data or save/download a file.

The Blade generator uses an independent DOM script. It outputs the same sections plus footer; contacts include label, link, and icon; footer records include label and data. It pre-fills a hard-coded copy of current data. Neither generator validates against a schema or persists output.

## 6. External integrations

| Integration | Endpoint source | Current use |
| --- | --- | --- |
| Medium | api.rss2json.com via urls.js | Up to three blog cards |
| Pinned repositories | pinned.berrysauce.dev via urls.js | Up to four repository cards |
| GitConnected | gitconnected.com via urls.js | Uses basics.name to set document title |
| CDN assets | layout and Blade templates | Fonts, icons, Three.js, Lit, Bootstrap, jQuery, Waypoints, Modernizr |

Requests are browser-side, read-only, and credential-free. Failures produce warnings, empty content, or the globe fallback. CORS, rate limits, endpoint changes, and network availability are external risks. Treat response fields as untrusted input.

## 7. Laravel infrastructure

The default .env.example configures SQLite, database-backed sessions/cache/queues, and log mail. Migrations are Laravel defaults for users, sessions, cache, and jobs. App/Models/User.php is the only application model. The default seeder creates a user; no portfolio, project, blog, contact, or skill tables exist.

The admin page is not protected by auth middleware and is not an administrative surface. Sanctum, Passport, JWT, custom policies, and gates are not installed or used. Future writes require authentication, authorization, CSRF protection, validation, and persistence design.

## 8. Security and privacy requirements

- Keep APP_KEY, credentials, and future API secrets out of source control.
- Set APP_DEBUG=false and use HTTPS in production.
- Keep Blade output escaped unless trusted HTML is deliberately required.
- Pin CDN assets where supply-chain reproducibility matters.
- Do not trust or execute external response content.
- Treat browser language/theme preferences as non-sensitive local storage.

## 9. Operations and deployment

### 9.1 Checks

    npm run build
    php artisan test
    php artisan view:cache
    php artisan route:list
    git diff --check

The feature test covers HTTP 200 responses for all three Laravel routes. There are no dedicated Next.js or browser end-to-end tests.

### 9.2 Next.js deployment

Vercel uses vercel.json and npm run build. Docker uses Node 22 bookworm-slim, npm ci, a separate build stage, and next start as the non-root node user on port 3000. compose.yaml publishes port 3000 and restarts the service unless stopped.

### 9.3 Laravel deployment

Serve the Laravel project with public/ as the web root:

    composer install --no-dev --prefer-dist --optimize-autoloader
    php artisan migrate --force
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache

Keep storage/ and bootstrap/cache/ writable. Queue workers and schedulers are unnecessary because there are no custom jobs or schedules. Create a storage link only if public storage files are introduced.

## 10. Known limitations and maintenance rules

1. Next and Blade templates are parallel copies and can drift.
2. Portfolio content is duplicated by language in a browser module, not managed by Laravel.
3. The active build is Next.js; the Laravel Vite scaffold is inactive for the portfolio.
4. The categorized skill list and globe list are independent and require coordinated updates.
5. External integrations are not contract-tested in this repository.
6. Admin and generator pages are prototypes with no persistence or access control.
7. The JSON snapshot is a manually synchronized export, not an API response.

When changing the site, keep both language objects aligned, add both translation keys, update both page shells when shared markup changes, preserve responsive/reduced-motion behavior, synchronize the JSON snapshot when required, and run the checks in section 9.1.
