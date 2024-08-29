import { articleShowCaseState, state } from "../../config.js";
import rest from "../../rest.js";
import { setArticlesToShowBasedOnState } from "../../utilities.js";
import AbstractView from "../AbstractView.js";
import ArticleShowcase from "../ArticleShowcase.js";
import Login from "../Login.js";
import ModifyArticle from "../ModifyArticle.js";
import Settings from "../Settings.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);

    const app = document.querySelector("#app");

    if (!app.showArticles) app.showArticles = this.showArticles;
    if (!app.newArticle) app.newArticle = this.newArticle;
    if (!app.goToSettings) app.goToSettings = this.goToSettings;
    if (!app.goToLogin) app.goToLogin = this.goToLogin;
  }

  async getHtml() {
    const { isLogged } = this.params;
    const showcaseState = state.articleShowCaseState;
    return `
        <div id="header">
            ${
              isLogged
                ? `
                <button id="show-articles" onclick="app.showArticles()">${showcaseState === articleShowCaseState.ALL_ARTICLES ? "My Articles" : "Recent Articles"}</button>
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

  async showArticles() {
    state.setArticleShowcaseState(state.articleShowCaseState === articleShowCaseState.ALL_ARTICLES ? articleShowCaseState.USER_ARTICLES : articleShowCaseState.ALL_ARTICLES);
    state.setUserIdArticlesToShow(state.userId);
    state.setArticlesOpenedPage(1);
    await setArticlesToShowBasedOnState();
    history.pushState(null, null, "/");
    document.querySelector("#app").innerHTML = await new ArticleShowcase().getHtml();
  }

  async newArticle() {
    state.setArticleModifying(0);
    history.pushState(null, null, "/modify-article");
    document.querySelector("#app").innerHTML =
      await new ModifyArticle().getHtml();
  }

  async goToSettings() {
    history.pushState(null, null, "/settings");
    document.querySelector("#app").innerHTML = await new Settings().getHtml();
  }

  async goToLogin() {
    history.pushState(null, null, "/login");
    document.querySelector("#app").innerHTML = await new Login().getHtml();
  }
}
