import Vector from './Vector' 

export const createElem = (elementName, attributesOb, ...children) => {
  const elem = document.createElement(elementName) 
  Object.entries(attributesOb).forEach(([key, val]) => elem.setAttribute(key, val)) 
  children.forEach((ch) => elem.appendChild(ch)) 
  return elem 
}

export function makeVectors(coords) {
  return coords.map(([x, y]) => new Vector(x, y))
}

export function randomIndex(size) {
  return Math.floor(Math.random() * size) 
}

export function randomVal(obj) {
  return obj[randomIndex(Object.keys(obj).length)] 
}
