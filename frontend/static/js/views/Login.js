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
            <h1>Login</h1>
            <div id="login-form">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
                <button onclick="app.submitLogin()" id="login-button">Login</button>
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
        document.querySelector("#app").innerHTML = await new ArticleShowcase().getHtml();
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
