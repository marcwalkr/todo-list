import "./styles.css";
import ProjectStore from "./projectStore.js";
import { initSidebar } from "./sidebar.js";
import { initModals, appendProjectToSelect } from "./modal.js";
import { setContentHeading } from "./content.js";

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

document.addEventListener("DOMContentLoaded", () => {
  ProjectStore.load();

  initSidebar({
    onProjectCreate: (name, color) => {
      const project = ProjectStore.create(name, color);
      appendProjectToSelect(project);
      return project;
    }
  });

  initModals();
  setContentHeading(getHeadingFromHash());
});

window.addEventListener("hashchange", () => {
  setContentHeading(getHeadingFromHash());
});