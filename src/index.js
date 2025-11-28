import "./styles.css";

const html = document.querySelector("html");

const projectNav = document.querySelector("[data-project-navigation]");
const addProjectBtn = document.querySelector("[data-add-project]");
const toggleProjectsBtn = document.querySelector("[data-toggle-projects]");
const toggleProjectsIcon = document.querySelector("[data-toggle-projects] svg");

const projectListWrapper = document.querySelector("[data-project-list-wrapper]");
const projectList = document.querySelector("#sidebar-project-list");

const newProjectEditor = document.querySelector("[data-new-project-editor");
const newProjectForm = document.querySelector("#new-project-form");
const projectNameInput = document.querySelector("#project-name-input");

const editColorBtn = document.querySelector("[data-edit-color]");
const colorPopover = document.querySelector("[data-color-popover]");
const selectedColor = document.querySelector("[data-selected-color]");

const themeToggleBtn = document.querySelector("[data-toggle-theme]");

// Scroll UL to bottom
const scrollProjectList = () => {
  projectList.scrollTop = projectList.scrollHeight;
};

// Create a new project <li>
const appendNewProject = (name, color, parent) => {
  const li = document.createElement("li");

  const link = document.createElement("a");
  link.classList.add("sidebar__row", "clickable-surface");
  link.href = "#";

  // Dot icon
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("icon-md");
  svg.setAttribute("viewBox", "0 0 24 24");

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", "12");
  circle.setAttribute("cy", "12");
  circle.setAttribute("r", "6");
  circle.style.fill = color;
  svg.appendChild(circle);

  // Label
  const label = document.createElement("span");
  label.classList.add("text-md", "text-fg", "sidebar__project-name");
  label.textContent = name;

  link.appendChild(svg);
  link.appendChild(label);
  li.appendChild(link);
  parent.appendChild(li);
};

// Animate expand/collapse
const setProjectListExpanded = (expanded) => {
  toggleProjectsBtn.setAttribute("aria-expanded", expanded.toString());
  toggleProjectsIcon.classList.toggle("rotate", expanded);

  projectListWrapper.classList.add("animate-height");
  projectList.classList.add("disable-scroll");

  projectListWrapper.style.height = expanded ? `${projectList.scrollHeight}px` : 0;
};

// "Add Project" button
addProjectBtn.addEventListener("click", () => {
  const firstColor = colorPopover.querySelector("[data-color]").dataset.color;
  selectedColor.style.fill = firstColor;

  projectNameInput.value = "";
  newProjectForm.classList.remove("hidden");

  scrollProjectList();
  projectNameInput.focus();
});

// Expand/collapse toggle
toggleProjectsBtn.addEventListener("click", () => {
  const expanded = toggleProjectsBtn.getAttribute("aria-expanded") === "true";
  setProjectListExpanded(!expanded);
});

// Height transition finished
projectListWrapper.addEventListener("transitionend", (event) => {
  if (event.target !== projectListWrapper) return;

  projectListWrapper.classList.remove("animate-height");
  projectList.classList.remove("disable-scroll");
});

// Hide new project UI when clicking outside
newProjectEditor.addEventListener("focusout", (event) => {
  if (newProjectEditor.contains(event.relatedTarget)) return;

  newProjectForm.classList.add("hidden");
  colorPopover.classList.add("hidden");
});

// Submit new project
newProjectForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = projectNameInput.value.trim();
  if (!name) return;

  appendNewProject(name, selectedColor.style.fill, projectList);

  // Always scroll instantly first
  scrollProjectList();

  const collapsed = toggleProjectsBtn.getAttribute("aria-expanded") === "false";
  if (collapsed) {
    toggleProjectsBtn.click(); // expands with animation
  } else {
    // Already expanded -> resize wrapper immediately
    projectListWrapper.style.height = `${projectList.scrollHeight}px`;
  }

  newProjectForm.classList.add("hidden");
});

// Color button opens popover
editColorBtn.addEventListener("click", () => {
  colorPopover.classList.toggle("hidden");

  if (colorPopover.classList.contains("hidden")) return;

  // Reset to below, then check if it should move above
  colorPopover.classList.remove("above");

  requestAnimationFrame(() => {
    const navBottom = projectNav.getBoundingClientRect().bottom;
    const popoverBottom = colorPopover.getBoundingClientRect().bottom;

    if (popoverBottom > navBottom) {
      colorPopover.classList.add("above");
    }
  });
});

// Focus input hides color popover
projectNameInput.addEventListener("focus", () => {
  colorPopover.classList.add("hidden");
});

// Pick color from popover
colorPopover.addEventListener("click", (event) => {
  if (!event.target.hasAttribute("data-color")) return;

  selectedColor.style.fill = event.target.dataset.color;
  projectNameInput.focus();
});

// Theme toggle
themeToggleBtn.addEventListener("click", () => {
  const current = html.dataset.theme;
  const next = current === "dark" ? "light" : "dark";

  html.dataset.theme = next;
  themeToggleBtn.setAttribute("aria-label", `Switch to ${current} mode`);
});