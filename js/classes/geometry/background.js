import Projection from "./projection.js";

export default class Background extends Projection {
    // Main props
    _canvas;
    _grid;
    _width;
    _height;
    movementAllowed;

    // Draw props
    fillColor = "yellow";
    strokeColor = "black";
    strokeWidth = 1;

    // SETTER AND GETTERS
    // Size prop: determines amount of columns and rows
    _size = 50;
    get size() {
        return this._size / 2;
    }
    set size(value) {
        this._size = Math.max(10, value * 2);
    }

    // Constructor: set event listeners and generate first grid
    constructor(canvasId, movementAllowed = true) {
        super();

        this._canvas = document.getElementById(canvasId);
        this.movementAllowed = movementAllowed;

        // set event listeners
        window.addEventListener("resize", () => this.resize());
        window.addEventListener("keydown", (e) => this.setOffset(e));
        this.resize();
    }

    // Offset bindings
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

    // Resize canvas: recalculate number of columns and rows, force regeneration of base grid and draw
    resize() {
        const rect = this._canvas.getBoundingClientRect();
        const cssWidth = rect.width; const cssHeight = rect.height;

        if (this._canvas.width != cssWidth || this._canvas.height != cssHeight) {
            this._canvas.width = cssWidth;
            this._width = cssWidth;
            this._canvas.height = cssHeight;
            this._height = cssHeight;

            let screenRatio = (cssHeight / cssWidth);

            let columns = this._size, rows = Math.round((columns * screenRatio) * 0.5) * 2;
            this._grid = this.generateGrid(rows, columns);
            this.draw();
        }
    }

    // Draw function: draws to the canvas
    draw() {
        const ctx = this._canvas.getContext("2d");

        if (ctx) {
            ctx.clearRect(0, 0, this._width, this._height);

            let projection = this.projection;
            let horizon = this.horizon;

            ctx.fillStyle = this.fillColor;
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.strokeWidth;

            // Create the actual grid
            for (let i = 0; i < projection.length; i++) {
            
                // Start by creating a polygon to be filled
                for (let j = 0; j < projection[i].length; j++) {

                    if (j === projection[i].length - 1) continue;

                    let topLeftPoint = (i === 0) ? horizon[j] : projection[i][j], 
                        topRightPoint = (i === 0) ? horizon[j + 1] : projection[i][j + 1];
                    
                    ctx.beginPath();
                    ctx.moveTo(topLeftPoint.x * this._width, topLeftPoint.y * this._height);
                    ctx.lineTo(topRightPoint.x * this._width, topRightPoint.y * this._height);

                    if (i < projection.length - 1) {
                        let bottomRightPoint = projection[i + 1][j + 1], bottomLeftPoint = projection[i + 1][j];
                        ctx.lineTo(bottomRightPoint.x * this._width, bottomRightPoint.y * this._height);
                        ctx.lineTo(bottomLeftPoint.x * this._width, bottomLeftPoint.y * this._height)
                    } else {
                        ctx.lineTo(topLeftPoint.x, this._height);
                    }
                    ctx.fill();
                    ctx.stroke();

                }

                // Next make a new path for the stroke
                // Horizontal line first
                ctx.beginPath();
                for (let j = 0; j < projection[i].length; j++) {
                    let point = (i === 0) ? horizon[j] : projection[i][j];
                    if (j === 0) {
                        ctx.moveTo(point.x * this._width, point.y * this._height);
                    } else {
                        ctx.lineTo(point.x * this._width, point.y * this._height);
                    }
                }
                // Vertical next
                if (i < projection.length - 1) {
                    for (let j = 0; j < projection[i].length; j++) {
                        let point = (i === 0) ? horizon[j] : projection[i][j], nextPoint = projection[i + 1][j]

                        ctx.moveTo(point.x * this._width, point.y * this._height);
                        ctx.lineTo(nextPoint.x * this._width, nextPoint.y * this._height);
                    }
                }
                ctx.stroke();
            }
        }
    }
}