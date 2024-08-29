import { state } from "../../config.js";
import rest from "../../rest.js";
import { escapeHtml, setArticlesToShowBasedOnState } from "../../utilities.js";
import AbstractView from "../AbstractView.js";
import ArticleShowcase from "../ArticleShowcase.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Delete Account");

    const app = document.querySelector("#app");
    if (!app.deleteAccount) app.deleteAccount = this.deleteAccount;
  }

  async getHtml() {
    return `
            <h1>Delete Account</h1>
            <div id="delete-account-form">
                <div>
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button onclick="app.deleteAccount()" type="submit">Delete Account</button>
            </div>
        `;
  }

  async deleteAccount() {
    let passwordInserted = document.getElementById("password");
    if (passwordInserted) {
      escapeHtml(passwordInserted.value);

      const isPasswordCorrect = await rest.checkPassword(
        passwordInserted.value
      );
      if (isPasswordCorrect) {
        await rest.deleteUser(state.userId, passwordInserted.value);
        state.clearState();
        await setArticlesToShowBasedOnState();
        history.pushState(null, null, "/");
        document.querySelector("#app").innerHTML = await new ArticleShowcase().getHtml();
      } else {
        passwordInserted.value = "";
      }
    }
  }
}
