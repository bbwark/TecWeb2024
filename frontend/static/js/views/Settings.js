import AbstractView from "./AbstractView.js";
import { articleShowCaseState, state } from "../config.js";
import ChangePassword from "./components/ChangePassword.js";
import ChangeName from "./components/ChangeName.js";
import CreateUser from "./components/CreateUser.js";
import DeleteAccount from "./components/DeleteAccount.js";
import UserList from "./components/UserList.js";
import ArticleShowcase from "./ArticleShowcase.js";
import rest from "../rest.js";
import Login from "./Login.js";

export default class extends AbstractView {
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
    const app = document.querySelector("#app");
    if (!app.setSettingsContent)
      app.setSettingsContent = this.setSettingsContent;
    if (!app.logout) app.logout = this.logout;
  }

  async getHtml() {
    if (!state.isLogged) {
      state.clearState();
      history.pushState(null, null, "/login");
      return await new Login().getHtml();
    } else {

      setTimeout(() => {
        this.setSettingsContent(state.lastSettingsOpened);
      }, 0);

      return `
            <div class="min-h-screen flex bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div class="w-1/4 bg-white p-6 rounded-l-lg shadow-lg">
                    <h1 class="text-2xl font-extrabold text-left text-gray-900 mb-4">Settings</h1>
                    <nav class="settings-nav">
                        <ul class="space-y-4">
                            <li id="nav-change-password" onclick="app.setSettingsContent('${
                              this.components[0]
                            }')" class="cursor-pointer text-lg text-blue-600 hover:text-blue-800 focus:text-blue-800 focus:outline-none">Cambia Password</li>
                            <li id="nav-change-name" onclick="app.setSettingsContent('${
                              this.components[1]
                            }')" class="cursor-pointer text-lg text-blue-600 hover:text-blue-800 focus:text-blue-800 focus:outline-none">Cambia Nome</li>
                            ${
                              state.isAdmin
                                ? `<li id="nav-create-user" onclick="app.setSettingsContent('${this.components[2]}')" class="cursor-pointer text-lg text-blue-600 hover:text-blue-800 focus:text-blue-800 focus:outline-none">Crea Utente</li>`
                                : ""
                            }
                            <li id="nav-delete-account" onclick="app.setSettingsContent('${
                              this.components[3]
                            }')" class="cursor-pointer text-lg text-blue-600 hover:text-blue-800 focus:text-blue-800 focus:outline-none">Elimina Account</li>
                            ${
                              state.isAdmin
                                ? `<li id="nav-user-list" onclick="app.setSettingsContent('${this.components[4]}')" class="cursor-pointer text-lg text-blue-600 hover:text-blue-800 focus:text-blue-800 focus:outline-none">Visualizza Utenti</li>`
                                : ""
                            }
                            <li id="nav-logout" onclick="app.logout()" class="cursor-pointer text-lg text-red-500 hover:text-red-700 focus:text-red-700 focus:outline-none">Logout</li>
                        </ul>
                    </nav>
                </div>
                <div class="w-3/4 p-6 bg-white rounded-r-lg shadow-lg ml-4">
                    <div id="settings-content" class="bg-gray-50 p-6 rounded-md shadow-inner min-h-full"></div>
                </div>
            </div>
        `;
    }
  }

  async setSettingsContent(componentName) {
    let components = {
      changePassword: new ChangePassword(),
      changeName: new ChangeName(),
      createUser: new CreateUser(),
      deleteAccount: new DeleteAccount(),
      userList: new UserList(),
    };
    state.setLastSettingsOpened(componentName);
    document.querySelector("#settings-content").innerHTML = await components[
      componentName
    ].getHtml();
  }

  async logout() {
    state.clearState();
    history.pushState(null, null, "/");
    state.setArticleShowcaseState(articleShowCaseState.ALL_ARTICLES);
    state.setArticlesToShow(
      await rest.getRecentArticles(state.articlesOpenedPage)
    );
    document.querySelector("#app").innerHTML =
      await new ArticleShowcase().getHtml();
  }
}
