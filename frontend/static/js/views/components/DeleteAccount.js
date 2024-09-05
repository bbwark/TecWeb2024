import { state } from "../../config.js";
import { navigateTo } from "../../index.js";
import rest from "../../rest.js";
import {
  escapeHtml,
  setArticlesToShowBasedOnState,
  showAlert,
} from "../../utilities.js";
import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Delete Account");

    const app = document.querySelector("#app");
    if (!app.deleteAccount) app.deleteAccount = this.deleteAccount;
  }

  async getHtml() {
    return `
        <div class="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div class="max-w-md w-full space-y-8">
            <h1 class="text-2xl font-bold mb-4">Delete Account</h1>
            <div id="delete-account-form" class="p-4 bg-white rounded shadow">
                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
                    <input type="password" id="password" name="password" class="mt-1 p-2 block w-full border border-gray-300 rounded" required>
                </div>
                <button onclick="app.deleteAccount()" type="submit" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete Account</button>
            </div>
          </div>
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
        try {
          await rest.deleteUser(state.userId, passwordInserted.value);
        } catch (error) {
          showAlert(error.message, "red", "delete-account-form");
        }
        state.clearState();
        await setArticlesToShowBasedOnState();
        await navigateTo("/");
        showAlert("Account deleted successfully", "green", "header");
      } else {
        passwordInserted.value = "";
        showAlert("Invalid Password", "red", "delete-account-form");
      }
    }
  }
}
