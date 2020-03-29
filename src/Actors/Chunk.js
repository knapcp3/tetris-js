export default class Chunk {
  constructor(vec, color) {
    this._vec = vec
    this._color = color
  }

  equals(other) {
    return this._vec.equals(other.vec)
  }

  get vec() {
    return this._vec
  }

  get color() {
    return this._color
  }

  set vec(v) {
    this._vec = v
  }
}
