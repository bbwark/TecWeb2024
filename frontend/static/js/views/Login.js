import { state } from "../config.js";
import rest from "../rest.js";
import { escapeHtml, setArticlesToShowBasedOnState } from "../utilities.js";
import AbstractView from "./AbstractView.js";
import ArticleShowcase from "./ArticleShowcase.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Login");
    state.clearState();
    const app = document.querySelector("#app");
    if (!app.submitLogin) app.submitLogin = this.submitLogin;
  }

  async getHtml() {
    setTimeout(() => {
      this.afterRender();
    }, 0);
    return `
            <h1 class="text-2xl font-bold mb-4">Login</h1>
            <div id="login-form" class="p-4 bg-white rounded shadow">
              <div class="mb-4">
                  <label for="username" class="block text-sm font-medium text-gray-700">Username:</label>
                  <input type="text" id="username" name="username" class="mt-1 p-2 block w-full border border-gray-300 rounded" required>
              </div>
              <div class="mb-4">
                  <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
                  <input type="password" id="password" name="password" class="mt-1 p-2 block w-full border border-gray-300 rounded" required>
              </div>
              <button onclick="app.submitLogin()" id="login-button" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Login</button>
            </div>
        `;
  }

  async submitLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    escapeHtml(username);
    escapeHtml(password);

    if (username && password) {
      const loginResponse = await rest.login(username, password);
      if (loginResponse) {
        await setArticlesToShowBasedOnState();
        state.setArticleModifying(0);
        history.pushState(null, null, "/");
        document.querySelector("#app").innerHTML =
          await new ArticleShowcase().getHtml();
      } else {
        //TODO - if unsuccessful, display error message
      }
    }
  }

  afterRender() {
    const form = document.getElementById("login-form");
    form.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const app = document.querySelector("#app");
        app.submitLogin();
      }
    });
  }
}
