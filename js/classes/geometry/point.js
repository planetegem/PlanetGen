export default class Point {
    _x;
    _y;
    _z;

    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get z() {
        return this._z;
    }
   
    constructor(x, y, z = 0) {
        this._x = x; this._y = y; this._z = z;
    }
}