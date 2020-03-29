import Vector from './Vector'

export const createElem = (elementName, attributesOb, ...children) => {
  const elem = document.createElement(elementName)
  Object.entries(attributesOb).forEach(([key, val]) => elem.setAttribute(key, val))
  children.forEach(ch => elem.appendChild(ch))
  return elem
}

export const createChunkNode = (x, y, scale, color) => {
  const chunk = createElem('div', { class: 'chunk' })
  chunk.style.width = `${scale - 2}px`
  chunk.style.height = `${scale - 2}px`
  chunk.style.left = `${x * scale + 1}px`
  chunk.style.top = `${y * scale + 1}px`
  chunk.style.backgroundColor = color
  return chunk
}

export function makeVectors(coords) {
  return coords.map(([x, y]) => new Vector(x, y))
}

export function randomIndex(size) {
  return Math.floor(Math.random() * size)
}

export function randomValue(array) {
  return array[randomIndex(array.length)]
}

export function randomObVal(obj) {
  return obj[randomValue(Object.keys(obj))]
}

export function listenForKeys(...keys) {
  const result = {}

  const monitor = e => {
    if (keys.includes(e.key)) {
      result[e.key] = e.type === 'keydown'
      e.preventDefault()
    }
  }

  document.addEventListener('keyup', monitor)
  document.addEventListener('keydown', monitor)

  result.removeListeners = () => {
    window.removeEventListener('keydown', monitor)
    window.removeEventListener('keyup', monitor)
  }

  return result
}

export function cycle(value, from, to) {
  if (value < from) return to
  if (value > to) return from
  return value
}
