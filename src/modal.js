import ProjectStore from "./projectStore";
import TaskStore from "./taskStore";

const editTaskDialog = document.getElementById("edit-task-dialog");
const editTaskForm = document.getElementById("edit-task-form");
const titleInput = document.getElementById("title-input");
const descriptionInput = document.getElementById("description-input");
const dueDateInput = document.getElementById("due-date-input");
const prioritySelect = document.getElementById("priority-select");
const projectSelect = document.getElementById("project-select");
const submitButton = document.getElementById("edit-task-submit-button");

const deleteTaskDialog = document.getElementById("delete-task-dialog");
const deleteDialogTaskName = document.getElementById("delete-dialog-task-name");

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

export const openEditTaskDialog = (taskId) => {
  submitButton.value = "save";
  submitButton.textContent = "Save";

  editTaskDialog.dataset.taskId = taskId;

  const task = TaskStore.get(taskId);
  titleInput.value = task.title;
  descriptionInput.value = task.description;
  dueDateInput.value = task.dueDate;

  // Make the value empty instead of undefined so the select label properly displays
  if (task.priority) {
    prioritySelect.value = task.priority;
  } else {
    prioritySelect.value = "";
  }
  
  projectSelect.value = task.projectId;

  editTaskDialog.showModal();
};

export const openDeleteProjectDialog = (projectId, projectName) => {
  deleteProjectDialog.dataset.projectId = projectId;
  deleteDialogProjectName.textContent = projectName;
  deleteProjectDialog.showModal();
};

export const openDeleteTaskDialog = (taskId, taskName) => {
  deleteTaskDialog.dataset.taskId = taskId;
  deleteDialogTaskName.textContent = taskName;
  deleteTaskDialog.showModal();
}

export const initModals = ({ onTaskCreate, onTaskDelete, onTaskEdit, onProjectDelete }) => {
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
    } else if (editTaskDialog.returnValue === "save") {
      onTaskEdit(
        editTaskDialog.dataset.taskId, 
        projectSelect.value, 
        titleInput.value, 
        descriptionInput.value, 
        dueDateInput.value, 
        prioritySelect.value
      );
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
