export default class Point {
    _x;
    _y;

    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }

    constructor(x, y) {
        this._x = x; this._y = y;
    }
}