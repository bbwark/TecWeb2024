import { state } from "../config.js";
import { navigateTo } from "../index.js";
import rest from "../rest.js";
import {
  removeAlert,
  setArticlesToShowBasedOnState,
  showAlert,
} from "../utilities/utilities.js";
import AbstractView from "./AbstractView.js";

export default class Login extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Login");
    state.clearState();
    
    this.boundHandlers = {
      click: this.handleClick.bind(this),
      keypress: this.handleKeypress.bind(this)
    };
  }

  onMount() {
    const app = document.querySelector("#app");
    app.addEventListener('click', this.boundHandlers.click);
    app.addEventListener('keypress', this.boundHandlers.keypress);
    console.log("Login mounted: event listeners added");
  }
  
  onUnmount() {
    const app = document.querySelector("#app");
    app.removeEventListener('click', this.boundHandlers.click);
    app.removeEventListener('keypress', this.boundHandlers.keypress);
    console.log("Login unmounted: event listeners removed");
  }

  async getHtml() {
    return `
            <div id="login-view" class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
              <div class="max-w-md w-full space-y-8">
                <div>
                  <h1 class="text-3xl font-extrabold text-center text-gray-900">Login</h1>
                </div>
                <div id="login-form" class="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md">
                  <div>
                    <label for="username" class="block text-sm font-medium text-gray-700">Username:</label>
                    <input type="text" id="username" name="username" class="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required>
                  </div>
                  <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
                    <input type="password" id="password" name="password" class="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required>
                  </div>
                  <div>
                    <button 
                      id="login-button" 
                      data-action="submit-login"
                      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
            `;
  }

  handleClick(e) {
    if (!document.getElementById('login-view')) return;
    
    const target = e.target.closest('[data-action]');
    if (!target) return;
    
    const action = target.dataset.action;
    
    if (action === 'submit-login') {
      this.submitLogin();
    }
  }
  
  handleKeypress(e) {
    if (!document.getElementById('login-view')) return;
    
    if (e.key === "Enter" && 
        (e.target.id === "username" || e.target.id === "password")) {
      this.submitLogin();
    }
  }

  async submitLogin() {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
  
    usernameInput.value = "";
    passwordInput.value = "";
  
    if (username && password) {
      try {
        const loginResponse = await rest.login(username, password);
        
        if (loginResponse) {
          await setArticlesToShowBasedOnState();
          state.setArticleModifying(0);
          await navigateTo("/");
          
          showAlert("Login successful", "green", "header-showcase", [], {
            position: 'below',
            width: 'custom',
            maxWidth: 'max-w-4xl',
            customClass: 'mx-auto mt-2 mb-4',
            useContainer: true,
            containerId: 'login-alerts-container'
          });

          removeAlert("header-showcase", 1200, {
            useContainer: true,
            containerId: 'login-alerts-container'
          });
        }
      } catch (error) {
        console.error(error);
        showAlert(error.message, "red", "login-form");
      }
    }
  }
}
