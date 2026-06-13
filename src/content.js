import TaskStore from "./taskStore.js";
import { formatRelativeDate, isDayOfWeek } from "./utils.js";

const contentHeading = document.getElementById("main-content-heading");

const taskList = document.getElementById("task-list");
const taskTemplate = document.getElementById("task-template");

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
  
  clone.querySelector(".task__title").textContent = task.title;
  clone.querySelector(".task__description").textContent = task.description;

  const dueDateRow = clone.querySelector(".task__due-date-row");
  if (task.dueDate) {
    const dateString = formatRelativeDate(task.dueDate);
    clone.querySelector(".task__due-date").textContent = dateString;

    if (dateString === "Today") dueDateRow.classList.add("task__due-date-row--today");
    if (dateString === "Tomorrow") dueDateRow.classList.add("task__due-date-row--tomorrow");
    if (isDayOfWeek(dateString)) dueDateRow.classList.add("task__due-date-row--weekday");
  } else {
    dueDateRow.classList.add("hidden");
  }

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
