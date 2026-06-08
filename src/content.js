import ProjectStore from "./projectStore.js";

const contentHeading = document.getElementById("main-content-heading");

export const setContentHeading = (hash) => {
  if (hash.includes("project-")) {
    const projectId = hash.split("-")[1];
    const project = ProjectStore.get(projectId);
    contentHeading.textContent = project.name;
  } else {
    contentHeading.textContent = hash.charAt(0).toUpperCase() + hash.slice(1);
  }
};
