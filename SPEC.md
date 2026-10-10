# Technical Specification

## 1. Scope and current state

This document describes the implemented Laravel portfolio application in this repository. It is based on the current source code and configuration rather than an assumed future architecture.

The application is a mostly read-only portfolio site. Portfolio content is currently stored in browser-side JavaScript data rather than portfolio-specific database tables. Laravel provides the HTTP entry point, Blade views, configuration, migrations, the default user model, and the application runtime.

## 2. System architecture

### 2.1 Request flow

```text
Browser request
    -> routes/web.php
    -> PortfolioController
    -> Blade view in resources/views
    -> public CSS and JavaScript modules
    -> browser-side rendering and external read APIs
```

The application follows Laravel MVC conventions:

- **Routes:** `routes/web.php` declares the public web endpoints.
- **Controllers:** `PortfolioController` returns the `home`, `admin`, and `json-generator` views.
- **Views:** Blade templates provide the page shell and section containers.
- **Models:** The only application model is Laravel’s `User` model. Portfolio sections are not Eloquent-backed.
- **Frontend modules:** `public/index.js`, `public/js/main.js`, `public/js/theme.js`, `public/js/profile-card.js`, and `public/js/technology-skills-globe.js` render and animate the portfolio in the browser.

### 2.2 Architectural patterns

The current project uses a lightweight controller-plus-view architecture. A Service-Repository layer, Domain-Driven Design bounded contexts, application services, repositories, events, and custom domain objects are not currently implemented. Introducing those layers would be appropriate only when portfolio content or business workflows move into backend-managed features.

The skills globe is a frontend presentation component. It uses Three.js loaded by the home page, an isolated animation/rendering loop, responsive CSS, theme updates, and reduced-motion handling. It does not require a Laravel controller or database query.

### 2.3 Frontend asset pipeline

The repository contains a Laravel Vite setup with `resources/js/app.js` as its entry point. `npm run build` produces the Vite build successfully. The active portfolio page, however, currently loads its principal scripts and styles directly from `public/` and uses selected CDN dependencies from `resources/views/home.blade.php`. This hybrid arrangement should be preserved unless a separate frontend migration is planned.

## 3. Database design

### 3.1 Database configuration

The default environment uses SQLite:

```dotenv
DB_CONNECTION=sqlite
```

Laravel’s database configuration can be changed to MySQL, PostgreSQL, or another supported driver through `.env` without changing the web routes.

### 3.2 Tables and models

| Table | Purpose | Model/consumer |
| --- | --- | --- |
| `users` | Default Laravel user identity and credentials | `App\\Models\\User` |
| `password_reset_tokens` | Password reset token storage | Laravel auth infrastructure |
| `sessions` | Database-backed web sessions | Laravel session driver |
| `cache` | Database cache values | Laravel cache repository |
| `cache_locks` | Database cache locks | Laravel cache repository |
| `jobs` | Pending database queue jobs | Laravel queue infrastructure |
| `job_batches` | Batch metadata for queued jobs | Laravel queue infrastructure |
| `failed_jobs` | Failed queue job records | Laravel queue infrastructure |

`App\\Models\\User` extends `Authenticatable`, uses the default `Notifiable` trait, exposes `name`, `email`, and `password` as fillable attributes, hides password and remember-token fields, and casts `email_verified_at` to a datetime and `password` to a hashed value.

There are no portfolio, skill, project, blog, contact, or certificate tables, and therefore no custom Eloquent relationships. The default seeder creates one `Test User` record with `test@example.com` when that email does not already exist.

## 4. Web and API specifications

### 4.1 Application endpoints

| Method | Endpoint | Controller action | Authentication |
| --- | --- | --- | --- |
| GET | `/` | `PortfolioController@home` | Public |
| GET | `/admin` | `PortfolioController@admin` | Public placeholder; no auth middleware currently applied |
| GET | `/json-generator` | `PortfolioController@jsonGenerator` | Public |

The application does not currently define `routes/api.php`, JSON API controllers, API resources, webhooks, or form-processing endpoints.

### 4.2 Authentication and authorization

Laravel’s default `web` guard uses session authentication and the Eloquent `User` provider. Sanctum, Passport, JWT, API tokens, Policies, and Gates are not installed or wired into the current application. Existing web routes do not currently require authentication.

If `/admin` becomes a real administrative surface, it should be protected with `auth` middleware and explicit authorization policies before adding write operations.

### 4.3 Browser-side external requests

The portfolio JavaScript currently reads external content in the browser from:

