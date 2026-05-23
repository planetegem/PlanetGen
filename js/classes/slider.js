export default class Slider {
    // Elements
    container;
    input;
    result;

    // Actions
    setter;

    // Set values of slider
    setValues(defaultValue = 50, min = 0, max = 100) {
        this.input.setAttribute("min", min);
        this.input.setAttribute("max", max);
        this.input.value = defaultValue;
        this.updateUIState();
    }

    // Update UI state of slider
    updateUIState() {
        const value = (this.input.value - this.input.min) / (this.input.max - this.input.min) * 100;
        this.input.style.setProperty('--range-value', value + '%');
        this.result.innerText = this.setter(this.input.value).toFixed(2);
    }

    // Constructor: fill div with html elements & set event listeners
    constructor(id, setter) {
        // Setter and getter hold link with controller
        this.setter = setter;

        // Create elements
        // 1. Finish container
        this.container = document.querySelector(id);
        this.container.classList.add("slider-container");

        // 2. Add label
        const label = document.createElement("label");
        label.innerText = this.container.innerText;
        this.container.innerText = "";
        this.container.appendChild(label);

        // 3. Add range input (slider)
        this.input = document.createElement("input");
        this.input.setAttribute("type", "range");
        this.input.setAttribute("min", "0");
        this.input.setAttribute("max", "100");
        this.input.value = 50;
        this.container.appendChild(this.input);

        // 4. Add numerical result
        this.result = document.createElement("span");
        this.container.appendChild(this.result);

        // Event listener: act when slider is moved
        // change UI state of slider; call setter; show setter response as result
        this.input.addEventListener("input", (e) => this.updateUIState());
        this.updateUIState();
    }
}