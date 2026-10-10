# Htein Lyn Naung — Laravel Portfolio

A single-page developer portfolio built on Laravel and Blade. The application presents the portfolio owner’s profile, skills, experience, education, repositories, articles, contact links, theme controls, and an interactive Three.js technology-skills globe.

## Key features

- Responsive portfolio page with mobile navigation and ScrollSpy behavior.
- English/Japanese content switching backed by `public/user-data/data.js`.
- Dark and light themes with persisted user preference and system-theme fallback.
- Colorful skill blocks plus a responsive, animated Three.js skills globe.
- GitHub profile/repository cards and external portfolio content loaded by browser-side JavaScript.
- Medium/RSS, GitConnected, and pinned-repository integrations with graceful loading states.
- Laravel Blade views for the portfolio, admin placeholder, and JSON generator pages.
- PHPUnit-based Laravel feature tests and a Vite build pipeline.

## Tech stack

| Area | Technology |
| --- | --- |
| Runtime | PHP 8.3 or newer (`composer.json` requires `^8.3`) |
| Backend | Laravel 13.x (installed environment: 13.35.0; Composer constraint: `^13.17`) |
| Templating | Blade |
| Database | SQLite by default; configurable for other Laravel-supported drivers |
| Cache | Database cache store by default |
| Session | Database session driver by default |
| Queue | Database queue connection by default |
| Frontend | Vanilla JavaScript modules, Blade, CSS, jQuery/Waypoints, Three.js, Lit/Lit HTML CDN modules, Bootstrap and Devicon assets |
| Build tooling | Vite 8, Laravel Vite plugin, Tailwind CSS 4 packages in the Vite toolchain |
| Testing | PHPUnit 12 through `php artisan test` |

The current portfolio UI is primarily served from `public/` and uses CDN-loaded browser modules. The Laravel Vite scaffold is retained for buildable frontend entry points; `resources/js/app.js` is currently minimal and the home page does not depend on the generated Vite bundle for its main portfolio rendering.

## Prerequisites

- PHP 8.3+ with the extensions required by Laravel 13.
- Composer 2.x.
- Node.js and npm compatible with Vite 8.
- SQLite enabled in PHP for the default local setup, or credentials for another configured database.
- Internet access in development/deployment for the current CDN and browser-side external API integrations.

## Installation and local setup

From the project root:

```bash
composer install
cp .env.example .env
php artisan key:generate
```

For the default SQLite setup, create the database file if it does not already exist:

```bash
touch database/database.sqlite
```

Review `.env` and then run the migrations:

```bash
php artisan migrate
```

The optional default seeder creates a local test user:

```bash
php artisan db:seed
```

Create the public storage symlink if you add public user-uploaded files:

```bash
php artisan storage:link
```

Install and build frontend dependencies:

```bash
npm install
npm run build
```

Start the local server:

```bash
php artisan serve
```

Open `http://localhost:8000`.

Laravel’s combined setup script is also available:

```bash
composer run setup
```

That script installs PHP dependencies, creates `.env` when missing, generates the application key, runs migrations, installs npm packages, and builds the Vite assets.

## Application routes

| Method | URI | Name | Purpose |
| --- | --- | --- | --- |
| GET | `/` | `home` | Main portfolio page |
| GET | `/admin` | `admin` | Admin placeholder view |
| GET | `/json-generator` | `json-generator` | JSON generator view |

There is currently no `routes/api.php`, public JSON API, or token-authenticated API surface.

## Running tests and checks

Run the Laravel test suite:

```bash
php artisan test
```

The Composer shortcut runs the same suite after clearing configuration:

```bash
composer test
```

The project currently uses PHPUnit 12; no Pest dependency or Pest test suite is configured. Useful additional checks are:

```bash
npm run build
php artisan view:cache
php artisan route:list
git diff --check
```

## Environment configuration

Important local defaults from `.env.example` include:

```dotenv
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
DB_CONNECTION=sqlite
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
FILESYSTEM_DISK=local
MAIL_MAILER=log
```

For production:

- Set a strong `APP_KEY`, correct `APP_URL`, and `APP_ENV=production`.
- Set `APP_DEBUG=false`.
- Configure the production database and run migrations deliberately.
- Use HTTPS and configure the web server/proxy correctly.
- Replace the `log` mailer with a real mail provider when email delivery is required.
- Configure Redis, S3, or another service only when the corresponding application feature is introduced.
- Keep secrets in the deployment environment, never in committed source files.

## Deployment

A typical deployment sequence is:

```bash
composer install --no-dev --prefer-dist --optimize-autoloader
npm ci
npm run build
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Point the web server document root at the project’s `public/` directory. Ensure `storage/` and `bootstrap/cache/` are writable by the application process. If background jobs are added, run a supervised worker using the configured queue connection:

```bash
php artisan queue:work database --sleep=3 --tries=3
```

The current application does not define custom queued jobs or scheduled tasks, so a worker and scheduler are not required for the existing portfolio pages.

## Project structure

```text
app/                    Laravel controllers and models
database/               Migrations, SQLite database, and seeders
public/                 Active portfolio JavaScript, CSS, user data, and public assets
resources/views/        Blade page views
resources/js/           Vite entry point
routes/                 Web and console routes
tests/                  PHPUnit feature/unit tests
SPEC.md                 Current technical specification
```

## Updating the portfolio

- Edit portfolio content in `public/user-data/data.js`.
- Update skill block categories and rendering in `public/index.js`.
- Update theme behavior in `public/js/theme.js` and globe behavior in `public/js/technology-skills-globe.js`.
- Update page structure in `resources/views/home.blade.php`.
- Rebuild with `npm run build` after changes that affect the Vite pipeline.

See [`SPEC.md`](SPEC.md) for the system architecture, data model, routes, security posture, integrations, queue configuration, and operational details.
