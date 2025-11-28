import "./styles.css";

const html = document.querySelector("html");
const projectNavigation = document.querySelector("[data-project-navigation]");
const addProjectBtn = document.querySelector("[data-add-project]");
const toggleProjectsBtn = document.querySelector("[data-toggle-projects]");
const toggleProjectsIcon = document.querySelector("[data-toggle-projects] svg");
const projectListWrapper = document.querySelector("[data-project-list-wrapper]");
const projectList = document.querySelector("#sidebar-project-list");
const newProjectEditor = document.querySelector("[data-new-project-editor");
const newProjectForm = document.querySelector("#new-project-form");
const editColorBtn = document.querySelector("[data-edit-color]");
const selectedColor = document.querySelector("[data-selected-color]");
const projectNameInput = document.querySelector("#project-name-input");
const colorPopover = document.querySelector("[data-color-popover]");
const themeToggleBtn = document.querySelector("[data-toggle-theme]");

const scrollProjectList = () => {
  projectList.scrollTop = projectList.scrollHeight;
}

const appendNewProject = (projectName, color, parent) => {
  const listElement = document.createElement("li");

  const link = document.createElement("a");
  link.classList.add("sidebar__row", "clickable-surface");
  link.href = "#";
  listElement.appendChild(link);

  const svgNS = "http://www.w3.org/2000/svg";
  const dotIcon = document.createElementNS(svgNS, "svg");
  dotIcon.classList.add("icon-md");
  dotIcon.setAttribute("aria-hidden", "true");
  dotIcon.setAttribute("viewBox", "0 0 24 24");
  link.appendChild(dotIcon);

  const circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute("cx", "12");
  circle.setAttribute("cy", "12");
  circle.setAttribute("r", "6");
  circle.style.fill = color;
  dotIcon.appendChild(circle);

  const nameLabel = document.createElement("span");
  nameLabel.classList.add("text-md", "text-fg", "sidebar__project-name");
  nameLabel.textContent = projectName;
  link.appendChild(nameLabel);

  parent.appendChild(listElement);
}

addProjectBtn.addEventListener("click", () => {
  const firstColor = colorPopover.querySelector("[data-color]").dataset.color;
  selectedColor.style.fill = firstColor;

  projectNameInput.value = "";
  newProjectForm.classList.remove("hidden");
  scrollProjectList();
  projectNameInput.focus();
});

toggleProjectsBtn.addEventListener("click", () => {
  const previousExpanded = toggleProjectsBtn.getAttribute("aria-expanded");
  const newExpanded = previousExpanded === "true" ? "false" : "true";

  toggleProjectsBtn.setAttribute("aria-expanded", newExpanded);
  toggleProjectsIcon.classList.toggle("rotate");

  projectListWrapper.classList.add("animate-height");
  projectListWrapper.style.height = newExpanded === "true" ? `${projectList.scrollHeight}px` : 0;
});

projectListWrapper.addEventListener("transitionend", (event) => {
  if (event.target !== projectListWrapper) return;
  projectListWrapper.classList.remove("animate-height");
});

newProjectEditor.addEventListener("focusout", (event) => {
  if (newProjectEditor.contains(event.relatedTarget)) return;

  newProjectForm.classList.add("hidden");
  colorPopover.classList.add("hidden");
});

newProjectForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const projectName = projectNameInput.value;
  if (!projectName) return;

  appendNewProject(projectName, selectedColor.style.fill, projectList);
  scrollProjectList();

  const isCollapsed = toggleProjectsBtn.getAttribute("aria-expanded") === "false";
  if (isCollapsed) {
    toggleProjectsBtn.click();
  } else {
    projectListWrapper.style.height = `${projectList.scrollHeight}px`;
  }

  newProjectForm.classList.add("hidden");
});

editColorBtn.addEventListener("click", () => {
  // Toggle visible
  colorPopover.classList.toggle("hidden");

  // If hiding, stop here
  if (colorPopover.classList.contains("hidden")) return;

  // Reset position (force below)
  colorPopover.classList.remove("above");

  // Move the popover above if it overflows
  requestAnimationFrame(() => {
    const navBottom = projectNavigation.getBoundingClientRect().bottom;
    const popoverBottom = colorPopover.getBoundingClientRect().bottom;

    if (popoverBottom > navBottom) {
      colorPopover.classList.add("above");
    }
  });
});

projectNameInput.addEventListener("focus", () => {
  colorPopover.classList.add("hidden");
});

colorPopover.addEventListener("click", (event) => {
  if (!event.target.hasAttribute("data-color")) return;

  selectedColor.style.fill = event.target.dataset.color;
  projectNameInput.focus();
});

themeToggleBtn.addEventListener("click", () => {
  const previousTheme = html.dataset.theme;
  const newTheme = previousTheme === "dark" ? "light" : "dark";

  html.dataset.theme = newTheme;
  themeToggleBtn.setAttribute("aria-label", `Switch to ${previousTheme} mode`);
});