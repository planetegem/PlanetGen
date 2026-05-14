export default class Animator {
    // Animation phase handles state; possible phases are
    // idle = not started
    // starting = picking up speed

    animationPhase = "stopped";
    animationRunning = false;

    elapsedTime = 0;
    previousFrame;

    easeInOutDuration;


    constructor(easeInOutDuration) {
        this.easeInOutDuration = easeInOutDuration;
    }

    toggle() {
        // Toggling is forbidden if still processing state switch
        if (this.animationPhase == "starting" || this.animationPhase == "stopping") return undefined;

        this.animationRunning = !this.animationRunning;

        if (this.animationRunning) this._start();
        if (!this.animationRunning) this._stop();

        return this.animationPhase;
    }
    _start() {
        this.animationPhase = "starting";
        this.previousFrame = Date.now();
        this.elapsedTime = 0;
    }
    _stop() {
        this.animationPhase = "stopping";
        this.elapsedTime = 0;
    }

    animate() {
        if (this.animationPhase == "stopped") return [0, this.animationPhase];

        let delta = Date.now() - this.previousFrame;
        this.previousFrame = Date.now();

        let progress, calculatedChange = delta;

        switch (this.animationPhase) {
            case "starting":
                this.elapsedTime += delta;

                progress = this.elapsedTime / this.easeInOutDuration;
                if (progress <= 1) {
                    calculatedChange *= Math.pow(progress, 3);
                } else {
                    this.animationPhase = "running";
                    calculatedChange *= 1;
                }
                break;

            case "stopping":
                this.elapsedTime += delta;

                progress = this.elapsedTime / this.easeInOutDuration;
                if (progress <= 1) {
                    calculatedChange *= Math.pow(1 - progress, 3);
                } else {
                    this.animationPhase = "stopped";
                    calculatedChange *= 0;
                }
                break;

            case "running":
                calculatedChange *= 1;
                break;

            case "stopped":
                calculatedChange *= 0;
                break;

            default:
                console.log("Unsupported animation phase: " + this.animationPhase);
                calculatedChange *= NaN;
        }
        return [calculatedChange, this.animationPhase];
    }
}