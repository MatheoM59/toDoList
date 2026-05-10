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
          <h3>${project.projectTitle}</h3>
          <p>${renderDescription(project)}</p>
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
          <input type="text" id="projectName" placeholder="Name">
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
        <h2>Select a project</h2>
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
            <input type='text' id='title' placeholder='Task title'/>
            <input type="date" id='date'/> 
            <select id="priority">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <input type='submit' id='submitTask'
        </form>
      </div>
      <div='taskList'>
        <p>${project.tasks[0].title}
      </div>


    </div>
  `;
};

const renderDescriptionMain = (logic, project) => {
  if (project.description === undefined) {
    setTimeout(() => descriptionCreator(logic, project), 0);
    return `
      <div class='inputDescription'>
        <form>
          <input type="text" id='inputProjectDescription' placeholder="Write a short description"/>
          <input type="submit" id="submitDescription" />
        </form>
      </div>
    `;
  }
  return `<p>${project.description}</p>`;
};

const descriptionCreator = (logic, project) => {
  document
    .getElementById('submitDescription')
    .addEventListener('click', (e) => {
      e.preventDefault();
      const projectDescription = document
        .getElementById('inputProjectDescription')
        .value.trim();
      if (!projectDescription) return;
      project.description = projectDescription;
      renderSideBar(logic);
      renderMain(logic, project);
    });
};

// ─── Navigation ──────────────────────────────────────────────────────────────

const getProject = (logic) => {
  document.getElementById('sideProjects').addEventListener('click', (e) => {
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
