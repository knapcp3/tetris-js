import { tetrominoes } from '../modules/tetrominoes'
import Tetrominoe from '../Actors/Tetrominoe'

export default class State {
  constructor(
    level,
    width,
    height,
    status,
    activeTetro,
    inactiveChunks,
    rows,
    score,
  ) {
    this._level = level
    this._width = width
    this._height = height
    this._status = status
    this._activeTetro = activeTetro
    this._inactiveChunks = inactiveChunks
    this._rows = rows
    this._score = score
  }

  static create(config) {
    const { width, height } = config
    const rows = Array.from({ length: height }).map(() =>
      Array.from({ length: width }).map(() => 'sky'),
    )
    return new State(1, width, height, 'playing', null, [], rows, 0)
  }

  isOutside(tetro) {
    return tetro.chunks.some(
      ({ vec: { x, y } }) =>
        x < 0 || y < 0 || x >= this._width || y >= this._height,
    )
  }

  update() {
    let nextTetro
    // const inactiveChunks = this._inactiveChunks
    // TODO: update inactive
    // console.log(this._inactiveChunks)
    if (!this._activeTetro) {
      nextTetro = Tetrominoe.create(tetrominoes.L)
    } else {
      nextTetro = this._activeTetro.update()
    }
    // console.log(nextTetro)
    let activeTetro
    let inactiveChunks
    if (this.isOutside(nextTetro)) {
      inactiveChunks = this._inactiveChunks.concat(this._activeTetro.chunks)
      activeTetro = Tetrominoe.create(tetrominoes.L)
    } else {
      inactiveChunks = this._inactiveChunks
      activeTetro = nextTetro
    }
    // console.log(activeTetro)

    const newState = new State(
      this._level,
      this._width,
      this._height,
      this._status,
      activeTetro,
      inactiveChunks,
      this._rows,
      this._score,
    )

    return newState
  }

  get timeSpeed() {
    return this._level * 0.2 + 1
  }

  get height() {
    return this._height
  }

  get width() {
    return this._width
  }

  get rows() {
    return this._rows
  }

  get status() {
    return this._status
  }

  get level() {
    return this._level
  }

  get activeTetro() {
    return this._activeTetro
  }

  get inactiveChunks() {
    return this._inactiveChunks
  }
}
