import '@babel/polyfill';
import DOMDisplay from './Display/DOMDisplay';
import { runGame } from './modules/run';
import './styles.css';
import config from './config';

// import Level from "./Level/Level"

// const level = new Level(1, 10, 20)

runGame(DOMDisplay, config);

// console.log('xd')

// const dd = new DOMDisplay()
