import { EVENTS } from '../modules/consts'

class ControlsTracker {
  constructor(controlsTrackingMap) {
    this._controlsTrackingMap = controlsTrackingMap
  }

  static create(config) {
    const controlsTrackingMap = {}

    const track = e => {
      config.forEach(({ action, keys, shouldActOnRepeated }) => {
        if (keys.includes(e.key) && (shouldActOnRepeated || !e.repeat)) {
          controlsTrackingMap[action] = true
        }
      })
    }

    window.addEventListener(EVENTS.KEYDOWN, track)

    ControlsTracker.prototype.removeEventListeners = () => {
      window.removeEventListener(EVENTS.KEYDOWN, track)
    }
    
    return new ControlsTracker(controlsTrackingMap)
  }

  resetControlsTrackingMap() {
    Object.keys(this._controlsTrackingMap).forEach(key => {
      this._controlsTrackingMap[key] = false
    })
  }

  get controlsTrackingMap() {
    return this._controlsTrackingMap
  }
}

export default ControlsTracker
