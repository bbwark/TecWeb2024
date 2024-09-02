import { state } from "../../config.js";
import rest from "../../rest.js";
import { escapeHtml } from "../../utilities.js";
import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Change Name");

    const app = document.querySelector("#app");
    if (!app.changeName) app.changeName = this.changeName;
  }

  async getHtml() {
    return `
        <div class="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div class="max-w-md w-full space-y-8">
            <h1 class="text-2xl font-bold mb-4">Change Name</h1>
            <div id="change-name" class="p-4 bg-white rounded shadow">
                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
                    <input type="password" id="password" name="password" class="mt-1 p-2 block w-full border border-gray-300 rounded" required>
                </div>
                <div class="mb-4">
                    <label for="new-name" class="block text-sm font-medium text-gray-700">New Name:</label>
                    <input type="text" id="new-name" name="newName" class="mt-1 p-2 block w-full border border-gray-300 rounded" required>
                </div>
                <button onclick="app.changeName()" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Change Name</button>
            </div>
          </div>
        </div>
        `;
  }

  async changeName() {
    let passwordInserted = document.getElementById("password");
    let newNameInserted = document.getElementById("new-name");
    if (passwordInserted && newNameInserted) {
      escapeHtml(passwordInserted.value);
      escapeHtml(newNameInserted.value);

      const isPasswordCorrect = await rest.checkPassword(
        passwordInserted.value
      );

      if (isPasswordCorrect) {
        await rest.updateUser(state.userId, { name: newNameInserted.value });
      }
      passwordInserted.value = "";
      newNameInserted.value = "";
    }
  }
}
