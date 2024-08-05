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
    if (!app.articleCancelButton) app.articleCancelButton = this.articleCancelButton;
  }

  async getHtml() {
    if (!state.isLogged) {
      state.clearState();
      history.pushState(null, null, "/login");
      document.querySelector("#app").innerHTML = await new Login().getHtml();
    } else {
      let article = new ArticleDTO();
      if (this.articleId !== 0) {
        article = await rest.getArticleById(this.articleId);
      }

      return `
            <h1>${this.isNew ? "Create New Article" : "Edit Article"}</h1>
            <div id="article-form">
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
                
                <button id="cancel-button" onclick="app.articleCancelButton()">Cancel</button>
                <button id="save-button" onclick="app.articleSaveButton(
                ${this.isNew}, 
                ${this.articleId})">
                ${this.isNew ? "Save" : "Update"}</button>
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
      const article = {
        title: title,
        content: content,
        userId: state.userId,
        tags: tags,
      };
      if (isNew) {
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
