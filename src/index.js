import { toDo } from './projects.js';
import { display } from './display.js';
import './styles.css';

const logic = toDo();

console.log(logic.projects[0].projectTitle);
display(logic);
