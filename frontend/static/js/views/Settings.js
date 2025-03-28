import AbstractView from "./AbstractView.js";
import { articleShowCaseState, state } from "../config.js";
import ChangePassword from "./components/ChangePassword.js";
import ChangeName from "./components/ChangeName.js";
import CreateUser from "./components/CreateUser.js";
import DeleteAccount from "./components/DeleteAccount.js";
import UserList from "./components/UserList.js";
import rest from "../rest.js";
import Login from "./Login.js";
import { navigateTo } from "../index.js";

export default class Settings extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Settings");
    this.components = [
      "changePassword",
      "changeName",
      "createUser",
      "deleteAccount",
      "userList",
    ];
    
    this.boundHandlers = {
      click: this.handleClick.bind(this)
    };
    
    this.currentComponent = null;
  }

  onMount() {
    const app = document.querySelector("#app");
    app.addEventListener('click', this.boundHandlers.click);
    
    setTimeout(() => {
      this.setSettingsContent(state.lastSettingsOpened);
    }, 0);
    
    console.log("Settings mounted: event listeners added");
  }
  
  onUnmount() {
    const app = document.querySelector("#app");
    app.removeEventListener('click', this.boundHandlers.click);
    
    if (this.currentComponent && typeof this.currentComponent.onUnmount === 'function') {
      this.currentComponent.onUnmount();
    }
    
    console.log("Settings unmounted: event listeners removed");
  }

  async getHtml() {
    if (!state.isLogged) {
      state.clearState();
      history.pushState(null, null, "/login");
      return await new Login().getHtml();
    } else {
      return `
            <div id="settings-view" class="min-h-screen flex flex-col sm:flex-row bg-gray-50 py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
                <div class="w-full sm:w-1/4 bg-white p-6 rounded-t-lg sm:rounded-t-none sm:rounded-tl-lg sm:rounded-bl-lg shadow-lg mb-4 sm:mb-0">
                    <h1 class="text-2xl font-extrabold text-left text-gray-900 mb-4">Settings</h1>
                    <nav class="settings-nav">
                        <ul class="flex flex-wrap sm:flex-col sm:space-y-4 gap-3 sm:gap-0">
                            <li id="nav-change-password" data-action="set-content" data-component="${this.components[0]}" 
                                class="cursor-pointer text-lg text-blue-600 hover:text-blue-800 focus:text-blue-800 focus:outline-none">
                                Change Password
                            </li>
                            <li id="nav-change-name" data-action="set-content" data-component="${this.components[1]}" 
                                class="cursor-pointer text-lg text-blue-600 hover:text-blue-800 focus:text-blue-800 focus:outline-none">
                                Change Name
                            </li>
                            ${
                              state.isAdmin
                                ? `<li id="nav-create-user" data-action="set-content" data-component="${this.components[2]}" 
                                   class="cursor-pointer text-lg text-blue-600 hover:text-blue-800 focus:text-blue-800 focus:outline-none">
                                   Create User
                                   </li>`
                                : ""
                            }
                            <li id="nav-delete-account" data-action="set-content" data-component="${this.components[3]}" 
                                class="cursor-pointer text-lg text-blue-600 hover:text-blue-800 focus:text-blue-800 focus:outline-none">
                                Delete Account
                            </li>
                            ${
                              state.isAdmin
                                ? `<li id="nav-user-list" data-action="set-content" data-component="${this.components[4]}" 
                                   class="cursor-pointer text-lg text-blue-600 hover:text-blue-800 focus:text-blue-800 focus:outline-none">
                                   View Users
                                   </li>`
                                : ""
                            }
                            <li id="nav-logout" data-action="logout" 
                                class="cursor-pointer text-lg text-red-500 hover:text-red-700 focus:text-red-700 focus:outline-none">
                                Logout
                            </li>
                        </ul>
                    </nav>
                </div>
                <div class="w-full sm:w-3/4 p-6 bg-white rounded-b-lg sm:rounded-b-none sm:rounded-r-lg shadow-lg sm:ml-4 overflow-hidden">
                    <div id="settings-content" class="bg-gray-50 p-4 sm:p-6 rounded-md shadow-inner min-h-full max-w-full"></div>
                </div>
            </div>
        `;
    }
  }

  handleClick(e) {
    if (!document.getElementById('settings-view')) return;
    
    const target = e.target.closest('[data-action]');
    if (!target) return;
    
    const action = target.dataset.action;
    
    switch(action) {
      case 'set-content':
        this.setSettingsContent(target.dataset.component);
        break;
      case 'logout':
        this.logout();
        break;
    }
  }

  async setSettingsContent(componentName) {
    if (this.currentComponent && typeof this.currentComponent.onUnmount === 'function') {
      this.currentComponent.onUnmount();
      console.log(`Component ${state.lastSettingsOpened} unmounted`);
    }
    
    let components = {
      changePassword: new ChangePassword(),
      changeName: new ChangeName(),
      createUser: new CreateUser(),
      deleteAccount: new DeleteAccount(),
      userList: new UserList(),
    };
    
    state.setLastSettingsOpened(componentName);
    this.currentComponent = components[componentName];
    
    const contentContainer = document.querySelector("#settings-content");
    if (contentContainer) {
      contentContainer.innerHTML = await this.currentComponent.getHtml();
      
      if (typeof this.currentComponent.onMount === 'function') {
        this.currentComponent.onMount();
        console.log(`Component ${componentName} mounted`);
      }
    }
  }

  async logout() {
    if (this.currentComponent && typeof this.currentComponent.onUnmount === 'function') {
      this.currentComponent.onUnmount();
      console.log(`Component ${state.lastSettingsOpened} unmounted`);
    }
    
    state.clearState();
    state.setArticleShowcaseState(articleShowCaseState.ALL_ARTICLES);
    state.setArticlesToShow(
      await rest.getRecentArticles(state.articlesOpenedPage)
    );
    await navigateTo("/");
  }
}
