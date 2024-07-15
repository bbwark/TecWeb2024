import AbstractView from "../AbstractView.js";
import rest from "../../rest.js";
import ModifyArticle from "../ModifyArticle.js";
import { state } from "../../config.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);

    const app = document.querySelector("#app");
    if (!app.articleEditButton) app.articleEditButton = this.articleEditButton;
    if (!app.articleDeleteButton) app.articleDeleteButton = this.articleDeleteButton;
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
                    <button id="edit-button" class="edit-button" onclick="app.articleEditButton(${this.params.articleId})">✏️</button>
                    <button id="delete-button" class="delete-button" onclick="app.articleDeleteButton(${this.params.articleId})">🗑️</button>`
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

  async articleEditButton(articleId) {
    state.setArticleModifying(articleId);
    history.pushState(null, null, "/modify-article");
    document.querySelector("#app").innerHTML =
      await new ModifyArticle().getHtml();
  }

  async articleDeleteButton(articleId) {
    await rest.deleteArticle(articleId);
    app.location.reload();
  }
}
