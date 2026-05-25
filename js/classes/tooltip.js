export default class Tooltip {
    icon;
    body;

    constructor(element) {
        this.icon = element.querySelector("svg");

        // Wrap container around tooltip for styling
        this.body = document.createElement("div");
        this.body.classList.add("tooltip-container");
        this.body.appendChild(element.querySelector(".tooltip-content"));
        
        // Attach tool tip to document body (to bypass any overflow limits) 
        document.getElementById("tooltips").appendChild(this.body);
        this.positionTooltip();
        window.addEventListener("resize", () => this.positionTooltip());

        this.icon.addEventListener('mouseenter', () => {
            this.positionTooltip();
            this.body.style.display = "block";
        });
        this.body.addEventListener('mouseleave', () => {
            this.body.style.display = "none";
        });
    }

    // Position tooltip relative to the icon
    positionTooltip() {
        const rect = this.icon.getBoundingClientRect();
        this.body.style.top = `${rect.top}px`;
        this.body.style.right = `${window.innerWidth - rect.right}px`;
        this.body.style.display = "none";
    }
}