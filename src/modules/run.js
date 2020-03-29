import State from '../State/State'
import ControlsTracker from '../ControlsTracker/ControlsTracker'
import GAME_STATUSES from './game-statuses'
import controlsConfig from './controls-config'

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
  return new Promise((resolve, _) => {
    const controlsTracker = ControlsTracker.create(controlsConfig)

    function onTick(hasIntervalPassed) {
      // eslint-disable-next-line no-param-reassign
      state = state.update(hasIntervalPassed, controlsTracker)
      display.syncWithState(state)

      if (state.status === GAME_STATUSES.LEVEL_CHANGE) {
        resolve(state)
        return false
      }

      if (state.status === GAME_STATUSES.PLAYING) {
        return true
      }

      if (state.status === GAME_STATUSES.GAME_OVER) {
        controlsTracker.removeEventListeners()
        resolve(state)
        return false
      }

      return false
    }

    runAnimation(onTick, state.interval)
  })
}

export const runGame = async (Display, config) => {
  const initalState = State.create(config)
  let state = initalState
  const display = Display.create(document.querySelector('#game-wrapper'), config.width, config.height)

  while (true) {
    await display.showStartScreen()

    while (true) {
      const stateAfterLevel = await runLevel(display, state)
      if (stateAfterLevel.status === GAME_STATUSES.LEVEL_CHANGE) {
        state = State.overrideState(stateAfterLevel, {
          _status: GAME_STATUSES.PLAYING,
        })
      } else if (stateAfterLevel.status === GAME_STATUSES.GAME_OVER) {
        state = initalState
        break
        // TODO: show score notification
      }
    }
  }
}
