# Portfolio Project Documentation

Welcome to the comprehensive documentation for the **Htein Lynn Aung Portfolio**. This document provides an in-depth view of the project's architecture, technologies, and how to maintain it.

---

## 🌟 Project Overview

This portfolio is a modern, responsive web application designed to showcase professional experience, skills, and projects. It emphasizes a dynamic user experience through:
- **Interactive 3D Visuals**: A skill sphere that reacts to mouse movements.
- **Dynamic Content**: Data-driven rendering using `lit-html`.
- **Multi-language Support**: Seamless switching between English and Japanese.
- **Real-time Analytics**: A visitor counter powered by Firebase.

---

## 🛠️ Technology Stack

### Frontend Core
- **JavaScript (ES6+)**: The primary logic language, utilizing ES Modules.
- **[lit-html](https://lit.dev/docs/libraries/lit-html/)**: A lightweight templating library for efficient DOM updates.
- **HTML5 & CSS3**: Structured with semantic HTML and styled with advanced CSS (Flexbox, Grid, Animations).
- **Bootstrap 3**: Provides the foundational grid system and some legacy UI components.

### Libraries & Frameworks
- **[Three.js](https://threejs.org/)**: Powers the interactive 3D Skill Sphere.
- **jQuery**: Used for legacy scroll handling and UI interactions.
- **Waypoints**: Handles scroll-triggered animations (the "fadeIn" effects).
- **FontAwesome & DevIcons**: Comprehensive icon sets for professional presentation.

### Backend & Services
- **Firebase (Firestore)**: Manages the real-time visitor counter.
- **GitHub API**: Dynamically fetches repository statistics.
- **Medium RSS Feed**: Integrates the latest blog posts directly into the site.

---

## 🏗️ Architecture & Data Flow

The project follows a **data-driven** approach, separating content from implementation logic.

### 1. Data Layer (`user-data/`)
- **`data.js`**: The single source of truth for all portfolio content (bio, skills, experience, education, links).
- **`urls.js`**: Centralized configuration for API endpoints (GitHub, Medium, etc.).

### 2. Component Logic (`js/`)
- **`index.js`**: The main orchestrator. It fetches data and uses `lit-html` templates to render sections.
- **`skill-sphere.js`**: A standalone component that initializes the Three.js scene, creates dynamic sprites for skills, and handles mouse interaction.
- **`profile-card.js`**: Modular component for rendering social/professional cards (LinkedIn, GitHub, LeetCode) using custom elements logic.
- **`i18n.js`**: Manages the language state, persists it to `localStorage`, and handles the translation mapping.

### 3. UI & Styling (`css/`)
- **`style.css`**: Contains global styles, theme variables, and component-specific overrides.
- **`animate.css`**: Pre-defined animations for smooth section transitions.

---

## 🎨 Customization Guide

### Updating Personal Information
To change your bio, work experience, or education, edit [user-data/data.js](file:///Users/hteinlynnaung/Desktop/Portfolio/user-data/data.js).
1. Locate the `allData` object.
2. Update the `en` (English) or `jp` (Japanese) sections.
3. The UI will automatically reflect these changes on reload.

### Modifying Skills
Skills are managed in the `skills` array within `data.js`. Each skill object requires:
- `name`: The display name (e.g., "React").
- `icon`: The CSS class for the icon (e.g., `devicon-react-original`).
- `color`: The accent color for the 3D sphere (e.g., `#61DAFB`).

### Configuring Firebase (Visitor Counter)
The Firebase configuration is located in [index.html](file:///Users/hteinlynnaung/Desktop/Portfolio/index.html) near the bottom. To use your own counter:
1. Create a Firebase project.
2. Enable Firestore.
3. Replace the `firebaseConfig` object with your project's credentials.

---

## 🚀 Deployment

The project is designed for static hosting. Popular options include:
- **GitHub Pages**: Simply push your code to a `gh-pages` branch or configure it from the repository settings.
- **Vercel**: Connect your GitHub repository for automatic CD/CI deployments.

---

## 📝 Maintenance
- **Updating Dependencies**: The project uses CDN-hosted scripts (Three.js, lit-html). To update, simply change the version numbers in the script tags within `index.html` or `js/` files.
- **Adding New Sections**: 
  1. Add a new `section` tag in `index.html`.
  2. Create a rendering function in `index.js`.
  3. Update `data.js` with the corresponding content.
