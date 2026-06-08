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

// Add a new project <li> in the sidebar
const appendProjectToSidebar = (project, parent) => {
  const template = document.getElementById("project-template");
  const clone = template.content.cloneNode(true);

  const li = clone.querySelector("li");
  
  li.dataset.projectId = project.id;
  clone.querySelector("a").href = `#project-${project.id}`;
  clone.querySelector("circle").style.fill = project.color;
  clone.querySelector(".sidebar__project-name").textContent = project.name;

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

export function initSidebar() {
  // Open the dialog for adding a new task
  addTaskBtn.addEventListener("click", () => {
    addTaskDialog.showModal();
  });

  // Clear the form when Add Task dialog closes
  addTaskDialog.addEventListener("close", () => {
    addTaskForm.reset();
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
}
