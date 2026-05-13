export const toDo = () => {
  const projects = [
    {
      projectTitle: 'Default Project',
      description: 'Example project',
      tasks: [
        {
          title: 'first',
          description: 'Nothing to do',
          dueDate: '2026-05-15',
          priority: 'high',
          notes: 'notes',
          state: 'No',
        },
      ],
    },
  ];

  const createProject = (projectTitle) => {
    const tasks = [];
    const project = { projectTitle, tasks };
    projects.push(project);
    saveData();
    return project;
  };
  const createTask = (
    project,
    title,
    description,
    dueDate,
    priority,
    notes,
    state
  ) => {
    const task = {
      title,
      description,
      dueDate,
      priority,
      notes,
      state,
    };
    project.tasks.push(task);
    saveData();
    return task;
  };

  const deleteTask = (project, i) => {
    project.tasks.splice(i, 1);
    saveData();
  };

  const deleteProject = (i) => {
    projects.splice(i, 1);
    saveData();
  };
  const saveData = () => {
    localStorage.setItem('projects', JSON.stringify(projects));
  };

  const saved = localStorage.getItem('projects');
  if (saved) {
    const loaded = JSON.parse(saved);
    projects.splice(0, projects.length, ...loaded);
  }
  return {
    projects,
    createProject,
    createTask,
    deleteTask,
    saveData,
    deleteProject,
  };
};
