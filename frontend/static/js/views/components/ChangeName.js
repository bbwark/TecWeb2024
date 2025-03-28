import { state } from "../../config.js";
import rest from "../../rest.js";
import AbstractView from "../AbstractView.js";
import { sanitizeHtml, showAlert } from "../../utilities/utilities.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Change Name");
    
    this.boundHandlers = {
      click: this.handleClick.bind(this)
    };
  }
  
  onMount() {
    const app = document.querySelector("#app");
    app.addEventListener('click', this.boundHandlers.click);
    console.log("ChangeName mounted: event listeners added");
  }
  
  onUnmount() {
    const app = document.querySelector("#app");
    app.removeEventListener('click', this.boundHandlers.click);
    console.log("ChangeName unmounted: event listeners removed");
  }

  handleClick(e) {
    if (!document.getElementById('change-name')) return;
    
    const target = e.target.closest('[data-action]');
    if (!target) return;
    
    const action = target.dataset.action;
    
    switch(action) {
      case 'change-name':
        this.changeName();
        break;
    }
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
                <button 
                  data-action="change-name" 
                  class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Change Name
                </button>
            </div>
          </div>
        </div>
        `;
  }

  async changeName() {
    let passwordInserted = document.getElementById("password");
    let newNameInserted = document.getElementById("new-name");
    if (passwordInserted && newNameInserted) {

      const isPasswordCorrect = await rest.checkPassword(
        passwordInserted.value
      );

      if (isPasswordCorrect) {
        try {
          await rest.updateUser(state.userId, { name: sanitizeHtml(newNameInserted.value) });
          showAlert("Name changed successfully", "green", "change-name");
        } catch (error) {
          showAlert(error.message, "red", "change-name");
        }
        passwordInserted.value = "";
        newNameInserted.value = "";
      } else {
        passwordInserted.value = "";
        showAlert("Invalid Password", "red", "change-name");
      }
    }
  }
}
