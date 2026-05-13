export const display = (logic) => {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class='top'>
      <h1 id='title'>My To Do List</h1>
    </div>
    <div class='container'>
      <div id='sideProjects'></div>
      <div id='mainDiv'></div>
    </div>
  `;
  renderSideBar(logic);
  renderMain(logic);
  getProject(logic);
  projectCreator(logic);
  projectDeletor(logic);
};

// ─── Sidebar ────────────────────────────────────────────────────────────────

const renderSideBar = (logic) => {
  const sideBar = document.getElementById('sideProjects');
  sideBar.innerHTML = `
    <div class="subtitle">
      <h1>My Projects</h1>
    </div>
    <div id="projects">
      ${logic.projects
        .map(
          (project, i) => `
        <div class='project' data-index='${i}'>
          <div class='projectInfo'>
            <h3>${project.projectTitle}</h3>
            <p>${renderDescription(project)}</p>
          </div>
          <button id='binBtn'>Delete</button>
        </div>
      `
        )
        .join('')}
    </div>
    <div id='newProject'>
      <div class='subtitle'>
        <h2>New Project</h2>
      </div>
      <div class='inputNew'>
        <form>
          <input type="text" id="projectName" placeholder="Name" />
          <input type="submit" id="submit" />
        </form>
      </div>
    </div>
  `;
};

const renderDescription = (project) => {
  if (project.description === undefined) return '';
  return project.description;
};

const projectCreator = (logic) => {
  document.getElementById('submit').addEventListener('click', (e) => {
    e.preventDefault();
    const projectTitle = document.getElementById('projectName').value.trim();
    if (!projectTitle) return;
    const newProject = logic.createProject(projectTitle);
    renderSideBar(logic);
    renderMain(logic, newProject);
    projectCreator(logic);
  });
};

// ─── Main ────────────────────────────────────────────────────────────────────

const renderMain = (logic, project) => {
  const main = document.getElementById('mainDiv');
  if (!project) {
    main.innerHTML = `
      <div class="subtitle"><h1>Task</h1></div>
      <div id='taskDivNoPro'>
        <h2>Select or create a project</h2>
      </div>
      <div id="projectsGrid">
        ${logic.projects
          .map(
            (project, i) => `
          <div class='project' data-index='${i}'>
            <h3>${project.projectTitle}</h3>
            <p>${renderDescription(project)}</p>
          </div>
        `
          )
          .join('')}
      </div>
    `;
    return;
  }
  main.innerHTML = `
    <div class="subtitle"><h1>Task</h1></div>
    <div id='taskDiv'>
      <h2>${project.projectTitle}</h2>
      <div id='projectDescription'>
        ${renderDescriptionMain(logic, project)}
      </div>
      <div id='taskForm'>
        <form>
          <input type='text' id='titleInput' placeholder='Task title' />
          <input type='text' id='descriptionInput' placeholder='Description' />
          <input type='text' id='noteInput' placeholder='Notes' />
          <input type="date" id='dateInput' />
          <select id="priorityInput">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input type='submit' id='submitTask' />
        </form>
      </div>
      <div id="tasksList">
        ${project.tasks
          .map(
            (task, i) => `
          <div class='task' data-index='${i}'>
            <div class='taskTop'>
              <input type='checkbox' class='checkCompleted' ${task.state === 'Yes' ? 'checked' : ''} />
              <div class='taskTopInfo'>
                <h3>${task.title}</h3>
                <p>${task.dueDate}</p>
              </div>
              <button class='editBtn'>Edit</button>
              <button class='deleteBtn'>Delete</button>
            </div>
            <div class='taskContent'>
              <div class='descriptionContainer'>
                <p>${task.description}</p>
              </div>
              <div class='taskProp'>
                <p><span class='priorityDot ${task.priority}'></span>Priority: ${task.priority}</p>
                <p>Notes: ${task.notes}</p>
                <p>Completed: ${task.state}</p>
              </div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
  `;
  setTimeout(() => taskCreator(logic, project), 0);
  setTimeout(() => taskCompleted(logic, project), 0);
  setTimeout(() => taskDeletor(logic, project), 0);
  setTimeout(() => taskEditor(logic, project), 0);
};

const renderDescriptionMain = (logic, project) => {
  if (project.description === undefined) {
    setTimeout(() => descriptionCreator(logic, project), 0);
    return `
      <div class='inputDescription'>
        <form>
          <input type="text" id='inputProjectDescription' placeholder="Write a short description" />
          <input type="submit" id="submitDescription" />
        </form>
      </div>
    `;
  }
  return `<p>${project.description}</p>`;
};

const descriptionCreator = (logic, project) => {
  document.getElementById('submitDescription').addEventListener('click', (e) => {
    e.preventDefault();
    const projectDescription = document
      .getElementById('inputProjectDescription')
      .value.trim();
    if (!projectDescription) return;
    project.description = projectDescription;
    logic.saveData();
    renderSideBar(logic);
    renderMain(logic, project);
  });
};

// ─── Tasks ───────────────────────────────────────────────────────────────────

const taskCreator = (logic, project) => {
  document.getElementById('submitTask').addEventListener('click', (e) => {
    e.preventDefault();
    const taskTitle = document.getElementById('titleInput').value.trim();
    const taskDescription = document.getElementById('descriptionInput').value.trim();
    const taskNote = document.getElementById('noteInput').value.trim();
    const taskDueDate = document.getElementById('dateInput').value.trim();
    const taskPriority = document.getElementById('priorityInput').value.trim();
    const taskState = 'No';

    if (!taskTitle || !taskDescription || !taskNote || !taskDueDate || !taskPriority)
      return;

    logic.createTask(project, taskTitle, taskDescription, taskDueDate, taskPriority, taskNote, taskState);
    renderMain(logic, project);
  });
};

const taskDeletor = (logic, project) => {
  document.getElementById('tasksList').addEventListener('click', (e) => {
    if (!e.target.matches('.deleteBtn')) return;
    const taskDiv = e.target.closest('.task');
    const i = taskDiv.dataset.index;
    logic.deleteTask(project, i);
    renderMain(logic, project);
  });
};

const taskEditor = (logic, project) => {
  document.getElementById('tasksList').addEventListener('click', (e) => {
    if (!e.target.matches('.editBtn')) return;
    const taskDiv = e.target.closest('.task');
    const i = taskDiv.dataset.index;
    const task = project.tasks[i];
    taskDiv.querySelector('.taskContent').innerHTML = `
      <form class='editForm'>
        <input type='text' class='editTitle' value='${task.title}' />
        <input type='text' class='editDescription' value='${task.description}' />
        <input type='text' class='editNote' value='${task.notes}' />
        <input type='date' class='editDate' value='${task.dueDate}' />
        <select class='editPriority'>
          <option value='low' ${task.priority === 'low' ? 'selected' : ''}>Low</option>
          <option value='medium' ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
          <option value='high' ${task.priority === 'high' ? 'selected' : ''}>High</option>
        </select>
        <input type='submit' value='Save' />
      </form>
    `;
    taskDiv.querySelector('.editForm').addEventListener('submit', (e) => {
      e.preventDefault();
      task.title = taskDiv.querySelector('.editTitle').value.trim();
      task.description = taskDiv.querySelector('.editDescription').value.trim();
      task.notes = taskDiv.querySelector('.editNote').value.trim();
      task.dueDate = taskDiv.querySelector('.editDate').value;
      task.priority = taskDiv.querySelector('.editPriority').value;
      logic.saveData();
      renderMain(logic, project);
    });
  });
};

const taskCompleted = (logic, project) => {
  document.getElementById('tasksList').addEventListener('change', (e) => {
    if (!e.target.matches('input[type="checkbox"]')) return;
    const taskDiv = e.target.closest('.task');
    const i = taskDiv.dataset.index;
    project.tasks[i].state = e.target.checked ? 'Yes' : 'No';
    logic.saveData();
    renderMain(logic, project);
  });
};

// ─── Navigation ──────────────────────────────────────────────────────────────

const getProject = (logic) => {
  document.getElementById('sideProjects').addEventListener('click', (e) => {
    if (e.target.matches('#binBtn')) return;
    const projectDiv = e.target.closest('.project');
    if (!projectDiv) return;
    renderMain(logic, logic.projects[projectDiv.dataset.index]);
  });
  document.getElementById('mainDiv').addEventListener('click', (e) => {
    const projectDiv = e.target.closest('.project');
    if (!projectDiv) return;
    renderMain(logic, logic.projects[projectDiv.dataset.index]);
  });
};

const projectDeletor = (logic) => {
  document.getElementById('sideProjects').addEventListener('click', (e) => {
    if (!e.target.matches('#binBtn')) return;
    e.stopPropagation();
    const projectDiv = e.target.closest('.project');
    const i = projectDiv.dataset.index;
    logic.deleteProject(i);
    renderSideBar(logic);
    renderMain(logic);
  });
};