- GitHub APIs for profile/card data.
- `https://api.rss2json.com/v1/api.json` for a Medium RSS feed.
- `https://gitconnected.com/v1/portfolio/...` for portfolio data.
- `https://pinned.berrysauce.dev/get/...` for pinned repositories.

These requests are not Laravel API endpoints, do not use application credentials, and can be affected by third-party availability, rate limits, CORS, or network failures. The UI includes loading/error handling rather than treating these services as transactional dependencies.

## 5. Queues, schedules, and background work

The default queue configuration is database-backed:

```dotenv
QUEUE_CONNECTION=database
```

The queue migrations are present, but the application currently defines no custom Job classes, listeners, notifications, mailables, or queued workflows. No scheduled tasks are registered in `routes/console.php`; that file currently contains only Laravel’s example `inspire` command.

If background work is added:

1. Create a job with `php artisan make:job`.
2. Dispatch it from an authenticated or server-side workflow.
3. Run `php artisan queue:work database` under a process supervisor.
4. Monitor and retry failures using the `failed_jobs` table and queue commands.
5. Register recurring work in the Laravel scheduler and run `php artisan schedule:run` from cron, or use the deployment platform’s scheduler.

## 6. Security and authorization

Current protections and operational expectations include:

- Laravel’s default session, cookie, and CSRF infrastructure is available through the `web` middleware stack.
- Blade output should remain escaped unless HTML is explicitly trusted.
- The `User` model hides passwords and remember tokens and casts passwords through Laravel’s hashing cast.
- No application secrets are required by the current frontend integrations.
- Production deployments must set `APP_DEBUG=false`, use a real `APP_KEY`, use HTTPS, and keep credentials out of source control.
- Any future state-changing web form must use CSRF protection and server-side validation.
- Any future admin functionality must add `auth` middleware plus policy/gate checks; hiding an admin link is not authorization.
- External browser requests should be treated as untrusted data and rendered with safe escaping.

The current application has no custom policies or gates because it has no protected domain actions.

## 7. Third-party integrations

### Implemented browser integrations

- **GitHub:** profile and repository information for portfolio cards.
- **Medium/RSS2JSON:** article feed retrieval.
- **GitConnected:** portfolio data retrieval.
- **Pinned repository service:** pinned repository retrieval.
- **CDN assets:** jQuery, Waypoints, Bootstrap, Font Awesome, Devicon, Google Fonts, Lit/Lit HTML, and Three.js.

### Configured but not currently wired to a feature

`config/services.php` and `.env.example` contain standard configuration slots for Postmark, Resend, Amazon SES, Slack, and AWS. The current application does not send mail through those providers, publish Slack notifications, or store portfolio files on S3. The default mail driver is `log`, and the default filesystem disk is `local`.

## 8. Configuration matrix

| Variable | Current default | Production consideration |
| --- | --- | --- |
| `APP_ENV` | `local` | Set to `production` |
| `APP_DEBUG` | `true` | Set to `false` |
| `APP_URL` | `http://localhost:8000` | Use the canonical HTTPS URL |
| `DB_CONNECTION` | `sqlite` | Configure the managed production database |
| `SESSION_DRIVER` | `database` | Keep database or use a supported centralized store |
| `CACHE_STORE` | `database` | Consider Redis for distributed deployments |
| `QUEUE_CONNECTION` | `database` | Run a worker if jobs are introduced |
| `MAIL_MAILER` | `log` | Configure a real mail transport for delivery |
| `FILESYSTEM_DISK` | `local` | Configure S3 or another durable disk if uploads are introduced |

## 9. Build, test, and deployment contract

Local setup requires `composer install`, `.env` configuration, `php artisan key:generate`, migrations, `npm install`, and `npm run build`. The application can then run with `php artisan serve`.

The required verification commands are:

```bash
php artisan test
npm run build
php artisan view:cache
php artisan route:list
git diff --check
```

For deployment, install Composer dependencies without development packages, build frontend assets, run `php artisan migrate --force`, optionally create the storage link, and cache configuration, routes, and views. The web server must point to `public/`, and `storage/` plus `bootstrap/cache/` must be writable.

## 10. Maintenance guidance

- Add or edit portfolio content in `public/user-data/data.js`.
- Keep skill block definitions and category rendering in `public/index.js` synchronized with the globe technology list in `public/js/technology-skills-globe.js` when the visible skill set changes.
- Keep theme-aware colors readable in both `public/style.css` and the globe’s Three.js material/theme update logic.
- Preserve `prefers-reduced-motion`, responsive breakpoints, and mobile navigation behavior when changing visual effects.
- When moving data into Laravel, introduce migrations, models, request validation, policies, and server-side controllers together rather than adding ad-hoc database access to Blade templates.
