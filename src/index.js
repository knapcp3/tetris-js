import '@babel/polyfill';
import DOMDisplay from './Display/DOMDisplay';
import { runGame } from './modules/run';
import './styles.css';
import config from './config';

runGame(DOMDisplay, config);
