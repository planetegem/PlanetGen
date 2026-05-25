import Background from "./geometry/background.js";
import Animator from "./animator.js";
import Slider from "./slider.js";
import Tooltip from "./tooltip.js";

export default class Controller {

    // Assign canvas element to background  
    background = new Background("fake-3D-background");

    // Animation processor
    animator = new Animator(1000);
    velocity = 0.0025;

    // Animation toggle
    animationToggle = document.getElementById("animation-toggle");
    interactionAllowed = true;

    // Animation logic
    toggleAnimation() {
        let response = this.animator.toggle();
        if (response == "starting") this.animationToggle.classList.add("playing");
        if (response == "stopping") this.animationToggle.classList.remove("playing");

        if (response) this.animationLoop();
    }
    animationLoop() {
        let [progress, state] = this.animator.animate();
        this.background.changeOffset(progress * this.velocity);

        if (state != "stopped") requestAnimationFrame(() => this.animationLoop());
    }

    // Toggle centre aligning of the background
    centreAlignToggle = document.getElementById("center-align-toggle");
    toggleCentreAlign() {
        document.body.classList.toggle('centered');
    }

    // Open & close customizer
    toggleCustomizer(open) {
        document.body.classList.toggle("opened", open);
    }

    // Slider hooks
    _makeSyncHook(prop, action = "draw"){
        return (value = false) => {
            if (value) {
                this.background[prop] = value;
                this.background[action]();
            }
            return this.background[prop];
        };
    }

    // 1. Level of detail: increases grid size
    syncGridSize = this._makeSyncHook("size", "resize");
    
    // 2. Terrain modifier hooks
    syncTerrainVariation = this._makeSyncHook("terrainVariation");
    syncTerrainElevation = this._makeSyncHook("elevationLimit");
    

    // 3. Projection modifier hooks
    syncHorizontalConvergence = this._makeSyncHook("hConvergence");
    syncVerticalDivergence= this._makeSyncHook("vDivergence");

    // 4. Horizon modifier hooks
    syncHorizonHeight = this._makeSyncHook("horizonHeight");
    syncHorizonCurve = this._makeSyncHook("horizonCurve");
        
    // Constructor: set event listeners and create sliders
    constructor() {

        // Prepare intro dialog
        const dialog = document.getElementById("intro-dialog");
        document.getElementById("open-intro").addEventListener("click", () => {
            dialog.showModal();
        });
        document.getElementById("close-intro").addEventListener("click", () => {
            dialog.close();
        });
        dialog.showModal();

        // Animation button event listeners
        this.animationToggle.addEventListener("click", () => this.toggleAnimation());
        this.centreAlignToggle.addEventListener("click", () => this.toggleCentreAlign());

        // Space also starts animation
        window.addEventListener("keydown", (e) => {
            if (e.code == "Space") this.toggleAnimation();
        });

        // Customizer toggles
        document.getElementById("open-customizer").addEventListener("click", () => this.toggleCustomizer(true));
        document.getElementById("close-customizer").addEventListener("click", () => this.toggleCustomizer(false));
        document.getElementById("toggle-customizer").addEventListener("click", () => document.body.classList.toggle("opened"));

        // Construct the sliders and attach hooks
        // 1. Terrain modifier sliders
        new Slider(
            "#grid-size",
            (val) => this.syncGridSize(val)
        ).setValues(25, 5, 50);
        new Slider(
            "#terrain-variation",
            (val) => this.syncTerrainVariation(val)
        ).setValues(60, 0, 180);
        new Slider(
            "#elevation-limit",
            (val) => this.syncTerrainElevation(val)
        ).setValues(60);

        // 2. Projection modifier sliders
        new Slider(
            "#h-convergence",
            (val) => this.syncHorizontalConvergence(val)
        ).setValues(20);
        new Slider(
            "#v-divergence",
            (val) => this.syncVerticalDivergence(val)
        ).setValues(40, 0, 100);

        // 3. Horizon modifier sliders
        new Slider(
            "#horizon-height",
            (val) => this.syncHorizonHeight(val)
        ).setValues(55);
        new Slider(
            "#horizon-curve",
            (val) => this.syncHorizonCurve(val)
        ).setValues(20, -40, 80);

        // Create tooltips (attached to body to avoid clipping when transforming)
        const tooltips = document.querySelectorAll(".tooltip");
        for (let tooltip of tooltips) {
            new Tooltip(tooltip);
        }



    }
}