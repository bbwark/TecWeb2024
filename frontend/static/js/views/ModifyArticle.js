import { state } from "../config.js";
import ArticleDTO from "../models/articleDTO.js";
import rest from "../rest.js";
import AbstractView from "./AbstractView.js";

export default class ModifyArticle extends AbstractView {
  constructor(params) {
    super(params);
    state.loadState();
    this.articleId = state.articleModifying;
    this.isNew = state.articleModifying === 0 ? true : false;
    this.setTitle(this.isNew ? "New Article" : "Edit Article");
  }

  async getHtml() {
    let article = new ArticleDTO();
    if (this.articleId !== 0) {
      article = await rest.getArticleById(this.articleId);
    }

    return `
            <h1>${this.isNew ? "Create New Article" : "Edit Article"}</h1>
            <form id="article-form">
                <label for="title">Title:</label>
                <input type="text" id="title" name="title" value="${
                  article.title
                }" required>
                
                <label for="content">Content:</label>
                <textarea id="content" name="content" required>${
                  article.content
                }</textarea>
                
                <div>
                    <input type="checkbox" id="preview-checkbox">
                    <label for="preview-checkbox">Show Preview</label>
                </div>
                <div id="preview" style="display:none;"></div>
                
                <label for="tags">Tags:</label>
                <input type="text" id="tags" name="tags" value="${
                  article.tags
                }" required>
                
                <button type="button" id="cancel-button">Cancel</button>
                <button type="submit" id="save-button">${
                  this.isNew ? "Save" : "Update"
                }</button>
            </form>
        `;
  }

  afterRender() {
    // Initialize Tagify
    const input = document.querySelector("input[name=tags]");
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

    document
      .getElementById("article-form")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;
        const tags = document.getElementById("tags").value;

        if (this.isNew) {
          // Insert logic
          fetch("/api/articles", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, content, tags }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Article created:", data);
              // Redirect or update UI
            })
            .catch((error) => {
              console.error("Error creating article:", error);
            });
        } else {
          // Update logic
          fetch(`/api/articles/${article.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, content, tags }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Article updated:", data);
              // Redirect or update UI
            })
            .catch((error) => {
              console.error("Error updating article:", error);
            });
        }
      });
  }
}
