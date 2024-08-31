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
        <div id="header" class="p-4 bg-gray-100 flex justify-end space-x-2">
            ${
              state.isLogged
                ? `
                ${
                  isOwner || state.isAdmin
                    ? `
                    <button onclick="app.articleDeleteButton(${state.articleIdDetailOpened})" id="delete" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                    <button onclick="app.articleEditButton(${state.articleIdDetailOpened})" id="modify" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Modify</button>
                `
                    : ""
                }
                <button onclick="app.goToSettings()" id="settings" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Settings</button>
            `
                : `
                <button onclick="app.goToLogin()" id="login-button" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Login</button>
            `
            }
        </div>
    `;
  }
}
