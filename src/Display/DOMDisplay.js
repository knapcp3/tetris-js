import { createElem, createChunkNode } from '../modules/utils'
import config from '../config'

export default class DOMDisplay {
  constructor(rootNode, boardRows) {
    this._rootNode = rootNode
    const game = DOMDisplay.drawGame(boardRows)
    this._gameDOM = game.game
    this._gameBoard = game.gameBoard
    this._tetrosLayer = null
    this._rootNode.appendChild(this._gameDOM)
    // this.showStartScreen()
  }

  // startGame() {

  // }

  static drawGame(boardRows) {
    const { scale, infoWidth } = config

    const infoContent = createElem(
      'div',
      { class: 'game-info-content' },
      createElem(
        'div',
        { class: 'score' },
        document.createTextNode('Score: '),
        createElem('span', { class: 'score-value' }, document.createTextNode('0')),
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

    const gameBoard = createElem('div', { class: 'game-board' }, DOMDisplay.drawGrid(boardRows))

    const game = createElem('div', { class: 'game' }, gameInfo, gameBoard)

    return {
      game,
      gameBoard,
      gameInfo,
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
        }
      })
    })
    const result = createElem('div', {}, ...chunkNodes)

    return result
  }

  showMenuScreen(buttons) {
    const menuScreenDOM = createElem('div', {
      class: 'menu-screen',
    })

    const menuScreenMenuDOM = createElem('div', {
      class: 'menu',
    })

    buttons.forEach(button => {
      menuScreenMenuDOM.appendChild(button)
    })

    menuScreenDOM.appendChild(menuScreenMenuDOM)
    this._gameDOM.appendChild(menuScreenDOM)

    DOMDisplay.prototype.removePauseScreen = () => {
      menuScreenDOM.remove()
    }
  }

  showPauseScreen() {
    const resumeButton = createElem('button', { class: 'menu-button' }, document.createTextNode('Resume'))
    const restartButton = createElem('button', { class: 'menu-button' }, document.createTextNode('Restart'))

    const buttons = [resumeButton, restartButton]

    this.showMenuScreen(buttons)
  }

  showStartScreen() {
    const startButton = createElem('button', { class: 'menu-button' }, document.createTextNode('Start'))

    const buttons = [startButton]

    this.showMenuScreen(buttons)
  }

  syncWithState(state) {
    const { inactiveChunks, activeTetro } = state

    if (this._tetrosLayer) this._tetrosLayer.remove()

    this._tetrosLayer = DOMDisplay.drawTetros(inactiveChunks, activeTetro)

    this._gameBoard.appendChild(this._tetrosLayer)
  }

  clear() {
    this._gameDOM.remove()
  }
}
