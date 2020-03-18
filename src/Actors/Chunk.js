export default class Chunk {
  constructor(vec) {
    this._vec = vec
  }

  equals(other) {
    return this._vec.equals(other.vec)
  }

  get vec() {
    return this._vec
  }

  set vec(v) {
    this._vec = v
  }
}
