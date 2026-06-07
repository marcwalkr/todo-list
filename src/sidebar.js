import { setContentHeading } from "./content";
import ProjectStore from "./projectStore.js";

const html = document.querySelector("html");

const addTaskBtn = document.getElementById("add-task-button");
const addTaskDialog = document.getElementById("add-task-dialog");
const addTaskForm = document.getElementById("add-task-form");
const projectSelect = document.getElementById("project-select");

const taskNav = document.getElementById("task-navigation");

const projectNav = document.getElementById("project-navigation");
const addProjectBtn = document.getElementById("add-project-button");
const toggleProjectsBtn = document.getElementById("toggle-projects-button");
const toggleProjectsIcon = document.getElementById("toggle-projects-icon");

const projectListWrapper = document.getElementById("project-list-wrapper");
const projectList = document.getElementById("sidebar-project-list");

const newProjectEditor = document.getElementById("new-project-editor");
const newProjectForm = document.getElementById("new-project-form");
const projectNameInput = document.getElementById("project-name-input");

const editColorBtn = document.getElementById("edit-color-button");
const colorPopover = document.getElementById("color-popover");
const selectedColor = document.getElementById("selected-color-icon");

const themeToggleBtn = document.getElementById("theme-toggle-button");

// Scroll UL to bottom
const scrollProjectList = () => {
  projectList.scrollTop = projectList.scrollHeight;
};

// Create a new project <li> for sidebar
const appendProjectToSidebar = (project, parent) => {
  const li = document.createElement("li");
  li.dataset.projectId = project.id;

  const link = document.createElement("a");
  link.classList.add("sidebar__row", "clickable-surface");
  link.href = `#project-${project.id}`;

  // Dot icon
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("icon", "icon--md");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("viewBox", "0 0 24 24");

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", "12");
  circle.setAttribute("cy", "12");
  circle.setAttribute("r", "6");
  circle.style.fill = project.color;
  svg.appendChild(circle);

  // Label
  const label = document.createElement("span");
  label.classList.add("text-md", "text-fg", "sidebar__project-name");
  label.textContent = project.name;

  link.appendChild(svg);
  link.appendChild(label);
  li.appendChild(link);
  parent.appendChild(li);
};

// Create a new project <option> for Add Task modal select
const appendProjectToSelect = (project, parent) => {
  const option = document.createElement("option");
  option.dataset.projectId = project.id;
  option.textContent = project.name;
  parent.appendChild(option);
}

// Animate expand/collapse
const setProjectListExpanded = (expanded) => {
  toggleProjectsBtn.setAttribute("aria-expanded", expanded.toString());
  toggleProjectsIcon.classList.toggle("rotate", !expanded);

  projectListWrapper.classList.add("animate-height");
  projectList.classList.add("disable-scroll");

  projectListWrapper.style.height = expanded ? `${projectList.scrollHeight}px` : 0;
};

// Open the dialog for adding a new task
addTaskBtn.addEventListener("click", () => {
  addTaskDialog.showModal();
});

// Clear the form when Add Task dialog closes
addTaskDialog.addEventListener("close", () => {
  addTaskForm.reset();
});

// Task lists: Inbox, Today, Upcoming, Important, Completed
taskNav.addEventListener("click", (event) => {
  setContentHeading(event);
});

// Project links: Projects (manage project list), individual projects
projectNav.addEventListener("click", (event) => {
  setContentHeading(event);
});

// Create a new project
addProjectBtn.addEventListener("click", () => {
  const firstColor = colorPopover.querySelector("[data-color]").dataset.color;
  selectedColor.style.fill = firstColor;
  selectedColor.dataset.color = firstColor;

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

  const project = ProjectStore.create(name, selectedColor.dataset.color);
  appendProjectToSidebar(project, projectList);

  // Also add project to dropdown in Add Task form
  appendProjectToSelect(project, projectSelect);

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
  selectedColor.dataset.color = event.target.dataset.color;
  projectNameInput.focus();
});

// Toggle between light and dark mode
themeToggleBtn.addEventListener("click", () => {
  const current = html.dataset.theme;
  const next = current === "dark" ? "light" : "dark";

  html.dataset.theme = next;
  themeToggleBtn.setAttribute("aria-label", `Switch to ${current} mode`);
});
