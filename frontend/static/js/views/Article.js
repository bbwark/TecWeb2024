// article.js
import AbstractView from "./AbstractView.js"; // Assuming your abstract class is in a file named AbstractView.js

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Article");
    }

    async getHtml() {
        const { title, author, publishedDate, modifiedDate, tags, preview, showEditDeleteButtons } = this.params;
        
        return `
            <div class="article">
                <div class="article-header">
                    <h2>${title}</h2>
                    ${showEditDeleteButtons ? `
                    <button class="edit-button">✏️</button>
                    <button class="delete-button">🗑️</button>` : ""}
                </div>
                <p>Author: ${author}</p>
                <p>Published on: ${publishedDate}</p>
                <p>Last modified: ${modifiedDate}</p>
                <p>Tags: ${tags.join(", ")}</p>
                ${preview ? `<p class="preview">${preview}</p>` : ""}
            </div>
        `;
    }
}
