import "./styles.css";
import ProjectStore from "./projectStore.js";
import TaskStore from "./taskStore.js";
import { initSidebar, setSidebarExpanded, removeProjectFromSidebar, setTheme } from "./sidebar.js";
import { 
  initModals,
  appendProjectToSelect,
  removeProjectFromSelect,
  openAddTaskDialog,
  openDeleteProjectDialog,
  openDeleteTaskDialog
} from "./modal.js";
import { setContentHeading, loadTasks, removeTaskFromList, initContent } from "./content.js";

const getHeadingFromHash = () => {
  const hash = window.location.hash;
  if (hash.includes("project-")) {
    const projectId = hash.split("-")[1];
    const project = ProjectStore.get(projectId);
    return project.name;
  } else {
    return hash.charAt(1).toUpperCase() + hash.slice(2);
  }
};

const getViewFromHash = () => {
  const hash = window.location.hash;
  if (hash === "#today") return "status:today";
  if (hash === "#upcoming") return "status:upcoming";
  if (hash === "#important") return "status:important";
  if (hash === "#completed") return "status:completed";
  if (hash === "#inbox") return "project:inbox";
  if (hash.startsWith("#project-")) return "project:" + hash.slice(9);
  return null;
};

document.addEventListener("DOMContentLoaded", () => {
  if (!window.location.hash) {
    window.location.hash = "#inbox";
  }

  ProjectStore.load();
  TaskStore.load();

  initSidebar({
    onProjectCreate: (name, color) => {
      const project = ProjectStore.create(name, color);
      appendProjectToSelect(project);
      return project;
    },

    onAddTaskClick: () => openAddTaskDialog(),

    onDeleteClick: (projectId) => {
      const projectName = ProjectStore.get(projectId).name;
      openDeleteProjectDialog(projectId, projectName);
    }
  });

  initModals({
    onTaskCreate: (projectId, title, description, dueDate, priority) => {
      TaskStore.create(projectId, title, description, dueDate, priority);
      loadTasks(getViewFromHash());
    },

    onProjectDelete: (projectId) => {
      // Redirect to inbox if current page is the deleted project
      if (window.location.hash === `#project-${projectId}`) {
        window.location.hash = "#inbox";
      }

      TaskStore.deleteByProjectId(projectId);
      ProjectStore.deleteProject(projectId);
      removeProjectFromSidebar(projectId);
      removeProjectFromSelect(projectId);
    },

    onTaskDelete: (taskId) => {
      TaskStore.deleteTask(taskId);
      removeTaskFromList(taskId);
    }
  });

  initContent({
    onDeleteClick: (taskId) => {
      const taskName = TaskStore.get(taskId).title;
      openDeleteTaskDialog(taskId, taskName);
    }
  });

  setContentHeading(getHeadingFromHash());
  loadTasks(getViewFromHash());
});

window.addEventListener("hashchange", () => {
  setContentHeading(getHeadingFromHash());
  loadTasks(getViewFromHash());
});

const mq = window.matchMedia("(min-width: 1025px)");
mq.addEventListener("change", (e) => setSidebarExpanded(e.matches));
setSidebarExpanded(mq.matches);

const theme = localStorage.getItem("theme");
setTheme(theme);