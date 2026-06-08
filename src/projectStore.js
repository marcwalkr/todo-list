import { createProject } from "./project.js";
import { createUniqueId } from "./utils";

const ProjectStore = (() => {
  const projects = [];

  const getIds = () => new Set(projects.map(p => p.id));

  const add = (project) => {
    projects.push(project);
  };

  const create = (name, color) => {
    const id = createUniqueId(8, getIds());
    const project = createProject(id, name, color);
    add(project);
    return project;
  };

  const get = (id) => projects.find(project => project.id === id);

  return { create, get };
})();

export default ProjectStore;
