import { createProject } from "./project.js";
import { createUniqueId } from "./utils";

const ProjectStore = (() => {
  let projects = [];

  const load = () => {
    const raw = localStorage.getItem("projects");
    projects = raw ? JSON.parse(raw) : [];
  };

  const getIds = () => new Set(projects.map(p => p.id));

  const add = (project) => {
    projects.push(project);
  };

  const create = (name, color) => {
    const id = createUniqueId(8, getIds());
    const project = createProject(id, name, color);
    add(project);
    localStorage.setItem("projects", JSON.stringify(projects));
    return project;
  };

  const get = (id) => projects.find(project => project.id === id);

  const getAll = () => projects;

  const deleteProject = (projectId) => {
    projects = projects.filter((p) => p.id !== projectId);
    localStorage.setItem("projects", JSON.stringify(projects));
  };

  return { load, create, get, getAll, deleteProject };
})();

export default ProjectStore;
