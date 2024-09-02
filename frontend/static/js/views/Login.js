import { state } from "../config.js";
import { navigateTo } from "../index.js";
import rest from "../rest.js";
import {
  escapeHtml,
  removeAlert,
  setArticlesToShowBasedOnState,
  showAlert,
} from "../utilities.js";
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
            <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
              <div class="max-w-md w-full space-y-8">
                <div>
                  <h1 class="text-3xl font-extrabold text-center text-gray-900">Login</h1>
                </div>
                <div id="login-form" class="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md">
                  <div>
                    <label for="username" class="block text-sm font-medium text-gray-700">Username:</label>
                    <input type="text" id="username" name="username" class="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required>
                  </div>
                  <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
                    <input type="password" id="password" name="password" class="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required>
                  </div>
                  <div>
                    <button onclick="app.submitLogin()" id="login-button" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
            `;
  }

  async submitLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    escapeHtml(username);
    escapeHtml(password);

    if (username && password) {
      try {
        const loginResponse = await rest.login(username, password);
        if (loginResponse) {
          await setArticlesToShowBasedOnState();
          state.setArticleModifying(0);
          await navigateTo("/");
          showAlert("Login successful", "green", "header");
          removeAlert("header", 3000);
        }
      } catch (error) {
        console.error(error);
        showAlert(error.message, "red", "login-form");
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
