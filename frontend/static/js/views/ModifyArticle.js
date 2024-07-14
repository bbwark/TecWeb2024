import ArticleDTO from "../models/articleDTO.js";
import AbstractView from "./AbstractView.js";

export default class ModifyArticle extends AbstractView {
    constructor(article = new ArticleDTO(), isNew = true, params) {
        super(params);
        this.setTitle(isNew ? "New Article" : "Edit Article");
        this.article = article
        this.isNew = isNew;

        console.log(this.article, this.isNew);
    }

    async getHtml() {
        return `
            <h1>${this.isNew ? "Create New Article" : "Edit Article"}</h1>
            <form id="article-form">
                <label for="title">Title:</label>
                <input type="text" id="title" name="title" value="${this.article.title}" required>
                
                <label for="content">Content:</label>
                <textarea id="content" name="content" required>${this.article.content}</textarea>
                
                <div>
                    <input type="checkbox" id="preview-checkbox">
                    <label for="preview-checkbox">Show Preview</label>
                </div>
                <div id="preview" style="display:none;"></div>
                
                <label for="tags">Tags:</label>
                <input type="text" id="tags" name="tags" value="${this.article.tags}" required>
                
                <button type="button" id="cancel-button">Cancel</button>
                <button type="submit" id="save-button">${this.isNew ? "Save" : "Update"}</button>
            </form>
        `;
    }

    afterRender() {
        // Initialize Tagify
        const input = document.querySelector('input[name=tags]');
        new Tagify(input);

        // Initialize Markdown preview
        const contentTextarea = document.getElementById("content");
        const previewCheckbox = document.getElementById("preview-checkbox");
        const previewDiv = document.getElementById("preview");

        previewCheckbox.addEventListener("change", () => {
            if (previewCheckbox.checked) {
                previewDiv.style.display = "block";
                previewDiv.innerHTML = marked(contentTextarea.value);
            } else {
                previewDiv.style.display = "none";
            }
        });

        contentTextarea.addEventListener("input", () => {
            if (previewCheckbox.checked) {
                previewDiv.innerHTML = marked(contentTextarea.value);
            }
        });

        // Add event listeners for cancel and save buttons
        document.getElementById("cancel-button").addEventListener("click", () => {
            history.back();
        });

        document.getElementById("article-form").addEventListener("submit", (event) => {
            event.preventDefault();
            const title = document.getElementById("title").value;
            const content = document.getElementById("content").value;
            const tags = document.getElementById("tags").value;

            if (this.isNew) {
                // Insert logic
                fetch('/api/articles', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, content, tags }),
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Article created:', data);
                    // Redirect or update UI
                })
                .catch(error => {
                    console.error('Error creating article:', error);
                });
            } else {
                // Update logic
                fetch(`/api/articles/${this.article.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, content, tags }),
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Article updated:', data);
                    // Redirect or update UI
                })
                .catch(error => {
                    console.error('Error updating article:', error);
                });
            }
        });
    }
}
