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
        this.components = ["changePassword", "changeName", "createUser", "deleteAccount", "userList"];
        const app = document.querySelector("#app");
        if(!app.setSettingsContent) app.setSettingsContent = this.setSettingsContent;
        if(!app.logout) app.logout = this.logout;
    }

    async getHtml() {
        if(!state.isLogged) {
            state.clearState();
            history.pushState(null, null, "/login");
            document.querySelector("#app").innerHTML = await new Login().getHtml();
        } else {
            return `
                <div class="settings-container">
                    <nav class="settings-nav">
                        <ul>
                            <li id="nav-change-password" onclick="app.setSettingsContent('${this.components[0]}')">Cambia Password</li>
                            <li id="nav-change-name" onclick="app.setSettingsContent('${this.components[1]}')">Cambia Nome</li>
                            ${state.isAdmin ? `<li id="nav-create-user" onclick="app.setSettingsContent('${this.components[2]}')">Crea Utente</li>` : ''}
                            <li id="nav-delete-account" onclick="app.setSettingsContent('${this.components[3]}')">Elimina Account</li>
                            ${state.isAdmin ? `<li id="nav-user-list" onclick="app.setSettingsContent('${this.components[4]}')">Visualizza Utenti</li>` : ''}
                            <li id="nav-logout" onclick="app.logout()">Logout</li>
                        </ul>
                    </nav>
                    <div id="settings-content"></div>
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
            userList: new UserList()
        };
        document.querySelector("#settings-content").innerHTML = await components[componentName].getHtml();
    }

    async logout() {
        state.clearState();
        history.pushState(null, null, "/");
        state.setArticleShowcaseState(articleShowCaseState.ALL_ARTICLES);
        state.setArticlesToShow(await rest.getRecentArticles(state.openedPage));
        document.querySelector("#app").innerHTML = await new ArticleShowcase().getHtml();
    }
}
