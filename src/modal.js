import ProjectStore from "./projectStore";

const addTaskDialog = document.getElementById("add-task-dialog");
const addTaskForm = document.getElementById("add-task-form");
const dueDateInput = document.getElementById("due-date-input");
const projectSelect = document.getElementById("project-select");

const deleteTaskDialog = document.getElementById("delete-task-dialog");

const deleteProjectDialog = document.getElementById("delete-project-dialog");

export const appendProjectToSelect = (project) => {
  const option = document.createElement("option");
  option.value = project.id;
  option.textContent = project.name;
  projectSelect.appendChild(option);
};

export const removeProjectFromSelect = (projectId) => {
  const child = projectSelect.querySelector(`option[value="${projectId}"]`);
  projectSelect.removeChild(child);
};

export const initModals = ({ onTaskCreate, onTaskDelete, onProjectDelete }) => {
  // Disable selecting due dates in the past
  const today = new Date().toISOString().split("T")[0];
  dueDateInput.setAttribute("min", today);

  // Add all projects to select dropdown after reload from storage
  for (const project of ProjectStore.getAll()) {
    appendProjectToSelect(project);
  }

  addTaskDialog.addEventListener("close", () => {
    if (addTaskDialog.returnValue === "submit") {
      const data = Object.fromEntries(new FormData(addTaskForm));
      onTaskCreate(data.project, data.title, data.description, data.dueDate, data.priority);
    }

    addTaskForm.reset();
    addTaskDialog.returnValue = "";
  });

  deleteTaskDialog.addEventListener("close", (e) => {
    if (deleteTaskDialog.returnValue === "delete") {
      onTaskDelete(e.target.dataset.taskId);
    }

    deleteTaskDialog.returnValue = "";
  });

  deleteProjectDialog.addEventListener("close", (e) => {
    if (deleteProjectDialog.returnValue === "delete") {
      onProjectDelete(e.target.dataset.projectId);
    }

    deleteProjectDialog.returnValue = "";
  });
};
