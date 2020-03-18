import { tetrominoes } from '../modules/tetrominoes'
import Tetrominoe from '../Actors/Tetrominoe'
import GAME_STATUSES from '../modules/game-statuses'

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
    return new State(1, width, height, GAME_STATUSES.PLAYING, null, [], rows, 0)
  }

  static isOutsideBesidesTop(tetro, width, height) {
    return (
      tetro &&
      tetro.chunks.some(
        ({ vec: { x, y } }) => x < 0 || x >= width || y >= height,
      )
    )
  }

  static isOutsideTop(tetro) {
    return tetro && tetro.chunks.some(({ vec: { y } }) => y < 0)
  }

  static isOutside(tetro, width, height) {
    return (
      tetro &&
      tetro.chunks.some(
        ({ vec: { x, y } }) => x < 0 || y < 0 || x >= width || y >= height,
      )
    )
  }

  static isOverlapping(tetro, inactiveChunks) {
    return (
      tetro &&
      tetro.chunks.some(chunk =>
        inactiveChunks.find(inactiveChunk => inactiveChunk.equals(chunk)),
      )
    )
  }

  deactivateActiveTetroAndCreateNew() {
    const inactiveChunks = this._inactiveChunks.concat(
      this._activeTetro ? this._activeTetro.chunks : [],
    )
    const nextTetro = Tetrominoe.create(tetrominoes.L)

    if (State.isOverlapping(nextTetro, inactiveChunks)) {
      console.log(1)
      return State.overrideState(this, {
        _status: GAME_STATUSES.GAME_OVER,
      })
    }

    return State.overrideState(this, {
      _activeTetro: nextTetro,
      _inactiveChunks: inactiveChunks,
    })
  }

  static update(state, hasIntervalPassed) {
    if (hasIntervalPassed) {
      // eslint-disable-next-line no-param-reassign
      state = state.updateAfterInterval()
    }
    // eslint-disable-next-line no-param-reassign
    return state.updateAfterEvents()
  }

  updateAfterInterval() {
    let nextTetro
    if (!this._activeTetro) {
      nextTetro = Tetrominoe.create(tetrominoes.L)
    } else {
      nextTetro = this._activeTetro.updateAfterInterval()
    }

    if (
      State.isOutsideTop(this._activeTetro) &&
      State.isOverlapping(nextTetro, this._inactiveChunks)
    ) {
      console.log(2)
      return State.overrideState(this, {
        _status: GAME_STATUSES.GAME_OVER,
      })
    }

    if (State.isOutsideBesidesTop(nextTetro, this._width, this._height)) {
      return this.deactivateActiveTetroAndCreateNew()
    }

    if (State.isOverlapping(nextTetro, this._inactiveChunks)) {
      return this.deactivateActiveTetroAndCreateNew()
    }

    return State.overrideState(this, {
      _activeTetro: nextTetro,
    })
  }

  static overrideState(state, overrideObject) {
    return Object.assign(
      new State(
        state._level,
        state._width,
        state._height,
        state._status,
        state._activeTetro,
        state._inactiveChunks,
        state._rows,
        state._score,
      ),
      overrideObject,
    )
  }

  updateAfterEvents() {
    return new State(
      this._level,
      this._width,
      this._height,
      this._status,
      this._activeTetro,
      this._inactiveChunks,
      this._rows,
      this._score,
    )
  }

  get interval() {
    return (this._level * 0.2 + 1) * 1000
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
