import { state } from "../config.js";
import ArticleDTO from "../models/articleDTO.js";
import rest from "../rest.js";
import AbstractView from "./AbstractView.js";
import ArticleShowcase from "./ArticleShowcase.js";
import { escapeHtml, setArticlesToShowBasedOnState } from "../utilities.js";
import Login from "./Login.js";

export default class ModifyArticle extends AbstractView {
  constructor(params) {
    super(params);
    state.loadState();
    this.articleId = state.articleModifying;
    this.isNew = state.articleModifying === 0 ? true : false;
    this.setTitle(this.isNew ? "New Article" : "Edit Article");

    const app = document.querySelector("#app");
    if (!app.articleSaveButton) app.articleSaveButton = this.articleSaveButton;
    if (!app.articleCancelButton)
      app.articleCancelButton = this.articleCancelButton;
  }

  async getHtml() {
    if (!state.isLogged) {
      state.clearState();
      history.pushState(null, null, "/login");
      return await new Login().getHtml();
    } else {
      let article = new ArticleDTO();
      if (this.articleId !== 0) {
        article = await rest.getArticleById(this.articleId);
      }

      return `
            <h1 class="text-2xl font-bold mb-4">${
              this.isNew ? "Create New Article" : "Edit Article"
            }</h1>
            <div id="article-form" class="p-4 bg-white rounded shadow">
                <div class="mb-4">
                    <label for="title" class="block text-sm font-medium text-gray-700">Title:</label>
                    <input type="text" id="title" name="title" value="${
                      article.title
                    }" class="mt-1 p-2 block w-full border border-gray-300 rounded" required>
                </div>
                
                <div class="mb-4">
                    <label for="content" class="block text-sm font-medium text-gray-700">Content:</label>
                    <textarea id="content" name="content" class="mt-1 p-2 block w-full border border-gray-300 rounded" required>${
                      article.content
                    }</textarea>
                </div>
                
                <div class="mb-4 flex items-center">
                    <input type="checkbox" id="preview-checkbox" class="mr-2">
                    <label for="preview-checkbox" class="text-sm font-medium text-gray-700">Show Preview</label>
                </div>
                <div id="preview" class="p-4 bg-gray-100 rounded" style="display:none;"></div>
                
                <div class="mb-4">
                    <label for="tags" class="block text-sm font-medium text-gray-700">Tags:</label>
                    <input type="text" id="tags" name="tags" value="${article.tags
                      .map((tag) => `#${tag}`)
                      .join(
                        ", "
                      )}" class="mt-1 p-2 block w-full border border-gray-300 rounded" required>
                </div>
                
                <div class="flex justify-between">
                    <button id="cancel-button" onclick="app.articleCancelButton()" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cancel</button>
                    <button id="save-button" onclick="app.articleSaveButton(${
                      this.isNew
                    }, ${
        this.articleId
      })" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        ${this.isNew ? "Save" : "Update"}
                    </button>
                </div>
            </div>
        `;
    }
  }

  async articleSaveButton(isNew, articleId = 0) {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const tags = document.getElementById("tags").value;

    escapeHtml(title);
    escapeHtml(content);
    escapeHtml(tags);

    if (title && content && tags) {
      const tagRegex = /#?[a-zA-Z0-9]+/g;
      const matches = tags.match(tagRegex);
      const transformedTags = matches
        .map((tag) => (tag.startsWith("#") ? tag.slice(1) : tag))
        .filter((tag, index, self) => self.indexOf(tag) === index);

      const article = {
        title: title,
        content: content,
        tags: transformedTags,
      };
      if (isNew) {
        article.userId = state.userId;
        await rest.createArticle(article);
      } else {
        await rest.updateArticle(articleId, article);
      }
    }

    await setArticlesToShowBasedOnState();
    state.setArticleModifying(0);
    history.pushState(null, null, "/");
    document.querySelector("#app").innerHTML =
      await new ArticleShowcase().getHtml();
  }

  async articleCancelButton() {
    history.back();
    document.querySelector("#app").innerHTML =
      await new ArticleShowcase().getHtml();
  }
}
