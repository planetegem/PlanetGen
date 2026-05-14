import Projection from "./projection.js";

export default class Background extends Projection {
    _canvas;
    _grid;

    _width;
    _height;
    _numberOfColumns;
    movementAllowed;

    fillColor = "yellow";
    strokeColor = "black";
    strokeWidth = 1;

    constructor(canvasId, movementAllowed = true) {
        super();

        this._canvas = document.getElementById(canvasId);
        this.movementAllowed = movementAllowed;

        // set event listeners
        window.addEventListener("resize", () => this.resize());
        window.addEventListener("keydown", (e) => this.setOffset(e));
        this.resize();
    }

    changeOffset(offset) {
        this.offset -= offset;
        this.draw();
    }

    setOffset(e) {
        if (this.movementAllowed) {
            if (e.code == "ArrowUp") {
                this.offset -= 0.1;
            }
            if (e.code == "ArrowDown") {
                this.offset += 0.1;
            }
            this.draw();
        }
    }

    resize() {
        const rect = this._canvas.getBoundingClientRect();
        const cssWidth = rect.width; const cssHeight = rect.height;

        if (this._canvas.width != cssWidth || this._canvas.height != cssHeight) {
            this._canvas.width = cssWidth;
            this._width = cssWidth;
            this._canvas.height = cssHeight;
            this._height = cssHeight;

            let screenRatio = (cssWidth / cssHeight);

            let rows = 30, columns = Math.round((rows * screenRatio) * 0.5) * 2;
            this._grid = this.generateGrid(rows, columns);
            this.draw();
        }
    }
    draw() {
        const ctx = this._canvas.getContext("2d");

        if (ctx) {
            ctx.clearRect(0, 0, this._width, this._height);

            let projection = this.projection;
            let horizon = this.horizon;

            ctx.fillStyle = this.fillColor;
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.strokeWidth;

            // Color up to horizon
            ctx.beginPath();
            for (let i = 0; i < horizon.length; i++) {
                let point = horizon[i];
                if (i === 0) {
                    ctx.moveTo(point.x * this._width, point.y * this._height);
                } else {
                    ctx.lineTo(point.x * this._width, point.y * this._height);
                }
            }
            ctx.lineTo(this._width, this._height);
            ctx.lineTo(0, this._height);
            ctx.fill();

            // Create the actual grid
            for (let i = 0; i < projection.length; i++) {

                // Start by creating a polygon to be filled
                ctx.beginPath();
                for (let j = 0; j < projection[i].length; j++) {
                    let point = projection[i][j];
                    if (j === 0) {
                        ctx.moveTo(point.x * this._width, point.y * this._height);
                    } else {
                        ctx.lineTo(point.x * this._width, point.y * this._height);
                    }
                }
                ctx.lineTo(this._width, this._height);
                ctx.lineTo(0, this._height);
                ctx.fill();

                // Next make a new path for the stroke
                // Horizontal line first
                ctx.beginPath();
                for (let j = 0; j < projection[i].length; j++) {
                    let point = projection[i][j];
                    if (j === 0) {
                        ctx.moveTo(point.x * this._width, point.y * this._height);
                    } else {
                        ctx.lineTo(point.x * this._width, point.y * this._height);
                    }
                }
                // Vertical next
                if (i < projection.length - 1) {
                    for (let j = 0; j < projection[i].length; j++) {
                        let point = projection[i][j], nextPoint = projection[i + 1][j]

                        ctx.moveTo(point.x * this._width, point.y * this._height);
                        ctx.lineTo(nextPoint.x * this._width, nextPoint.y * this._height);
                    }
                }
                ctx.stroke();
            }

            // Remove everything hidden by the horizon
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(0, 0);
            for (let i = 0; i < horizon.length; i++) {
                let point = horizon[i];
                ctx.lineTo(point.x * this._width, point.y * this._height);
            }
            ctx.lineTo(this._width, 0);
            ctx.closePath();
            ctx.clip();
            ctx.clearRect(0, 0, this._width, this._height);
            ctx.restore();

            // Draw the horizon
            ctx.beginPath();
            for (let i = 0; i < horizon.length; i++) {
                let point = horizon[i];
                if (i === 0) {
                    ctx.moveTo(point.x * this._width, point.y * this._height);
                } else {
                    ctx.lineTo(point.x * this._width, point.y * this._height);
                }
            }
            ctx.stroke();
        }
    }
}

