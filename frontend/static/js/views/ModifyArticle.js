import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Modify Article");
    }

    async getHtml() {
        return `
            <h1>Modify Article</h1>
        `;
    }
}