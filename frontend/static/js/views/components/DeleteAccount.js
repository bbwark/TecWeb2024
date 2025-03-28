import { state } from "../../config.js";
import { navigateTo } from "../../index.js";
import rest from "../../rest.js";
import {
  setArticlesToShowBasedOnState,
  showAlert,
} from "../../utilities/utilities.js";
import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Delete Account");
    
    this.boundHandlers = {
      click: this.handleClick.bind(this)
    };
  }
  
  onMount() {
    const app = document.querySelector("#app");
    app.addEventListener('click', this.boundHandlers.click);
    console.log("DeleteAccount mounted: event listeners added");
  }
  
  onUnmount() {
    const app = document.querySelector("#app");
    app.removeEventListener('click', this.boundHandlers.click);
    console.log("DeleteAccount unmounted: event listeners removed");
  }
  
  handleClick(e) {
    if (!document.getElementById('delete-account-form')) return;
    
    const target = e.target.closest('[data-action]');
    if (!target) return;
    
    const action = target.dataset.action;
    
    switch(action) {
      case 'delete-account':
        this.deleteAccount();
        break;
    }
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
                <button 
                  data-action="delete-account" 
                  type="submit" 
                  class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    Delete Account
                </button>
            </div>
          </div>
        </div>
        `;
  }

  async deleteAccount() {
    let passwordInserted = document.getElementById("password");
    if (passwordInserted) {

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
