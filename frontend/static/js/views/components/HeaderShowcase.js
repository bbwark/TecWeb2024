import { articleShowCaseState, state } from "../../config.js";
import rest from "../../rest.js";
import AbstractView from "../AbstractView.js";
import ArticleShowcase from "../ArticleShowcase.js";
import ModifyArticle from "../ModifyArticle.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);

    const app = document.querySelector("#app");

    if (!app.showMyArticles) app.showMyArticles = this.showMyArticles;
    if (!app.newArticle) app.newArticle = this.newArticle;
    if (!app.goToSettings) app.goToSettings = this.goToSettings;
    if (!app.goToLogin) app.goToLogin = this.goToLogin;
  }

  async getHtml() {
    const { isLogged } = this.params;
    return `
        <div id="header">
            ${
              isLogged
                ? `
                <button id="my-articles" onclick="app.showMyArticles()">My Articles</button>
                <button id="new-article" onclick="app.newArticle()">New Article</button>
                <button id="settings" onclick="app.goToSettings()">Settings</button>
                `
                : `
                <button id="login-button" onclick="app.goToLogin()">Login</button>
                `
            }
        </div>
    `;
  }

  async showMyArticles() {
    const articles = await rest.getArticlesByUserId(state.userId, state.openedPage);
    state.setArticlesToShow(articles);
    state.setArticleShowcaseState(articleShowCaseState.USER_ARTICLES);
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
