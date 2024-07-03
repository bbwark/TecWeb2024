import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
    }

    async getHtml() {
        return `
            <h1>Article</h1>
        `;
    }
}