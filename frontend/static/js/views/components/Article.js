import AbstractView from "../AbstractView.js";
import rest from "../../rest.js";
import ModifyArticle from "../ModifyArticle.js";
import { state } from "../../config.js";
import ArticleShowcase from "../ArticleShowcase.js";
import { setArticlesToShowBasedOnState } from "../../utilities.js";
import ArticleDetail from "../ArticleDetail.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);

    const app = document.querySelector("#app");
    if (!app.articleEditButton) app.articleEditButton = this.articleEditButton;
    if (!app.articleDeleteButton)
      app.articleDeleteButton = this.articleDeleteButton;
    if (!app.showArticleDetail) app.showArticleDetail = this.showArticleDetail;
  }

  async getHtml() {
    let authorName = "";
    try {
      const data = await rest.getUserById(this.params.authorId);
      authorName = data.name;
    } catch (error) {
      console.log("User not found for ID: ", this.params.authorId);
    }

    return `
            <div class="article p-4 bg-white rounded shadow mb-4">
                <div class="article-header flex justify-between items-center">
                    <h3 class="text-xl font-bold cursor-pointer text-blue-600 hover:underline" onclick="app.showArticleDetail(${
                      this.params.articleId
                    })">${this.params.title}</h3>
                    ${
                      this.params.showEditDeleteButtons
                        ? `
                    <div class="flex space-x-2">
                      <button id="edit-button" class="edit-button text-blue-500 hover:text-blue-700" onclick="app.articleEditButton(${this.params.articleId})">✏️</button>
                      <button id="delete-button" class="delete-button text-red-500 hover:text-red-700" onclick="app.articleDeleteButton(${this.params.articleId})">🗑️</button>
                    </div>`
                        : ""
                    }
                </div>
                <div class="article-details mt-2 text-gray-700">
                  <p class="text-sm">Author: ${
                    !authorName ? "Account Deleted" : authorName
                  }</p>
                  <p class="text-sm">Published on: ${new Date(
                    this.params.publishedDate
                  ).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</p>
                  <p class="text-sm">Last modified: ${new Date(
                    this.params.modifiedDate
                  ).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</p>
                  <p class="text-sm">Tags: ${this.params.tags
                    .map((tag) => `<span class="text-blue-500">#${tag}</span>`)
                    .join(", ")}</p>
                  ${
                    this.params.preview
                      ? `<p class="preview mt-2">${this.params.content.substring(
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
    await setArticlesToShowBasedOnState();
    document.querySelector("#app").innerHTML =
      await new ArticleShowcase().getHtml();
  }

  async showArticleDetail(articleId) {
    state.setArticleIdDetailOpened(articleId);
    history.pushState(null, null, `/article-detail`);
    document.querySelector("#app").innerHTML = await new ArticleDetail({
      articleId: articleId,
    }).getHtml();
  }
}
