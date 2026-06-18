import ProjectStore from "./projectStore";

const addTaskDialog = document.getElementById("add-task-dialog");
const addTaskForm = document.getElementById("add-task-form");

const projectSelect = document.getElementById("project-select");

const deleteProjectDialog = document.getElementById("delete-project-dialog");

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

export const initModals = ({ onTaskCreate, onProjectDelete }) => {
  // Add all projects to select dropdown after reload from storage
  initProjectSelect();

  addTaskDialog.addEventListener("close", () => {
    if (addTaskDialog.returnValue === "submit") {
      const data = Object.fromEntries(new FormData(addTaskForm));
      onTaskCreate(data.project, data.title, data.description, data.dueDate, data.priority);
      addTaskForm.reset();
    }
  });

  deleteProjectDialog.addEventListener("close", (e) => {
    if (deleteProjectDialog.returnValue === "delete") {
      onProjectDelete(e.target.dataset.projectId);
    }
  });
};
