import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.article = params.article;
  }

  async getHtml() {
    return `
            <div class="article">
                <div class="article-header">
                    <h3>${this.article.title}</h3>
                    ${
                      this.article.showEditDeleteButtons
                        ? `
                    <button class="edit-button">✏️</button>
                    <button class="delete-button">🗑️</button>`
                        : ""
                    }
                </div>
                <div class="article-details">
                  <p>Author: ${this.article.author}</p>
                  <p>Published on: ${this.article.publishedDate}</p>
                  <p>Last modified: ${this.article.modifiedDate}</p>
                  <p>Tags: ${this.article.tags.join(", ")}</p>
                  ${
                    this.article.preview
                      ? `<p class="preview">${this.article.content.substring(0,50)}...</p>`
                      : ""
                  }
                </div>
            </div>
        `;
  }
}
