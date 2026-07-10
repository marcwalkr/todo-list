import ProjectStore from "./projectStore.js";

const html = document.querySelector("html");

const sidebar = document.getElementById("sidebar");
const toggleSidebarBtn = document.getElementById("toggle-sidebar-button");

const addTaskBtn = document.getElementById("add-task-button");
const editTaskDialog = document.getElementById("edit-task-dialog");

const projectNav = document.getElementById("project-navigation");
const addProjectBtn = document.getElementById("add-project-button");
const toggleProjectsBtn = document.getElementById("toggle-projects-button");
const toggleProjectsIcon = document.getElementById("toggle-projects-icon");

const projectListWrapper = document.getElementById("projects-wrapper");
const projectList = document.getElementById("project-list");

const newProjectEditor = document.getElementById("new-project-editor");
const newProjectForm = document.getElementById("new-project-form");
const projectNameInput = document.getElementById("project-name-input");

const backdrop = document.getElementById("backdrop");
const projectMenu = document.getElementById("project-menu");
const deleteProjectBtn = document.getElementById("delete-project-button");

const deleteProjectDialog = document.getElementById("delete-project-dialog");
const deleteDialogProjectName = document.getElementById("delete-dialog-project-name");

const editColorBtn = document.getElementById("edit-color-button");
const colorPopover = document.getElementById("color-popover");
const selectedColor = document.getElementById("selected-color-icon");

const themeToggleBtn = document.getElementById("theme-toggle-button");

export const setSidebarExpanded = (expanded) => {
  const isExpanded = sidebar.dataset.expanded === "true";
  if (expanded === isExpanded) return;
  
  sidebar.classList.add("sidebar--toggled");
  toggleSidebarBtn.classList.add("sidebar__toggle-btn--toggled");

  if (expanded) {
    sidebar.dataset.expanded = "true";
    sidebar.classList.remove("sidebar--collapsed");
    toggleSidebarBtn.classList.remove("sidebar__toggle-btn--collapsed");
    toggleSidebarBtn.setAttribute("aria-expanded", "true");
  } else {
    sidebar.dataset.expanded = "false";
    sidebar.classList.add("sidebar--collapsed");
    toggleSidebarBtn.classList.add("sidebar__toggle-btn--collapsed");
    toggleSidebarBtn.setAttribute("aria-expanded", "false");
  }
};

// Scroll UL to bottom
const scrollProjectList = () => {
  projectList.scrollTop = projectList.scrollHeight;
};

// Add a new project <li> in the sidebar
const appendProjectToSidebar = (project) => {
  const template = document.getElementById("project-template");
  const clone = template.content.cloneNode(true);

  const li = clone.querySelector("li");
  
  li.dataset.projectId = project.id;
  clone.querySelector("a").href = `#project-${project.id}`;
  clone.querySelector("circle").style.fill = project.color;
  clone.querySelector(".project__name").textContent = project.name;

  const optionsButton = clone.querySelector(".project__options-btn");
  optionsButton.addEventListener("click", () => {
    li.classList.add("row-reveal-action--open-popover");
    backdrop.classList.add("backdrop--active");
    deleteProjectDialog.dataset.projectId = project.id;
  });

  projectList.appendChild(li);

  // Always scroll instantly first
  scrollProjectList();

  const collapsed = toggleProjectsBtn.getAttribute("aria-expanded") === "false";
  if (collapsed) {
    toggleProjectsBtn.click(); // expands with animation
  } else {
    // Already expanded -> resize wrapper immediately
    projectListWrapper.style.height = `${projectList.scrollHeight}px`;
  }
};

export const removeProjectFromSidebar = (projectId) => {
  const projectItem = projectList.querySelector(`[data-project-id="${projectId}"]`);
  projectList.removeChild(projectItem);

  // Resize the wrapper so the new project editor appears in the right place
  projectListWrapper.style.height = `${projectList.scrollHeight}px`;
};

// Animate expand/collapse
const setProjectListExpanded = (expanded) => {
  toggleProjectsBtn.setAttribute("aria-expanded", expanded.toString());
  toggleProjectsIcon.classList.toggle("icon--rotate", !expanded);

  projectListWrapper.classList.add("sidebar__projects-wrapper--animate-height");
  projectList.classList.add("sidebar__project-list--disable-scroll");

  projectListWrapper.style.height = expanded ? `${projectList.scrollHeight}px` : 0;
};

export const setTheme = (theme) => {
  const current = html.dataset.theme;
  if (current === theme) return;
  if (theme !== "light" && theme !== "dark") return;

  themeToggleBtn.setAttribute("aria-label", `Switch to ${current} mode`);
  html.dataset.theme = theme;
  localStorage.setItem("theme", theme);
};

export const initSidebar = ({ onProjectCreate }) => {
  // Add all projects to the sidebar after reload from storage
  for (const project of ProjectStore.getAll()) {
    appendProjectToSidebar(project);
  }

  toggleSidebarBtn.addEventListener("click", () => {
    if (sidebar.dataset.expanded === "true") {
      setSidebarExpanded(false);
    } else {
      setSidebarExpanded(true);
    }
  });

  sidebar.addEventListener("transitionend", (e) => {
    if (e.propertyName === "width") {
      sidebar.classList.remove("sidebar--toggled");
      toggleSidebarBtn.classList.remove("sidebar__toggle-btn--toggled");
    }
  });
  
  // Open the dialog for adding a new task
  addTaskBtn.addEventListener("click", () => {
    editTaskDialog.showModal();
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

    projectListWrapper.classList.remove("sidebar__projects-wrapper--animate-height");
    projectList.classList.remove("sidebar__project-list--disable-scroll");
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

    const project = onProjectCreate(name, selectedColor.dataset.color);
    appendProjectToSidebar(project);

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

  // Hide the project menu popover when clicking anywhere outside
  backdrop.addEventListener("click", () => {
    projectMenu.hidePopover();
  });

  // When project menu popover closes, disable backdrop and remove the open popover class
  projectMenu.addEventListener("toggle", (e) => {
    if (e.newState === "closed") {
      backdrop.classList.remove("backdrop--active");
      document.querySelectorAll(".row-reveal-action--open-popover")
        .forEach(r => r.classList.remove("row-reveal-action--open-popover"));
    }
  });

  deleteProjectBtn.addEventListener("click", (e) => {
    const project = ProjectStore.get(deleteProjectDialog.dataset.projectId);
    deleteDialogProjectName.textContent = project.name;
    deleteProjectDialog.showModal();
  });

  // Toggle between light and dark mode
  themeToggleBtn.addEventListener("click", () => {
    const current = html.dataset.theme;
    const next = current === "dark" ? "light" : "dark";

    setTheme(next);
  });
};
