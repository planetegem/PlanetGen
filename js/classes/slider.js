export default class Slider {
    // Elements
    container;
    input;
    result;

    // Actions
    setter;

    constructor(id, name, setter, defaultValue = 50) {
        // Setter and getter hold link with controller
        this.setter = setter;

        // Create elements
        // 1. Finish container
        this.container = document.querySelector(id);
        this.container.classList.add("slider-container");

        // 2. Add label
        const label = document.createElement("label");
        label.innerText = name;
        this.container.appendChild(label);

        // 3. Add range input (slider)
        this.input = document.createElement("input");
        this.input.setAttribute("type", "range");
        this.input.setAttribute("min", "0");
        this.input.setAttribute("max", "100");
        this.input.value = defaultValue;
        this.container.appendChild(this.input);

        // 4. Add numerical result
        this.result = document.createElement("span");
        this.container.appendChild(this.result);

        // Event listener: act when slider is moved
        // change UI state of slider; call setter; show setter response as result
        this.input.addEventListener("input", (e) => {
            const value = (e.target.value - e.target.min) / (e.target.max - e.target.min) * 100;
            e.target.style.setProperty('--range-value', value + '%');
            this.result.innerText = this.setter(e.target.value).toFixed(2);
        });

        // Default value of slider
        // Use getter to get default value; do same steps as for event listener
        const value = (this.input.value - this.input.min) / (this.input.max - this.input.min) * 100;
        this.input.style.setProperty('--range-value', value + '%');
        this.result.innerText = this.setter(this.input.value).toFixed(2);
    }
}