import { createElem, createChunkNode } from '../modules/utils'
import config from '../config'

export default class DOMDisplay {
  constructor(parent, boardRows) {
    // TODO: get field with game board
    const game = DOMDisplay.drawGame(boardRows)
    this._dom = game.game
    this._gameBoard = game.gameBoard
    this._tetrosLayer = null
    parent.appendChild(this._dom)
  }

  static drawGame(boardRows) {
    const { scale, infoWidth } = config

    const infoContent = createElem(
      'div',
      { class: 'game-info-content' },
      createElem(
        'div',
        { class: 'score' },
        document.createTextNode('Score: '),
        createElem(
          'span',
          { class: 'score-value' },
          document.createTextNode('0'),
        ),
      ),
      createElem(
        'div',
        { class: 'level-nr' },
        document.createTextNode('Level: '),
        createElem('span', { class: 'level-nr' }, document.createTextNode('1')),
      ),
    )
    const gameInfo = createElem('div', { class: 'game-info' }, infoContent)

    gameInfo.style.width = `${infoWidth * scale}px`

    const gameBoard = createElem(
      'div',
      { class: 'game-board' },
      DOMDisplay.drawGrid(boardRows),
    )

    const game = createElem('div', { class: 'game' }, gameInfo, gameBoard)
    return {
      game,
      gameBoard,
    }
  }

  static drawGrid(boardRows) {
    const { scale } = config

    const result = createElem(
      'div',
      { class: 'game-grid' },
      ...boardRows.map(row =>
        createElem(
          'div',
          { class: 'row' },
          ...row.map(() =>
            createElem('div', {
              class: 'sky',
              style: `background-clip: content-box; width: ${scale}px; height: ${scale}px; padding: 1px`,
            }),
          ),
        ),
      ),
    )

    return result
  }

  static drawTetros(inactiveChunks, activeTetro) {
    const { scale } = config
    const { currentSet, position } = activeTetro
    const { x, y } = position

    const chunkNodes = []

    inactiveChunks.forEach(chunk => chunkNodes.push(createChunkNode(chunk.vec.x, chunk.vec.y, scale)))

    currentSet.forEach((row, rInd) => {
      row.forEach((cell, cInd) => {
        if (cell) {
          const chunkXPos = x + cInd
          const chunkYPos = y + rInd
          chunkNodes.push(createChunkNode(chunkXPos, chunkYPos, scale))
          // console.log('cInd: ' + cInd)
          // console.log('L: ' + chunk.style.left)
          // console.log('T: ' + chunk.style.top)
          // console.log('W: ' + chunk.style.width)
        }
      })
    })
    // console.log(chunkNodes)
    const result = createElem('div', {}, ...chunkNodes) // error

    return result
  }

  syncWithState(state) {
    const { inactiveChunks, activeTetro } = state

    if (this._tetrosLayer) this._tetrosLayer.remove()

    this._tetrosLayer = DOMDisplay.drawTetros(inactiveChunks, activeTetro)

    this._gameBoard.appendChild(this._tetrosLayer)
  }

  clear() {
    this._dom.remove()
  }
}
