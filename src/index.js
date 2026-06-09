import "./styles.css";
import ProjectStore from "./projectStore.js";
import { initSidebar } from "./sidebar.js";
import { initModals, appendProjectToSelect } from "./modal.js";
import { setContentHeading } from "./content.js";

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
  setContentHeading(window.location.hash.slice(1));
});

window.addEventListener("hashchange", () => {
  setContentHeading(window.location.hash.slice(1));
});