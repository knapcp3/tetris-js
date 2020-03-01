import { createElem } from '../modules/utils'
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
          document.createTextNode('0')
        )
      ),
      createElem(
        'div',
        { class: 'level-nr' },
        document.createTextNode('Level: '),
        createElem('span', { class: 'level-nr' }, document.createTextNode('1'))
      )
    )
    const gameInfo = createElem('div', { class: 'game-info' }, infoContent)

    gameInfo.style.width = `${infoWidth * scale}px`
    gameInfo.style.height = `${boardRows.length * scale}px`

    const gameBoard = createElem(
      'div',
      { class: 'game-board' },
      DOMDisplay.drawGrid(boardRows)
    )

    const game = createElem('div', { class: 'game' }, gameInfo, gameBoard)
    return {
      game,
      gameBoard,
    }
  }

  static drawGrid(boardRows) {
    const width = boardRows[0].length
    const height = boardRows.length
    const { scale } = config

    const result = createElem(
      'table',
      { class: 'game-grid' },
      ...boardRows.map((row) =>
        createElem(
          'tr',
          { class: 'row' },
          ...row.map(() => createElem('td', { class: 'sky' })),
        )
      ),
    )

    result.style.width = `${width * scale}px`
    result.style.height = `${height * scale}px`
    return result
  }


  static drawTetros(inactiveChunks, activeTetro) {
    const { scale } = config      
    const { currentSet, position } = activeTetro
    const { x, y } = position

    const chunks = []

    inactiveChunks.forEach(chunks.push)

    currentSet.forEach((row, rInd) => {
      row.forEach((cell, cInd) => {
        if (cell) {
          const chunk = createElem('div', { class: 'chunk' })
          chunk.style.width = `${scale}px`
          chunk.style.height = `${scale}px`
          chunk.style.left = `${(x + cInd) * scale}px`
          chunk.style.top = `${(y + rInd) * scale}px`
          chunks.push(chunk)
        }
      })
    })

    const result = createElem('div', {}, ...chunks)

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
