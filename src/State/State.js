import { tetrominoes } from '../modules/tetrominoes'
import Tetrominoe from '../Actors/Tetrominoe'
import GAME_STATUSES from '../modules/game-statuses'
import { ACTIONS } from '../modules/consts'
import { randomObVal } from '../modules/utils'
import Chunk from '../Actors/Chunk'
import Vector from '../modules/Vector'

export default class State {
  static lastLevelScoreLimit = 0

  static levelScoreTreshold = 100

  constructor(level, width, height, status, activeTetro, inactiveChunks, score, levelInterval) {
    this._level = level
    this._width = width
    this._height = height
    this._status = status
    this._activeTetro = activeTetro
    this._inactiveChunks = inactiveChunks
    this._score = score
    this._levelInterval = levelInterval
  }

  static create(config) {
    const { width, height, levelInterval } = config
    return new State(1, width, height, GAME_STATUSES.PLAYING, null, {}, 0, levelInterval)
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
        state._score,
        state._levelInterval,
      ),
      overrideObject,
    )
  }

  removeChunksFromFullRows(inactiveChunksObject) {
    const newChunksObject = { ...inactiveChunksObject }
    const isRowFull = row => row.length === this._width
    let newScore = this._score

    for (let row1 = 0; row1 < this._height; row1 += 1) {
      const row1ChunksArr = inactiveChunksObject[row1] || []
      // TODO: change to mapping through inactiveCHunks array and filtering chunks abouve full
      if (isRowFull(row1ChunksArr)) {
        newScore += this.width
        for (let row2 = row1; row2 > 0; row2 -= 1) {
          newChunksObject[row2] = (newChunksObject[row2 - 1] || []).map(
            ({ vec: { x, y }, color }) => new Chunk(new Vector(x, y + 1), color),
          )
        }
      } else {
        newChunksObject[row1] = row1ChunksArr
      }
    }

    return { chunks: newChunksObject, score: newScore }
  }

  // TODO: change chunks ob to array and make object before isrowfull()

  static addChunksToRowGroupedObject(chunksArray, chunksObject) {
    const newChunksObject = { ...chunksObject }
    chunksArray.forEach(chunk => {
      const chunkRow = chunk.vec.y
      if (newChunksObject[chunkRow]) newChunksObject[chunkRow].push(chunk)
      else newChunksObject[chunkRow] = [chunk]
    })
    return newChunksObject
  }

  static transformChunksObjectToArray(chunksObject) {
    return Object.entries(chunksObject).reduce((acc, [_, chunks]) => [...acc, ...chunks], [])
  }

  deactivateActiveTetroAndCreateNew() {
    const inactiveChunks = State.addChunksToRowGroupedObject(
      this._activeTetro ? this._activeTetro.chunks : [],
      this._inactiveChunks,
    )

    const nextTetro = Tetrominoe.create(randomObVal(tetrominoes))

    if (State.isOverlapping(nextTetro, State.transformChunksObjectToArray(inactiveChunks))) {
      State.lastLevelScoreLimit = 0
      return State.overrideState(this, {
        _status: GAME_STATUSES.GAME_OVER,
      })
    }

    // TODO: fix bug with removing only one row
    const { chunks: inactiveChunksAfterLock, score: newScore } = this.removeChunksFromFullRows(inactiveChunks)

    if (this._level < this.maxLevel && newScore > State.lastLevelScoreLimit + State.levelScoreTreshold) {
      State.lastLevelScoreLimit += State.levelScoreTreshold

      return State.overrideState(this, {
        _activeTetro: nextTetro,
        _inactiveChunks: inactiveChunksAfterLock,
        _score: newScore,
        _level: this._level + 1,
        _status: GAME_STATUSES.LEVEL_CHANGE,
      })
    }

    return State.overrideState(this, {
      _activeTetro: nextTetro,
      _inactiveChunks: inactiveChunksAfterLock,
      _score: newScore,
    })
  }

  update(hasIntervalPassed, controlsTracker) {
    let nextTetro = this._activeTetro

    if (!nextTetro) {
      return State.overrideState(this, {
        _activeTetro: Tetrominoe.create(randomObVal(tetrominoes)),
      })
    }

    if (hasIntervalPassed) {
      nextTetro = this._activeTetro.goDown()
    }

    if (controlsTracker.controlsTrackingMap[ACTIONS.MOVE_LEFT]) {
      const tetroAfterMovingLeft = this.activeTetro.goLeft()
      nextTetro = State.getIfShouldTetroStayInPlace(tetroAfterMovingLeft, this.inactiveChunks)
        ? nextTetro
        : tetroAfterMovingLeft
    }

    if (controlsTracker.controlsTrackingMap[ACTIONS.MOVE_RIGHT]) {
      const tetroAfterMovingRight = this._activeTetro.goRight()
      nextTetro = State.getIfShouldTetroStayInPlace(tetroAfterMovingRight, this.inactiveChunks, this._width)
        ? nextTetro
        : tetroAfterMovingRight
    }

    if (controlsTracker.controlsTrackingMap[ACTIONS.MOVE_DOWN]) nextTetro = this._activeTetro.goDown()

    if (controlsTracker.controlsTrackingMap[ACTIONS.ROTATE_RIGHT]) {
      const tetroAfterRotateRight = this._activeTetro.rotateRight()
      nextTetro = State.isOutside(tetroAfterRotateRight) ? nextTetro : tetroAfterRotateRight
    }

    if (controlsTracker.controlsTrackingMap[ACTIONS.ROTATE_LEFT]) {
      const tetroAfterRotateLeft = this._activeTetro.rotateLeft()
      nextTetro = State.isOutside(tetroAfterRotateLeft) ? nextTetro : tetroAfterRotateLeft
    }

    controlsTracker.resetControlsTrackingMap() // TODO: move to run?

    const isNextTetroOutsideBottom = State.isOutsideBottom(nextTetro, this._height)
    const isNextTetroOverlappingOtherChunks = State.isOverlapping(nextTetro, this.inactiveChunks)

    if (isNextTetroOutsideBottom || isNextTetroOverlappingOtherChunks) {
      return this.deactivateActiveTetroAndCreateNew()
    }

    return State.overrideState(this, {
      _activeTetro: nextTetro,
    })
  }

  static getIfShouldTetroStayInPlace(tetro, inactiveChunks, width) {
    return State.isOutsideHorizontally(tetro, width) || State.isOverlapping(tetro, inactiveChunks)
  }

  get interval() {
    return this._levelInterval[this.level]
  }

  get height() {
    return this._height
  }

  get width() {
    return this._width
  }

  get status() {
    return this._status
  }

  get level() {
    return this._level
  }

  get score() {
    return this._score
  }

  get maxLevel() {
    return Object.keys(this._levelInterval).length
  }

  get activeTetro() {
    const { sets, position, activeSetInd, color } = this._activeTetro
    return this._activeTetro ? new Tetrominoe(sets, position, activeSetInd, color) : null
  }

  get inactiveChunks() {
    return State.transformChunksObjectToArray(this._inactiveChunks)
  }
}
