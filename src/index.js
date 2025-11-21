import "./styles.css";

const html = document.querySelector("html");
const addProjectBtn = document.querySelector("[data-add-project]");
const newProjectForm = document.querySelector("#new-project-form");
const newProjectInput = document.querySelector("#new-project-input");
const toggleProjectsBtn = document.querySelector("[data-toggle-projects]");
const toggleProjectsIcon = document.querySelector("[data-toggle-projects] svg");
const projectList = document.querySelector("#sidebar-project-list");
const themeToggleBtn = document.querySelector("[data-toggle-theme]");

const appendNewProject = (projectName, parent) => {
  const listElement = document.createElement("li");

  const link = document.createElement("a");
  link.classList.add("sidebar__row", "clickable-surface");
  link.href = "#";
  listElement.appendChild(link);

  const svgNS = "http://www.w3.org/2000/svg";
  const dotIcon = document.createElementNS(svgNS, "svg");
  dotIcon.classList.add("icon-md", "fill-fg");
  dotIcon.setAttribute("aria-hidden", "true");
  dotIcon.setAttribute("viewBox", "0 0 24 24");
  link.appendChild(dotIcon);

  const circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute("cx", "12");
  circle.setAttribute("cy", "12");
  circle.setAttribute("r", "6");
  dotIcon.appendChild(circle);

  const nameLabel = document.createElement("span");
  nameLabel.classList.add("text-md", "text-fg", "sidebar__project-name");
  nameLabel.textContent = projectName;
  link.appendChild(nameLabel);

  parent.appendChild(listElement);
}

addProjectBtn.addEventListener("click", () => {
  newProjectInput.value = "";
  newProjectForm.classList.remove("hidden");
  newProjectInput.focus();
});

newProjectForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const projectName = newProjectInput.value;
  if (projectName !== "") {
    appendNewProject(projectName, projectList);
  }

  // Set the height to show the new project
  projectList.style.height = `${projectList.scrollHeight}px`;

  // Expand the list if it was collapsed
  const expanded = toggleProjectsBtn.getAttribute("aria-expanded");
  if (expanded === "false") {
    toggleProjectsIcon.classList.toggle("rotate");
    toggleProjectsBtn.setAttribute("aria-expanded", "true");
  }

  newProjectForm.classList.add("hidden");
});

newProjectInput.addEventListener("focusout", () => {
  newProjectForm.classList.add("hidden");
});

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