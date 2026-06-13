export const createTask = (id, projectId, title, description, dueDate, priority) => {
  return { id, projectId, title, description, dueDate, priority, completed: false };
};
