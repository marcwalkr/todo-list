import "./styles.css";

const html = document.querySelector("html");
const themeToggle = document.querySelector(".sidebar__theme-toggle-btn");

themeToggle.addEventListener("click", () => {
  const previousTheme = html.dataset.theme;
  const newTheme = previousTheme === "dark" ? "light" : "dark";

  html.dataset.theme = newTheme;
  themeToggle.setAttribute("aria-label", `Switch to ${previousTheme} mode`);
});