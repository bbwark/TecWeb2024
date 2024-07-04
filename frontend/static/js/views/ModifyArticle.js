// /src/views/ModifyArticle.js
import AbstractView from "./AbstractView.js";
import { marked } from "marked";
import Tagify from "@yaireo/tagify";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle(params.isNew ? "New Article" : "Edit Article");
        this.article = params.article || { title: "", content: "", tags: "" };
        this.isNew = params.isNew;
    }

    async getHtml() {
        return `
            <h1>${this.isNew ? "New Article" : "Edit Article"}</h1>
            <form id="article-form">
                <div>
                    <label for="article-title">Title:</label>
                    <input type="text" id="article-title" name="title" value="${this.article.title}" required>
                </div>
                <div>
                    <label for="article-content">Content:</label>
                    <textarea id="article-content" name="content" required>${this.article.content}</textarea>
                </div>
                <div>
                    <label for="article-tags">Tags:</label>
                    <input type="text" id="article-tags" name="tags" value="${this.article.tags}" required>
                </div>
                <div>
                    <button type="button" id="cancel-button">Cancel</button>
                    <button type="submit" id="save-button">Save</button>
                </div>
            </form>
            <h2>Preview:</h2>
            <div id="markdown-preview"></div>
        `;
    }

    async afterRender() {
        const contentElement = document.getElementById("article-content");
        const previewElement = document.getElementById("markdown-preview");

        contentElement.addEventListener("input", () => {
            previewElement.innerHTML = marked(contentElement.value);
        });

        previewElement.innerHTML = marked(contentElement.value);

        const tagInput = document.getElementById("article-tags");
        new Tagify(tagInput);

        document.getElementById("cancel-button").addEventListener("click", () => {
            history.back();
        });

        document.getElementById("article-form").addEventListener("submit", async (event) => {
            event.preventDefault();
            const title = event.target.title.value;
            const content = event.target.content.value;
            const tags = event.target.tags.value;

            try {
                if (this.isNew) {
                    // Logic to save the new article
                    // Simulated REST call:
                    // await fetch('/api/articles', {
                    //     method: 'POST',
                    //     body: JSON.stringify({ title, content, tags }),
                    // });
                    alert("Article created successfully!");
                } else {
                    // Logic to update the existing article
                    // Simulated REST call:
                    // await fetch(`/api/articles/${this.article.id}`, {
                    //     method: 'PUT',
                    //     body: JSON.stringify({ title, content, tags }),
                    // });
                    alert("Article updated successfully!");
                }
                history.back();
            } catch (error) {
                console.error("Failed to save the article:", error);
                alert("Failed to save the article");
            }
        });
    }
}
