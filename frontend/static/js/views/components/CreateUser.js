import { escapeHtml, showAlert, validatePassword } from "../../utilities.js";
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
        <div class="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div class="max-w-md w-full space-y-8">
            <h1 class="text-2xl font-bold mb-4">Create User</h1>
            <div id="create-user" class="p-4 bg-white rounded shadow">
                <div class="mb-4">
                    <label for="username" class="block text-sm font-medium text-gray-700">Username:</label>
                    <input type="text" id="username" name="username" class="mt-1 p-2 block w-full border border-gray-300 rounded" required>
                </div>
                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
                    <input type="password" id="password" name="password" class="mt-1 p-2 block w-full border border-gray-300 rounded" required>
                </div>
                <div class="mb-4">
                    <label for="name" class="block text-sm font-medium text-gray-700">Name:</label>
                    <input type="text" id="name" name="name" class="mt-1 p-2 block w-full border border-gray-300 rounded" required>
                </div>
                <div class="mb-4 flex items-center">
                    <label for="is-admin" class="text-sm font-medium text-gray-700">Admin </label>
                    <input type="checkbox" id="is-admin" name="isAdmin" class="ml-2 mt-1">
                </div>
                <button onclick="app.createUser()" type="submit" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Create User</button>
            </div>
          </div>
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

      if (validatePassword(passwordInserted.value)) {
        try {
          await rest.createUser(user);
        } catch (error) {
          showAlert(error.message, "red", "create-user");
        }
        usernameInserted.value = "";
        passwordInserted.value = "";
        nameInserted.value = "";
        isAdminInserted.checked = false;
      } else {
        showAlert("Invalid Password", "red", "create-user", [
          "Password must be at least 8 characters long",
          "Password must contain at least one uppercase letter",
          "Password must contain at least one lowercase letter",
          "Password must contain at least one number",
          "Password must contain at least one special character",
        ]);
      }
    }
  }
}
