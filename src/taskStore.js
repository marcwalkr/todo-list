import { createTask } from "./task.js";
import { createUniqueId, isToday } from "./utils";

const TaskStore = (() => {
  let tasks = [];

  const load = () => {
    const raw = localStorage.getItem("tasks");
    tasks = raw ? JSON.parse(raw) : [];
  };

  const getIds = () => new Set(tasks.map(t => t.id));

  const add = (task) => {
    tasks.push(task);
  };

  const create = (projectId, title, description, dueDate, priority) => {
    const id = createUniqueId(8, getIds());
    const task = createTask(id, projectId, title, description, dueDate, priority);
    add(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return task;
  };

  const setCompleted = (taskId, completed) => {
    const task = tasks.filter((t) => t.id === taskId)[0];
    task.completed = completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const getByProjectId = (projectId) => {
    return tasks.filter(
      (task) => task.projectId === projectId && !task.completed
    );
  };

  const getToday = () => {
    return tasks.filter(
      (task) => isToday(task.dueDate) && !task.completed
    );
  };

  const getUpcoming = () => {
    return tasks.filter(
      (task) => task.dueDate && !isToday(task.dueDate) && !task.completed
    );
  };

  const getImportant = () => {
    return tasks.filter(
      (task) => task.priority === "high" && !task.completed
    );
  };

  const getCompleted = () => {
    return tasks.filter(
      (task) => task.completed
    );
  };

  return { load, create, setCompleted, getByProjectId, getToday, getUpcoming, getImportant, getCompleted };
})();

export default TaskStore;
