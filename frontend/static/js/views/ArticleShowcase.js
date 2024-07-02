import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Article Showcase");
    }

    async getHtml() {
        return `
            <h1>Article Showcase</h1>
        `;
    }
}