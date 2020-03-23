import { KEY_CODES, ACTIONS } from './consts'

const controlsConfig = [
  {
    action: ACTIONS.MOVE_LEFT,
    keys: [KEY_CODES.ARROW_LEFT],
    shouldActOnRepeated: true,
  },
  {
    action: ACTIONS.MOVE_RIGHT,
    keys: [KEY_CODES.ARROW_RIGHT],
    shouldActOnRepeated: true,
  },
  {
    action: ACTIONS.MOVE_DOWN,
    keys: [KEY_CODES.ARROW_DOWN],
    shouldActOnRepeated: true,
  },
  {
    action: ACTIONS.ROTATE_LEFT,
    keys: [KEY_CODES.Z],
    shouldActOnRepeated: false,
  },
  {
    action: ACTIONS.ROTATE_RIGHT,
    keys: [KEY_CODES.ARROW_UP],
    shouldActOnRepeated: false,
  },
]

export default controlsConfig
