import { articleShowCaseState, state } from "../../config.js";
import { navigateTo } from "../../index.js";
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
        <div id="header" class="p-4 bg-gray-100 flex justify-end space-x-2">
            ${
              isLogged
                ? `
                <button id="show-articles" onclick="app.showArticles()" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    ${
                      showcaseState === articleShowCaseState.ALL_ARTICLES
                        ? "My Articles"
                        : "Recent Articles"
                    }
                </button>
                <button id="new-article" onclick="app.newArticle()" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">New Article</button>
                <button id="settings" onclick="app.goToSettings()" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Settings</button>
            `
                : `
                <button id="login-button" onclick="app.goToLogin()" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Login</button>
            `
            }
        </div>
    `;
  }

  async showArticles() {
    state.setArticleShowcaseState(
      state.articleShowCaseState === articleShowCaseState.ALL_ARTICLES
        ? articleShowCaseState.USER_ARTICLES
        : articleShowCaseState.ALL_ARTICLES
    );
    state.setUserIdArticlesToShow(state.userId);
    state.setArticlesOpenedPage(1);
    await navigateTo("/");
  }

  async newArticle() {
    state.setArticleModifying(0);
    await navigateTo("/modify-article");
  }

  async goToSettings() {
    await navigateTo("/settings");
  }

  async goToLogin() {
    await navigateTo("/login");
  }
}
