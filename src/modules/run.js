import State from '../State/State' 
import Tetrominoe from '../Actors/Tetrominoe' 
import { makeVectors } from './utils'
import { tetrominoes } from './tetrominoes';

// import DOMDisplay from '../Display/DOMDisplay' 

export const runAnimation = (func, minPeriod) => {
  let lastTime = null
  const animate = (time) => {
    if (lastTime) {
      const period = (time - lastTime) / 1000

      if (period < minPeriod) {
        requestAnimationFrame(animate) 
        return 
      }
      if (!func()) return 
    }

    lastTime = time 
    requestAnimationFrame(animate) 
  }

  requestAnimationFrame(animate) 
}

export const runLevel = (display, state) => {
  const { timeSpeed } = state
  
  return new Promise((resolve, reject) => {
    const onTick = () => {
      const prevLevel = state.level

      // eslint-disable-next-line no-param-reassign
      state = state.update()
      display.syncWithState(state)
      // console.log(state)
      if (state.level !== prevLevel) resolve()
      
      if (state.status === 'playing') {
        return true
      }

      return false
    }

    runAnimation(onTick, timeSpeed)
  })
}


export const runGame = async (Display, config) => {
  const state = State.create(config)
  const display = new Display(document.querySelector('#game-wrapper'), state.rows) 

  // while (true) {
    const status = await runLevel(display, state)

    // console.log(status)
   
  // }

  // const t = Tetrominoe.create(tetrominoes.L)
  // console.log(t)
}
