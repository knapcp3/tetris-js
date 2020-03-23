import { tetrominoes } from '../modules/tetrominoes'
import Tetrominoe from '../Actors/Tetrominoe'
import GAME_STATUSES from '../modules/game-statuses'
import ControlsTracker from '../ControlsTracker/ControlsTracker'
import { ACTIONS } from '../modules/consts'

export default class State {
  constructor(level, width, height, status, activeTetro, inactiveChunks, rows, score) {
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
    const rows = Array.from({ length: height }).map(() => Array.from({ length: width }).map(() => 'sky'))
    return new State(1, width, height, GAME_STATUSES.PLAYING, null, [], rows, 0)
  }

  static isOutsideBottom(tetro, height) {
    return tetro && tetro.chunks.some(({ vec: { y } }) => y >= height)
  }

  static isOutsideHorizontally(tetro, width) {
    return tetro && tetro.chunks.some(({ vec: { x } }) => x < 0 || x >= width)
  }

  static isOutsideTop(tetro) {
    return tetro && tetro.chunks.some(({ vec: { y } }) => y < 0)
  }

  static isOutside(tetro, width, height) {
    return tetro && tetro.chunks.some(({ vec: { x, y } }) => x < 0 || y < 0 || x >= width || y >= height)
  }

  static isOverlapping(tetro, inactiveChunks) {
    return tetro && tetro.chunks.some(chunk => inactiveChunks.find(inactiveChunk => inactiveChunk.equals(chunk)))
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

  deactivateActiveTetroAndCreateNew() {
    const inactiveChunks = this._inactiveChunks.concat(this._activeTetro ? this._activeTetro.chunks : [])
    const nextTetro = Tetrominoe.create(tetrominoes.L)

    if (State.isOverlapping(nextTetro, inactiveChunks)) {
      return State.overrideState(this, {
        _status: GAME_STATUSES.GAME_OVER,
      })
    }

    return State.overrideState(this, {
      _activeTetro: nextTetro,
      _inactiveChunks: inactiveChunks,
    })
  }

  static update(state, hasIntervalPassed, controlsTracker) {
    if (hasIntervalPassed) {
      const stateAfterInterval = state.updateAfterInterval()
      return stateAfterInterval.updateAfterEvents(controlsTracker)
    }
    return state.updateAfterEvents(controlsTracker)
  }

  updateAfterInterval() {
    let nextTetro
    if (!this._activeTetro) {
      nextTetro = Tetrominoe.create(tetrominoes.L)
    } else {
      nextTetro = this._activeTetro.updateAfterInterval()
    }

    const isNextTetroOutsideBottom = State.isOutsideBottom(nextTetro, this._height)
    const isNextTetroOverlappingOtherChunks = State.isOverlapping(nextTetro, this._inactiveChunks)

    if (isNextTetroOutsideBottom || isNextTetroOverlappingOtherChunks) {
      return this.deactivateActiveTetroAndCreateNew()
    }

    return State.overrideState(this, {
      _activeTetro: nextTetro,
    })
  }

  updateAfterEvents(controlsTracker) {
    let nextTetro = this._activeTetro

    if (controlsTracker.controlsTrackingMap[ACTIONS.MOVE_LEFT]) {
      const tetroAfterMovingLeft = this.activeTetro.goLeft()
      nextTetro = State.isOutsideHorizontally(tetroAfterMovingLeft, this._width) ? nextTetro : tetroAfterMovingLeft
    }

    if (controlsTracker.controlsTrackingMap[ACTIONS.MOVE_RIGHT]) {
      const tetroAfterMovingRight = this._activeTetro.goRight()
      nextTetro = State.isOutsideHorizontally(tetroAfterMovingRight, this._width) ? nextTetro : tetroAfterMovingRight
    }

    if (controlsTracker.controlsTrackingMap[ACTIONS.MOVE_DOWN]) nextTetro = this._activeTetro.goDown()

    if (controlsTracker.controlsTrackingMap[ACTIONS.ROTATE_RIGHT]) {
      const tetroAfterRotateRight = this._activeTetro.rotateRight()
      nextTetro = State.isOutside(tetroAfterRotateRight, this._width) ? nextTetro : tetroAfterRotateRight
    }

    if (controlsTracker.controlsTrackingMap[ACTIONS.ROTATE_LEFT]) {
      const tetroAfterRotateLeft = this._activeTetro.rotateLeft()
      nextTetro = State.isOutside(tetroAfterRotateLeft, this._width) ? nextTetro : tetroAfterRotateLeft
    }

    controlsTracker.resetControlsTrackingMap()

    const isNextTetroOutsideBottom = State.isOutsideBottom(nextTetro, this._height)
    const isNextTetroOverlappingOtherChunks = State.isOverlapping(nextTetro, this._inactiveChunks)

    if (isNextTetroOutsideBottom || isNextTetroOverlappingOtherChunks) {
      return this.deactivateActiveTetroAndCreateNew()
    }

    return State.overrideState(this, {
      _activeTetro: nextTetro,
    })
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
    const { sets, position, activeSetInd, color } = this._activeTetro
    return this._activeTetro ? new Tetrominoe(sets, position, activeSetInd, color) : null
  }

  get inactiveChunks() {
    return [...this._inactiveChunks]
  }
}
