import Vector from '../modules/Vector'
import Chunk from './Chunk'

export default class Tetrominoe {
  constructor(sets, position, activeSetInd, color) {
    this._sets = sets
    this._position = position
    this._activeSetInd = activeSetInd
    this._color = color
  }

  static create({ sets, x, y }, color = 'black') { // TODO set initInd
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
      .filter(elem => elem)
  }

  rotateLeft() {
    this._activeSetInd = (this._activeSetInd - 1) % this._sets.length
  }

  rotateRight() {
    this._activeSetInd = (this._activeSetInd + 1) % this._sets.length
  }

  goLeft() {
    this._position = new Vector(this._position.x - 1, this._position.y)
  }

  goRight() {
    this._position = new Vector(this._position.x + 1, this._position.y)
  }

  goDown() {
    this._position = new Vector(this._position.x, this._position.y + 1)
  }

  get color() {
    return this._color
  }

  get position() {
    return this._position
  }

  get currentSet() {
    return this._sets[this._activeSetInd]
  }
}
