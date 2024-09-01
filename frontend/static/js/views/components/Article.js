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
    <div class="article p-6 bg-white rounded-lg shadow-md mb-6 min-h-[200px] flex flex-col">
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1 pr-4">
          <h2 class="text-2xl font-bold cursor-pointer text-blue-600 hover:underline mb-2"
              onclick="app.showArticleDetail(${this.params.articleId})">
            ${this.params.title}
          </h2>
          <p class="text-sm text-gray-600 mb-2">
            By <span class="font-medium">${
              !authorName ? "Account Deleted" : authorName
            }</span>
          </p>
          <div class="flex flex-wrap gap-2 mb-3">
            ${this.params.tags
              .map(
                (tag) => `
              <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">#${tag}</span>
            `
              )
              .join("")}
          </div>
        </div>
        <div class="text-right flex flex-col items-end">
          ${
            this.params.showEditDeleteButtons
              ? `
            <div class="flex space-x-2 mb-2">
              <button id="edit-button" class="edit-button text-blue-500 hover:text-blue-700 p-1" onclick="app.articleEditButton(${this.params.articleId})">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button id="delete-button" class="delete-button text-red-500 hover:text-red-700 p-1" onclick="app.articleDeleteButton(${this.params.articleId})">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>`
              : ""
          }
          <p class="text-sm text-gray-500">Published on: ${new Date(
            this.params.publishedDate
          ).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</p>
          ${
            this.params.publishedDate !== this.params.modifiedDate
              ? `<p class="text-xs text-gray-400 mt-1">Last modified: ${new Date(
                  this.params.modifiedDate
                ).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</p>`
              : ""
          }
        </div>
      </div>
      ${
        this.params.preview
          ? `<p class="preview text-gray-700 flex-grow">
            ${
              this.params.content.length > 50
                ? this.params.content.substring(0, 50) + "..."
                : this.params.content
            }
          </p>`
          : ""
      }
      <div class="mt-4 text-right">
        <button class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                onclick="app.showArticleDetail(${this.params.articleId})">
          Read more →
        </button>
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
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}
