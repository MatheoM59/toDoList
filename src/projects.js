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
          state: false,
        },
      ],
    },
  ];

  const createProject = (projectTitle) => {
    const tasks = [];

    const createTask = (
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
      tasks.push(task);

      return task;
    };

    const project = { projectTitle, tasks };
    projects.push(project);
    return project;
  };

  return { createProject, projects };
};
