import Grid from "./grid.js";
import Point from "./point.js";

export default class Projection extends Grid {
    // PROJECTION
    // Offsets grid to make 3D projection effect
    _projection;

    // SETTABLE PROPS
    // Horizon height: of 0, horizon starts at top of element; if 1, horizon starts at bottom
    set horizonHeight(value) {
        this._horizonHeight = 1 - value / 100;
    }
    get horizonHeight() {
        return 1 - this._horizonHeight;
    }
    _horizonHeight = 0.3;

    // Horizontal convergence: how quickly do vertical lines converge horizontally? 
    // Or how much wider do things appear closer to the bottom edge?
    set hConvergence(value) {
        this._hConvergence = value / 100;
    }
    get hConvergence() {
        return this._hConvergence;
    }
    _hConvergence = 0.25;

    // Vertical divergence: determines rate at which y becomes more extreme as row nears viewpont
    // Rows close to the horizon become smaller
    set vDivergence(value) {
        this._vDivergence = value / 100;
    }
    get vDivergence(){
        return this._vDivergence;
    }
    _vDivergence = 1.5;

    // Horizon curve: determines how much curve is visible in the horizon
    set horizonCurve(value) {
        this._horizonCurve = value / 100;
    }
    get horizonCurve(){
        return this._horizonCurve;
    }
    _horizonCurve = 0.25;

    // Main projection logic
    get projection() {
        this._projection = [];

        for (let i = 0; i < this.grid.length; i++) {
            let projectedRow = [];

            for (let j = 0; j < this.numberOfColumns; j++) {

                // BASE VALUES
                // X & Y go from 0 to 1, where 1 is total element width or height
                // Note: base ratio rows/columns on ratio element width/height to get approximately square grid
                let baseX = j / (this.numberOfColumns - 1),
                    baseY = i / (this.numberOfRows - 1),
                    correctedBaseY = baseY - this._offset / (this.numberOfRows - 1);

                // PROJECTION OF X
                // 1. Start from the base
                let projectedX = baseX;

                // 2. ProjectX from center, make it more pronounced the higher rowcount (i) becomes
                let projectFromCenter = (j - this.numberOfColumns * 0.5 + 0.5) / this.numberOfColumns;
                projectedX += projectFromCenter * (i - this._offset) * this._hConvergence;

                // 3. Apply terrain mod to get finalX
                let finalX = projectedX;

                // PROJECTION OF Y
                // 1. Start from the base
                let projectedY = baseY;

                // 2. Apply vertical offset (for animation)
                projectedY -= this._offset / (this.numberOfRows - 1);

                // 3. Make y more pronounced the higher the rowcount (i) becomes    
                projectedY = Math.pow(Math.max(projectedY, 0), this._vDivergence + correctedBaseY);

                // 4. Set horizon curve
                projectedY += Math.pow(Math.abs(projectFromCenter), 1.5) * this._horizonCurve;

                // 5. Add horizon offset and terrain mod to get finalY
                let finalY = this._horizonHeight + projectedY;

                let currentPoint = this._grid[i][j];
                finalY += currentPoint.z * correctedBaseY;
                                
                // RESULT
                projectedRow.push(new Point(finalX, finalY));

                // If last row contains point that's not at bottom of screen, generate extra row
                if (i == this.grid.length - 1 && finalY <= 1)
                    this.grid.push(this.createRow(this.grid[this.grid.length - 1]));
            }
            this._projection.push(projectedRow);
        }
        return this._projection;
    }
  
    // HORIZON
    // Draw a horizon between first and second row (used in animation)
    _horizon = [];
    get horizon() {
        this._horizon = [];
        for (let i = 0; i < this._projection[0].length; i++) {
            let previous = this._projection[0][i], next = this._projection[1][i];

            let horizonX = previous.x * (1 - this._offset) + next.x * this._offset,
                horizonY = previous.y * (1 - this._offset) + next.y * this._offset;
            this._horizon.push(new Point(horizonX, horizonY));
        }
        return this._horizon;
    }
}