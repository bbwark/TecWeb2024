import { state } from "../../config.js";
import rest from "../../rest.js";
import AbstractView from "../AbstractView.js";
import ArticleShowcase from "../ArticleShowcase.js";
import ModifyArticle from "../ModifyArticle.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);

    if (!window.showMyArticles) window.showMyArticles = this.showMyArticles;
    if (!window.newArticle) window.newArticle = this.newArticle;
    if (!window.goToSettings) window.goToSettings = this.goToSettings;
    if (!window.goToLogin) window.goToLogin = this.goToLogin;
  }

  async getHtml() {
    const { isLogged } = this.params;
    return `
        <div id="header">
            ${
              isLogged
                ? `
                <button id="my-articles" onclick="window.showMyArticles()">My Articles</button>
                <button id="new-article" onclick="window.newArticle()">New Article</button>
                <button id="settings" onclick="window.goToSettings()">Settings</button>
                `
                : `
                <button id="login-button" onclick="window.goToLogin()">Login</button>
                `
            }
        </div>
    `;
  }

  async showMyArticles() {
    const articles = rest.getArticlesByUserId(state.userId, state.openedPage);
    state.setArticlesToShow(articles);
    history.pushState(null, null, "/");
    document.querySelector("#app").innerHTML = await new ArticleShowcase().getHtml();
  }

  async newArticle() {
    state.setArticleModifying(0);
    history.pushState(null, null, "/modify-article");
    document.querySelector("#app").innerHTML =
      await new ModifyArticle().getHtml();
  }

  async goToSettings() {}

  async goToLogin() {}
}
