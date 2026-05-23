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
    // 1. Terrain modifier hooks
    syncGridSize(value = false) {
        if (value) {
            this.background.size = value;
            this.background.resize();
        }
        return this.background.size;
    }
    syncTerrainVariation(value = false) {
        if (value) {
            this.background.terrainVariation = value;
            this.background.resize();
        }
        return this.background.terrainVariation;
    }
    syncTerrainElevation(value = false) {
        if (value) {
            this.background.elevationLimit = value;
            this.background.resize();
        }
        return this.background.elevationLimit;
    }

    // 2. Projection modifier hooks
    syncHorizontalConvergence(value = false) {
        if (value) {
            this.background.hConvergence = value;
            this.background.draw();
        }
        return this.background.hConvergence;
    }
    syncVerticalDivergence(value = false) {
        if (value) {
            this.background.vDivergence = value;
            this.background.draw();
        }
        return this.background.vDivergence;
    }

    // 3. Horizon modifier hooks
    syncHorizonHeight(value = false) {
        if (value) {
            this.background.horizonHeight = value;
            this.background.draw();
        }
        return this.background.horizonHeight;
    }
    syncHorizonCurve(value = false) {
        if (value) {
            this.background.horizonCurve = value;
            this.background.draw();
        }
        return this.background.horizonCurve;
    }

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
        ).setValues(40);
        new Slider(
            "#elevation-limit",
            (val) => this.syncTerrainElevation(val)
        );

        // 2. Projection modifier sliders
        new Slider(
            "#h-convergence",
            (val) => this.syncHorizontalConvergence(val)
        ).setValues(20);
        new Slider(
            "#v-divergence",
            (val) => this.syncVerticalDivergence(val)
        ).setValues(150, 80, 300);

        // 3. Horizon modifier sliders
        new Slider(
            "#horizon-height",
            (val) => this.syncHorizonHeight(val)
        ).setValues(70);
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