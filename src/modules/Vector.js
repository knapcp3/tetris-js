export default class Vector {
  constructor(x, y) {
    this._x = x
    this._y = y
  }

  plus(other) {
    return new Vector(this._x + other.x, this._y + other.y)
  }

  times(factor) {
    return new Vector(this._x * factor, this._y * factor)
  }

  equals(other) {
    return this._x === other.x && this._y === other.y
  }

  get x() {
    return this._x
  }

  get y() {
    return this._y
  }
}
