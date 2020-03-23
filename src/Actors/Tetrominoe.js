import Vector from '../modules/Vector'
import Chunk from './Chunk'
import { cycle } from '../modules/utils'

export default class Tetrominoe {
  constructor(sets, position, activeSetInd, color) {
    this._sets = sets
    this._position = position
    this._activeSetInd = activeSetInd
    this._color = color
  }

  static create({ sets, x, y }, color = 'black') {
    // TODO set initInd
    const initInd = 0
    return new Tetrominoe(sets, new Vector(x, y), initInd, color)
  }

  updateAfterInterval() {
    return new Tetrominoe(
      this._sets,
      this._position.plus(new Vector(0, 1)),
      this._activeSetInd,
      this._color,
    )
  }

  get chunks() {
    const { x, y } = this._position
    return this._sets[this._activeSetInd]
      .map((row, rowInd) =>
        row.map((elem, elemInd) => {
          return elem ? new Chunk(new Vector(elemInd + x, rowInd + y)) : null
        }),
      )
      .reduce((acc, currentRow) => acc.concat(currentRow), [])
      .filter(elem => !!elem)
  }

  rotateLeft() {
    const activeSetInd = cycle(this._activeSetInd - 1, 0, this._sets.length - 1)
    return new Tetrominoe(this._sets, this._position, activeSetInd, this._color)
  }

  rotateRight() {
    const activeSetInd = (this._activeSetInd + 1) % this._sets.length
    return new Tetrominoe(this._sets, this._position, activeSetInd, this._color)
  }

  goLeft() {
    const position = new Vector(this._position.x - 1, this._position.y)
    return new Tetrominoe(this._sets, position, this._activeSetInd, this._color)
  }

  goRight() {
    const position = new Vector(this._position.x + 1, this._position.y)
    return new Tetrominoe(this._sets, position, this._activeSetInd, this._color)
  }

  goDown() {
    const position = new Vector(this._position.x, this._position.y + 1)
    return new Tetrominoe(this._sets, position, this._activeSetInd, this._color)
  }

  get color() {
    return this._color
  }

  get position() {
    return this._position
  }

  get sets() {
    return [...this._sets]
  }

  get activeSetInd() {
    return this._activeSetInd
  }

  get currentSet() {
    return [...this._sets[this._activeSetInd]]
  }
}
