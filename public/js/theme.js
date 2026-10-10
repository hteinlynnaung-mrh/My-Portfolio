const THEME_STORAGE_KEY = "portfolio-theme";
const themeQuery = window.matchMedia("(prefers-color-scheme: dark)");

function updateThemeControls(theme) {
  const darkMode = theme === "dark";
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    const icon = button.querySelector("i");
    const label = button.querySelector(".theme-toggle-label");
    button.setAttribute("aria-label", darkMode ? "Switch to light mode" : "Switch to dark mode");
    button.setAttribute("aria-pressed", String(darkMode));
    if (icon) icon.className = darkMode ? "fa-solid fa-sun" : "fa-solid fa-moon";
    if (label) label.textContent = darkMode ? "Light mode" : "Dark mode";
  });
}

function setTheme(theme, persist = true) {
  document.documentElement.dataset.theme = theme;
  if (persist) localStorage.setItem(THEME_STORAGE_KEY, theme);
  updateThemeControls(theme);
}

const initialTheme = document.documentElement.dataset.theme || (themeQuery.matches ? "dark" : "light");
setTheme(initialTheme, false);

document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });
});

themeQuery.addEventListener?.("change", (event) => {
  if (!localStorage.getItem(THEME_STORAGE_KEY)) setTheme(event.matches ? "dark" : "light", false);
});
