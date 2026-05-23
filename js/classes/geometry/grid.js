import Point from "./point.js";

export default class Grid {

    // BASE PROPS
    grid;
    numberOfRows;
    numberOfColumns;

    // MAKE NEW GRID
    generateGrid(rows, columns) {
        this.numberOfRows = rows;
        this.numberOfColumns = columns;

        this.grid = [];
        for (let i = 0; i < this.numberOfRows; i++) {
            if (i === 0) {
                this.grid.push(this.createRow());
            } else {
                this.grid.push(this.createRow(this.grid[i - 1]));
            }
        }
        return this.grid;
    }

    // TERRAIN GENERATION PARAMETERS
    // Max variation says how much a point can vary compared to neighbouring points
    set terrainVariation(value){
        this._maxVariation = value / 400;
    }
    get terrainVariation(){
        return this._maxVariation;
    }
    _maxVariation = 0.2;

    // Lower and upper limits
    set elevationLimit(value) {
        this._lowerLimitVariation = -value / 100;
    }
    get elevationLimit() {
        return Math.abs(this._lowerLimitVariation);
    }
    _lowerLimitVariation = -0.5;
    _upperLimitVariation = 0;

    // CREATE ROW
    // Takes another row as optional parameter to compare against (to create logically flowing terrain)
    createRow(compareToRow = []) {
        let row = [];
        for (let i = 0; i < this.numberOfColumns; i++) {
            let x = 0, y = 0, z = 0;
            if (compareToRow.length === 0) {
                if (i === 0) {
                    z = this.randomCoord(this._lowerLimitVariation, this._upperLimitVariation);
                } else {
                    let proposedZ = this.randomCoord(row[i - 1].z - this._maxVariation, row[i - 1].z + this._maxVariation);
                    z = Math.min(this._upperLimitVariation, Math.max(this._lowerLimitVariation, proposedZ));
                }

            } else {
                if (i === 0) {
                    let proposal1 = this.randomCoord(this._lowerLimitVariation, this._upperLimitVariation);
                    let proposal2 = this.randomCoord(compareToRow[i].z - this._maxVariation, compareToRow[i].z + this._maxVariation);
                    let proposedZ = (proposal1 + proposal2) * 0.5;
                    z = Math.min(this._upperLimitVariation, Math.max(this._lowerLimitVariation, proposedZ));
                } else {
                    let proposal1 = this.randomCoord(compareToRow[i].z - this._maxVariation, compareToRow[i].z + this._maxVariation);
                    let proposal2 = this.randomCoord(row[i - 1].z - this._maxVariation, row[i - 1].z + this._maxVariation);
                    let proposedZ = (proposal1 + proposal2) * 0.5;
                    z = Math.min(this._upperLimitVariation, Math.max(this._lowerLimitVariation, proposedZ));
                }
            }
            row.push(new Point(x, y, z));
        }
        return row;
    }

    // HELPERS
    // get randomized coordinates for point
    randomCoord(min, max) {
        return Math.random() * (max - min) + min
    }

    // OFFSET
    // Used to create scrolling animation
    _offset = 1;
    get offset() {
        return this._offset;
    }
    set offset(amount) {
        this._offset = amount;

        // correct offset to make it circular, adding new rows when necessary
        if (this._offset < 0) {
            this._offset = 1;

            let newRow = this.createRow(this.grid[0]);
            this.grid.unshift(newRow);

            if (!this._keepInMemory) this.grid.pop();
        }
        if (this._offset > 1) {
            this._offset = 0;

            let newRow = this.createRow(this.grid[this.grid.length - 1]);
            this.grid.push(newRow);

            if (!this._keepInMemory) this.grid.shift();
        }
    }
}