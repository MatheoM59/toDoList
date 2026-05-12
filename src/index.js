import { toDo } from './projects.js';
import { display } from './display.js';
import './styles.css';

const logic = toDo();
display(logic);

window.logic = logic;
