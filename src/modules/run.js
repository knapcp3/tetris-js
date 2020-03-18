import State from '../State/State'
import Tetrominoe from '../Actors/Tetrominoe'
import { makeVectors } from './utils'
import { tetrominoes } from './tetrominoes'
import GAME_STATUSES from '../modules/game-statuses'
// import DOMDisplay from '../Display/DOMDisplay'

export const runAnimation = (animationFunc, interval) => {
  let lastTime = null
  let hasIntervalPassed = true
  const animate = currentTime => {
    if (lastTime) {
      const diff = currentTime - lastTime
      hasIntervalPassed = diff > interval
    }
    if (!animationFunc(hasIntervalPassed)) return
    if (hasIntervalPassed) lastTime = currentTime
    hasIntervalPassed = false
    requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
}

export const runLevel = (display, state) => {
  return new Promise((resolve, reject) => {
    const onTick = hasIntervalPassed => {
      const { level } = state
      // eslint-disable-next-line no-param-reassign
      state = State.update(state, hasIntervalPassed)
      display.syncWithState(state)
      if (state.level !== level) resolve()

      if (state.status === GAME_STATUSES.PLAYING) {
        return true
      }

      if (state.status === GAME_STATUSES.GAME_OVER) {
        resolve(state.status)
        return false
      }

      return false
    }

    runAnimation(onTick, state.interval)
  })
}

export const runGame = async (Display, config) => {
  const state = State.create(config)
  const display = new Display(
    document.querySelector('#game-wrapper'),
    state.rows,
  )

  // while (true)
  const status = await runLevel(display, state)
  console.log(status)
}
