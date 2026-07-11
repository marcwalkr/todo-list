import ProjectStore from "./projectStore";

const editTaskDialog = document.getElementById("edit-task-dialog");
const editTaskForm = document.getElementById("edit-task-form");
const dueDateInput = document.getElementById("due-date-input");
const projectSelect = document.getElementById("project-select");
const submitButton = document.getElementById("edit-task-submit-button");

const deleteTaskDialog = document.getElementById("delete-task-dialog");

const deleteProjectDialog = document.getElementById("delete-project-dialog");
const deleteDialogProjectName = document.getElementById("delete-dialog-project-name");

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

export const openAddTaskDialog = () => {
  submitButton.value = "add";
  submitButton.textContent = "Add Task";

  editTaskDialog.showModal();
};

export const openDeleteProjectDialog = (projectId, projectName) => {
  deleteProjectDialog.dataset.projectId = projectId;
  deleteDialogProjectName.textContent = projectName;
  deleteProjectDialog.showModal();
};

export const initModals = ({ onTaskCreate, onTaskDelete, onProjectDelete }) => {
  // Disable selecting due dates in the past
  const today = new Date().toISOString().split("T")[0];
  dueDateInput.setAttribute("min", today);

  // Add all projects to select dropdown after reload from storage
  for (const project of ProjectStore.getAll()) {
    appendProjectToSelect(project);
  }

  editTaskDialog.addEventListener("close", () => {
    if (editTaskDialog.returnValue === "add") {
      const data = Object.fromEntries(new FormData(editTaskForm));
      onTaskCreate(data.project, data.title, data.description, data.dueDate, data.priority);
    }

    editTaskForm.reset();
    editTaskDialog.returnValue = "";
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
