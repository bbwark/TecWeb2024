import { escapeHtml } from "../../utilities.js";
import rest from "../../rest.js";
import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Create User");

    const app = document.querySelector("#app");
    if (!app.createUser) app.createUser = this.createUser;
  }

  async getHtml() {
    return `
            <h1>Create User</h1>
            <div id="create-user">
                <div>
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div>
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div>
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div>
                    <label for="is-admin">Is Admin:</label>
                    <input type="checkbox" id="is-admin" name="isAdmin">
                </div>
                <button onclick="app.createUser()" type="submit">Create User</button>
            </div>
        `;
  }
  async createUser() {
    let usernameInserted = document.getElementById("username");
    let passwordInserted = document.getElementById("password");
    let nameInserted = document.getElementById("name");
    let isAdminInserted = document.getElementById("is-admin");

    if (
      usernameInserted &&
      passwordInserted &&
      nameInserted &&
      isAdminInserted
    ) {
      escapeHtml(usernameInserted.value);
      escapeHtml(passwordInserted.value);
      escapeHtml(nameInserted.value);

      let user = {
        username: usernameInserted.value,
        password: passwordInserted.value,
        name: nameInserted.value,
        isAdmin: isAdminInserted.checked,
      };

      await rest.createUser(user);
      usernameInserted.value = "";
      passwordInserted.value = "";
      nameInserted.value = "";
      isAdminInserted.checked = false;
    }
  }
}
