import TaskStore from "./taskStore.js";
import { formatRelativeDate, hasDatePassed, isDayOfWeek } from "./utils.js";

const contentHeading = document.getElementById("main-content-heading");

const taskList = document.getElementById("task-list");
const taskTemplate = document.getElementById("task-template");

const backdrop = document.getElementById("backdrop");
const taskMenu = document.getElementById("task-menu");
const deleteTaskBtn = document.getElementById("delete-task-button");

const deleteTaskDialog = document.getElementById("delete-task-dialog");
const deleteDialogTaskName = document.getElementById("delete-dialog-task-name");

const fetchTasksByStatus = (status) => {
  if (status === "today") return TaskStore.getToday();
  if (status === "upcoming") return TaskStore.getUpcoming();
  if (status === "important") return TaskStore.getImportant();
  if (status === "completed") return TaskStore.getCompleted();
};

const getTaskListItem = (task) => { 
  const clone = taskTemplate.content.cloneNode(true);
  const li = clone.querySelector("li");
  li.dataset.taskId = task.id;

  const bubble = clone.querySelector(".task__bubble");
  if (task.priority === "high") bubble.classList.add("task__bubble--high");
  if (task.priority === "medium") bubble.classList.add("task__bubble--medium");
  if (task.priority === "low") bubble.classList.add("task__bubble--low");

  if (task.completed) {
    bubble.checked = true;
  }

  bubble.addEventListener("change", () => {
    li.classList.add("completing");
  });

  li.addEventListener("transitionend", (e) => {
    if (e.propertyName === "transform") {
      if (bubble.checked) {
        TaskStore.setCompleted(task.id, true);
      } else {
        TaskStore.setCompleted(task.id, false);
      }
      li.classList.remove("completing");
      taskList.removeChild(li);
    }
  });
  
  const title = clone.querySelector(".task__title");
  if (task.completed) {
    title.classList.add("task__title--completed");
  }
  title.textContent = task.title;

  const description = clone.querySelector(".task__description");
  if (task.completed) {
    description.classList.add("hidden");
  }
  description.textContent = task.description;

  const dueDateRow = clone.querySelector(".task__due-date-row");
  if (task.dueDate && !task.completed) {
    const dateString = formatRelativeDate(task.dueDate);
    clone.querySelector(".task__due-date").textContent = dateString;

    if (dateString === "Today") dueDateRow.classList.add("task__due-date-row--today");
    if (dateString === "Tomorrow") dueDateRow.classList.add("task__due-date-row--tomorrow");
    if (isDayOfWeek(dateString)) dueDateRow.classList.add("task__due-date-row--weekday");
    if (hasDatePassed(task.dueDate)) dueDateRow.classList.add("task__due-date-row--overdue");
  } else {
    dueDateRow.classList.add("hidden");
  }

  const optionsButton = clone.querySelector(".task__options-btn");
  optionsButton.addEventListener("click", () => {
    li.classList.add("has-open-popover");
    backdrop.classList.add("active");
    deleteTaskDialog.dataset.taskId = task.id;
  });

  return li;
};

export const setContentHeading = (heading) => {
  contentHeading.textContent = heading;
};

export const loadTasks = (view) => {
  if (!view) return;
  
  let tasks;
  if (view.startsWith("status:")) {
    const status = view.slice(7);
    tasks = fetchTasksByStatus(status);
  } else {
    const projectId = view.slice(8);
    tasks = TaskStore.getByProjectId(projectId);
  }

  const listItems = tasks.map(getTaskListItem);
  taskList.replaceChildren(...listItems);
};

export const removeTaskFromList = (taskId) => {
  const taskItem = taskList.querySelector(`[data-task-id="${taskId}"]`);
  taskList.removeChild(taskItem);
};

// Hide the task menu popover when clicking anywhere outside
backdrop.addEventListener("click", () => {
  taskMenu.hidePopover();
});

// When task menu popover closes, disable backdrop and remove the open popover class
taskMenu.addEventListener("toggle", (e) => {
  if (e.newState === "closed") {
    backdrop.classList.remove("active");
    document.querySelectorAll(".task.has-open-popover")
      .forEach(r => r.classList.remove("has-open-popover"));
  }
});

deleteTaskBtn.addEventListener("click", (e) => {
  const task = TaskStore.get(deleteTaskDialog.dataset.taskId);
  deleteDialogTaskName.textContent = task.title;
  deleteTaskDialog.showModal();
});
