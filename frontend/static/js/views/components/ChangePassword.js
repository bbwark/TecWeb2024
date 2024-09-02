import { state } from "../../config.js";
import rest from "../../rest.js";
import { escapeHtml, validatePassword } from "../../utilities.js";
import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Change Password");

    const app = document.querySelector("#app");
    if (!app.changePassword) app.changePassword = this.changePassword;
  }

  async getHtml() {
    return `
        <div class="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div class="max-w-md w-full space-y-8">
            <h1 class="text-2xl font-bold mb-4">Change Password</h1>
            <div id="change-password" class="p-4 bg-white rounded shadow">
                <div class="mb-4">
                    <label for="old-password" class="block text-sm font-medium text-gray-700">Old Password:</label>
                    <input type="password" id="old-password" name="oldPassword" class="mt-1 p-2 block w-full border border-gray-300 rounded" required>
                </div>
                <div class="mb-4">
                    <label for="new-password" class="block text-sm font-medium text-gray-700">New Password:</label>
                    <input type="password" id="new-password" name="newPassword" class="mt-1 p-2 block w-full border border-gray-300 rounded" required>
                </div>
                <button onclick="app.changePassword()" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Change Password</button>
            </div>
          </div>
        </div>
        `;
  }

  async changePassword() {
    let oldPasswordInserted = document.getElementById("old-password");
    let newPasswordInserted = document.getElementById("new-password");
    if (oldPasswordInserted && newPasswordInserted) {
      escapeHtml(oldPasswordInserted.value);
      escapeHtml(newPasswordInserted.value);

      const isOldPasswordCorrect = await rest.checkPassword(
        oldPasswordInserted.value
      );
      
      if (
        isOldPasswordCorrect &&
        oldPasswordInserted !== newPasswordInserted &&
        validatePassword(newPasswordInserted.value)
      ) {
        await rest.updateUser(state.userId, {
          password: newPasswordInserted.value,
        });
        oldPasswordInserted.value = "";
        newPasswordInserted.value = "";
      }
    }
  }
}
