import { state } from "../../config.js";
import AbstractView from "../AbstractView.js";
import Article from "./Article.js";
import HeaderShowcase from "./HeaderShowcase.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    const app = document.querySelector("#app");
    if (!app.goToSettings || !app.goToLogin) {
      const instance = new HeaderShowcase();
      app.goToSettings = instance.goToSettings;
      app.goToLogin = instance.goToLogin;
    }
    if (!app.articleEditButton || !app.articleDeleteButton) {
      const instance = new Article();
      app.articleEditButton = instance.articleEditButton;
      app.articleDeleteButton = instance.articleDeleteButton;
    }
  }

  async getHtml() {
    const isOwner = this.params.isOwner;
    return `
        <div id="header">
            ${
              state.isLogged
                ? `
                ${
                  isOwner || state.isAdmin
                    ? `
                <button onclick="app.articleDeleteButton(${state.articleIdDetailOpened})" id="delete">Delete</button>
                <button onclick="app.articleEditButton(${state.articleIdDetailOpened})" id="modify">Modify</button>`
                    : ""
                }
                <button onclick="app.goToSettings()" id="settings">Settings</button>
                `
                : `
                <button onclick="app.goToLogin()" id="login-button">Login</button>
                `
            }
        </div>
    `;
  }
}
