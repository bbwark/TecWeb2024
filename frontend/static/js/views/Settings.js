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
      return `
                <div class="settings-container p-4 bg-white rounded shadow">
                    <nav class="settings-nav mb-4">
                        <ul class="flex space-x-4">
                            <li id="nav-change-password" onclick="app.setSettingsContent('${
                              this.components[0]
                            }')" class="cursor-pointer text-blue-500 hover:text-blue-700">Cambia Password</li>
                            <li id="nav-change-name" onclick="app.setSettingsContent('${
                              this.components[1]
                            }')" class="cursor-pointer text-blue-500 hover:text-blue-700">Cambia Nome</li>
                            ${
                              state.isAdmin
                                ? `<li id="nav-create-user" onclick="app.setSettingsContent('${this.components[2]}')" class="cursor-pointer text-blue-500 hover:text-blue-700">Crea Utente</li>`
                                : ""
                            }
                            <li id="nav-delete-account" onclick="app.setSettingsContent('${
                              this.components[3]
                            }')" class="cursor-pointer text-blue-500 hover:text-blue-700">Elimina Account</li>
                            ${
                              state.isAdmin
                                ? `<li id="nav-user-list" onclick="app.setSettingsContent('${this.components[4]}')" class="cursor-pointer text-blue-500 hover:text-blue-700">Visualizza Utenti</li>`
                                : ""
                            }
                            <li id="nav-logout" onclick="app.logout()" class="cursor-pointer text-red-500 hover:text-red-700">Logout</li>
                        </ul>
                    </nav>
                    <div id="settings-content" class="p-4 bg-gray-100 rounded"></div>
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
