import "./styles.css";

const html = document.querySelector("html");
const toggleProjectsBtn = document.querySelector(".sidebar__toggle-projects-btn");
const toggleProjectsIcon = document.querySelector(".sidebar__toggle-projects-btn svg");
const projectList = document.querySelector("#project-list");
const themeToggleBtn = document.querySelector(".sidebar__theme-toggle-btn");

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