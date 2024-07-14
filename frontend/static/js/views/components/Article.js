import AbstractView from "../AbstractView.js";
import rest from "../../rest.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    const data = await rest.getUserById(this.params.authorId);
    const authorName = data.name;

    return `
            <div class="article">
                <div class="article-header">
                    <h3>${this.params.title}</h3>
                    ${
                      this.params.showEditDeleteButtons
                        ? `
                    <button id="edit-button" class="edit-button">✏️</button>
                    <button id="delete-button" class="delete-button">🗑️</button>`
                        : ""
                    }
                </div>
                <div class="article-details">
                  <p>Author: ${!authorName ? "Account Deleted" : authorName}</p>
                  <p>Published on: ${this.params.publishedDate}</p>
                  <p>Last modified: ${this.params.modifiedDate}</p>
                  <p>Tags: ${this.params.tags}</p>
                  ${
                    this.params.preview
                      ? `<p class="preview">${this.params.content.substring(
                          0,
                          50
                        )}...</p>`
                      : ""
                  }
                </div>
            </div>
        `;
  }
}
