import { escapeHtml } from "../utilities.js";
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Login");

        const app = document.querySelector("#app");
        if (!app.submitLogin) app.submitLogin = this.submitLogin;
    }

    async getHtml() {
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

            //TODO - send login request
            //TODO - if successful, redirect to home page
            // state.isLogged = true;
            // state.userId = XXXX;
            // state.isAdmin = XXXX;
            // history.pushState(null, null, "/");
            // document.querySelector("#app").innerHTML = await new ArticleShowcase().getHtml();
            //TODO - if unsuccessful, display error message
        }
    }
}
