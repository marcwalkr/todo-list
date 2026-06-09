import ProjectStore from "./projectStore";

const projectSelect = document.getElementById("project-select");

export const appendProjectToSelect = (project) => {
  const option = document.createElement("option");
  option.value = project.id;
  option.textContent = project.name;
  projectSelect.appendChild(option);
};

const initProjectSelect = () => {
  for (const project of ProjectStore.getAll()) {
    appendProjectToSelect(project);
  }
};

export const initModals = () => {
  // Add all projects to select dropdown after reload from storage
  initProjectSelect();
};
