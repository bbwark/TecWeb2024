import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Article Detail");
    }

    async getHtml() {
        return `
            <h1>Article Detail</h1>
        `;
    }
}