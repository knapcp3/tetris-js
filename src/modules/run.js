import State from '../State/State'
import ControlsTracker from '../ControlsTracker/ControlsTracker'
import GAME_STATUSES from './game-statuses'
import controlsConfig from './controls-config'
import { KEY_CODES } from './consts'
import DOMDisplay from '../Display/DOMDisplay'

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
  let isPaused = false

  return new Promise((resolve, reject) => {
    const onBlur = () => () => () => {
      isPaused = true
    }

    const onFocus = onTickFn => interval => () => {
      if (isPaused) {
        isPaused = false
        runAnimation(onTickFn, interval)
      }
    }

    const onEscapePress = onTickFn => interval => e => {
      if (e.key === KEY_CODES.ESCAPE) {
        e.preventDefault()
        isPaused = !isPaused
        
        if (isPaused) {
          display.showPauseScreen()
        } else {
          display.removePauseScreen()
          runAnimation(onTickFn, interval)
        }
      }
    }

    const controlsTracker = ControlsTracker.create(controlsConfig)

    function onTick(hasIntervalPassed) {
      const { level } = state
      // eslint-disable-next-line no-param-reassign
      state = State.update(state, hasIntervalPassed, controlsTracker)
      display.syncWithState(state)

      if (isPaused) return false

      if (state.level !== level) resolve('CO JEST KURLA') // TODO: remove

      if (state.status === GAME_STATUSES.PLAYING) {
        return true
      }

      if (state.status === GAME_STATUSES.GAME_OVER) {
        controlsTracker.removeEventListeners()
        window.removeEventListener('blur', onBlur()())
        window.removeEventListener('focus', onFocus()())
        window.removeEventListener('keydown', onEscapePress()())
        resolve(state.status)
        return false
      }

      return false
    }

    window.addEventListener('blur', onBlur()())
    window.addEventListener('focus', onFocus(onTick)(state.interval))
    window.addEventListener('keydown', onEscapePress(onTick)(state.interval))

    runAnimation(onTick, state.interval)
  })
}

export const runGame = async (Display, config) => {
  const state = State.create(config)
  const display = new Display(document.querySelector('#game-wrapper'), state.rows)

  // while (true)
  const status = await runLevel(display, state)
  console.log(status)
}
