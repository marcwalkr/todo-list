import "./styles.css";

const html = document.querySelector("html");
const projectNavigation = document.querySelector("[data-project-navigation]");
const projectListScrollWrapper = document.querySelector("[data-project-list-scroll-wrapper]");
const addProjectBtn = document.querySelector("[data-add-project]");
const newProjectEditor = document.querySelector("[data-new-project-editor");
const newProjectForm = document.querySelector("#new-project-form");
const editColorBtn = document.querySelector("[data-edit-color]");
const selectedColor = document.querySelector("[data-selected-color]");
const colorPopover = document.querySelector("[data-color-popover]");
const newProjectInput = document.querySelector("#project-name-input");
const toggleProjectsBtn = document.querySelector("[data-toggle-projects]");
const toggleProjectsIcon = document.querySelector("[data-toggle-projects] svg");
const projectList = document.querySelector("#sidebar-project-list");
const themeToggleBtn = document.querySelector("[data-toggle-theme]");

const animateListHeight = (callback) => {
  // Disable scroll during animation
  projectListScrollWrapper.classList.add("disable-scroll");

  callback();

  // Re-enable scroll after animation ends
  projectList.addEventListener(
    "transitionend", 
    () => {
      projectListScrollWrapper.classList.remove("disable-scroll");
    }, 
    { once: true }
  );
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
  newProjectInput.value = "";
  newProjectForm.classList.remove("hidden");
  newProjectInput.focus();
});

toggleProjectsBtn.addEventListener("click", () => {
  animateListHeight(() => {
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


colorPopover.addEventListener("click", (event) => {
  if (!event.target.hasAttribute("data-color")) return;

  const color = event.target.dataset.color;
  selectedColor.style.fill = color;
  newProjectInput.focus();
  colorPopover.classList.add("hidden");
});

newProjectForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const projectName = newProjectInput.value;
  if (!projectName) return;

  animateListHeight(() => {
    appendNewProject(projectName, selectedColor.style.fill, projectList);
    projectList.style.height = `${projectList.scrollHeight}px`;
  });

  // Ensure expanded state
  if (toggleProjectsBtn.getAttribute("aria-expanded") === "false") {
    toggleProjectsIcon.classList.toggle("rotate");
    toggleProjectsBtn.setAttribute("aria-expanded", "true");
  }

  newProjectForm.classList.add("hidden");
});

newProjectEditor.addEventListener("focusout", (event) => {
  if (newProjectEditor.contains(event.relatedTarget)) return;

  newProjectForm.classList.add("hidden");
  colorPopover.classList.add("hidden");
});

themeToggleBtn.addEventListener("click", () => {
  const previousTheme = html.dataset.theme;
  const newTheme = previousTheme === "dark" ? "light" : "dark";

  html.dataset.theme = newTheme;
  themeToggleBtn.setAttribute("aria-label", `Switch to ${previousTheme} mode`);
});