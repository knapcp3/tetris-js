import { createElem, createChunkNode } from '../modules/utils'
import { EVENTS } from '../modules/consts'
import config from '../config'

class DOMDisplay {
  constructor(gameDOM, gameBoardDOM, gameInfoDOM, tetrosLayer) {
    this._gameDOM = gameDOM
    this._gameBoardDOM = gameBoardDOM
    this._gameInfoDOM = gameInfoDOM
    this._tetrosLayer = tetrosLayer
  }

  static create(rootNode, width, height) {
    const boardRows = Array.from({ length: height }).map(() => Array.from({ length: width }).map(() => 'sky'))
    const { gameDOM, gameBoardDOM, gameInfoDOM } = DOMDisplay.drawGame(boardRows)
    rootNode.appendChild(gameDOM)
    return new DOMDisplay(gameDOM, gameBoardDOM, gameInfoDOM, null)
  }

  static drawGame(boardRows) {
    const { scale, infoWidth } = config

    const infoContent = createElem(
      'div',
      { class: 'game-info-content' },
      createElem(
        'div',
        { class: 'score-container' },
        document.createTextNode('Score: '),
        createElem('span', { class: 'score-number' }, document.createTextNode('0')),
      ),
      createElem(
        'div',
        { class: 'level-container' },
        document.createTextNode('Level: '),
        createElem('span', { class: 'level-number' }, document.createTextNode('1')),
      ),
    )
    const gameInfoDOM = createElem('div', { class: 'game-info' }, infoContent)

    gameInfoDOM.style.width = `${infoWidth * scale}px`

    const gameBoardDOM = createElem('div', { class: 'game-board' }, DOMDisplay.drawGrid(boardRows))

    const gameDOM = createElem('div', { class: 'game' }, gameInfoDOM, gameBoardDOM)

    return {
      gameDOM,
      gameBoardDOM,
      gameInfoDOM,
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
    const { currentSet, position, color: activeTetrColor } = activeTetro
    const { x, y } = position

    const chunkNodes = []

    inactiveChunks.forEach(chunk => chunkNodes.push(createChunkNode(chunk.vec.x, chunk.vec.y, scale, chunk.color)))

    currentSet.forEach((row, rInd) => {
      row.forEach((cell, cInd) => {
        if (cell) {
          const chunkXPos = x + cInd
          const chunkYPos = y + rInd
          chunkNodes.push(createChunkNode(chunkXPos, chunkYPos, scale, activeTetrColor))
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

    DOMDisplay.prototype.removeMenuScreen = () => {
      if (menuScreenDOM) menuScreenDOM.remove()
    }
  }

  showStartScreen() {
    return new Promise((resolve, _) => {
      const startButton = createElem('button', { class: 'menu-button' }, document.createTextNode('Start'))

      startButton.addEventListener(EVENTS.CLICK, () => {
        this.removeMenuScreen()
        resolve()
      })

      const buttons = [startButton]

      this.showMenuScreen(buttons)
    })
  }

  syncWithState(state) {
    const { inactiveChunks, activeTetro } = state

    if (this._tetrosLayer) this._tetrosLayer.remove()

    this._tetrosLayer = DOMDisplay.drawTetros(inactiveChunks, activeTetro)

    DOMDisplay.score = state.score
    DOMDisplay.level = state.level

    this._gameBoardDOM.appendChild(this._tetrosLayer)
  }

  clear() {
    this._gameDOM.remove()
  }

  static get scoreNumberNode() {
    return document.querySelector('.score-container .score-number')
  }

  static get levelNumberNode() {
    return document.querySelector('.level-container .level-number')
  }

  static set score(value) {
    DOMDisplay.scoreNumberNode.textContent = value
  }

  static set level(value) {
    DOMDisplay.levelNumberNode.textContent = value
  }
}

export default DOMDisplay
