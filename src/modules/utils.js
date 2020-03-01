import Vector from './Vector' 

export const createElem = (elementName, attributesOb, ...children) => {
  const elem = document.createElement(elementName) 
  Object.entries(attributesOb).forEach(([key, val]) => elem.setAttribute(key, val)) 
  children.forEach((ch) => elem.appendChild(ch)) 
  return elem 
}

export const createChunkNode = (x, y, scale) => {
  const chunk = createElem('div', { class: 'chunk' })
  chunk.style.width = `${scale - 2}px`
  chunk.style.height = `${scale - 2}px`
  chunk.style.left = `${(x) * scale + 1}px`
  chunk.style.top = `${(y) * scale + 1}px`
  return chunk
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
