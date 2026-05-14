import Background from "./geometry/background.js";
import Animator from "./animator.js";
import Slider from "./slider.js";

export default class Controller {

    animator = new Animator(1000);
    background = new Background("fake-3D-background");
    velocity = 0.0025;

    // Animation toggle
    animationToggle = document.getElementById("animation-toggle");

    interactionAllowed = true;

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

    // Open & close customizer
    customizer = document.getElementById("customizer");
    toggleCustomizer(open) {
        this.customizer.classList.toggle("opened", open);
    }

    // Sliders
    syncHorizonHeight(value = false) {
        if (value) {
            this.background.horizonHeight = value;
            this.background.draw();
            return this.background.horizonHeight;
        }
        return this.background.horizonHeight;
    }

    constructor() {
        this.animationToggle.addEventListener("click", () => this.toggleAnimation());

        new Slider(
            "#horizon-height", 
            "horizon height",
            (val) => this.syncHorizonHeight(val),
            70
        );

        document.getElementById("open-customizer").addEventListener("click", () => this.toggleCustomizer(true));
        document.getElementById("close-customizer").addEventListener("click", () => this.toggleCustomizer(false));

    }
}