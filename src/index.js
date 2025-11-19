import "./styles.css";

const html = document.querySelector("html");
const toggleProjectsBtn = document.querySelector("[data-toggle-projects]");
const toggleProjectsIcon = document.querySelector("[data-toggle-projects] svg");
const projectList = document.querySelector("#project-list");
const themeToggleBtn = document.querySelector("[data-toggle-theme]");

toggleProjectsBtn.addEventListener("click", () => {
  const previousExpanded = toggleProjectsBtn.getAttribute("aria-expanded");
  const newExpanded = previousExpanded === "true" ? "false" : "true";

  toggleProjectsIcon.classList.toggle("rotate");

  projectList.style.height = `${projectList.scrollHeight}px`;

  // Force reflow to ensure the collapse animation works the first time
  projectList.scrollHeight;

  if (newExpanded === "false") {
    projectList.style.height = 0;
  }

  toggleProjectsBtn.setAttribute("aria-expanded", newExpanded);
});

themeToggleBtn.addEventListener("click", () => {
  const previousTheme = html.dataset.theme;
  const newTheme = previousTheme === "dark" ? "light" : "dark";

  html.dataset.theme = newTheme;
  themeToggleBtn.setAttribute("aria-label", `Switch to ${previousTheme} mode`);
});