import Vector from '../modules/Vector';

export default class Tetrominoe {
  constructor(sets, position, activeSetInd, color) {
    this._sets = sets;
    this._position = position
    this._activeSetInd = activeSetInd;
    this._color = color
  }

  static create({ sets, x, y }, color = 'black') {
    const initInd = 0;
    return new Tetrominoe(sets, new Vector(x, y), initInd, color);
  }

  update() {
    return new Tetrominoe(
      this._sets,
      this._position.plus(new Vector(0, 1)),
      this._activeSetInd,
      this._color,
    )
  }

  // getChunks() {
  //   const set = this._sets[this._activeSetInd]
  //   const chunks = set.map(
  //     (row) =>
  //       row.map(
  //         (cell) =>
  //           cell,
  //       ),
  //   )
  // }

  turnLeft() {
    this._activeSetInd = (this._activeSetInd - 1) % this._sets.length;
  }

  turnRight() {
    this._activeSetInd = (this._activeSetInd + 1) % this._sets.length;
  }

  get color() {
    return this._color
  }

  get position() {
    return this._position
  }

  get currentSet() {
    return this._sets[this._activeSetInd]
  }
}
