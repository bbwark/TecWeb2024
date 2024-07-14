import AbstractView from "./AbstractView.js";
import { state } from "../config.js";
import ChangePassword from "./components/ChangePassword.js";
import ChangeName from "./components/ChangeName.js";
import CreateUser from "./components/CreateUser.js";
import DeleteAccount from "./components/DeleteAccount.js";
import UserList from "./components/UserList.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Settings");
        this.components = {
            changePassword: new ChangePassword(),
            changeName: new ChangeName(),
            createUser: new CreateUser(),
            deleteAccount: new DeleteAccount(),
            userList: new UserList()
        };
    }

    async getHtml() {
        return `
            <div class="settings-container">
                <nav class="settings-nav">
                    <ul>
                        <li id="nav-change-password">Cambia Password</li>
                        <li id="nav-change-name">Cambia Nome</li>
                        ${state.isAdmin ? '<li id="nav-create-user">Crea Utente</li>' : ''}
                        <li id="nav-delete-account">Elimina Account</li>
                        ${state.isAdmin ? '<li id="nav-user-list">Visualizza Utenti</li>' : ''}
                        <li id="nav-logout">Logout</li>
                    </ul>
                </nav>
                <div class="settings-content" id="settings-content">
                    <h1>Benvenuto nelle impostazioni</h1>
                </div>
            </div>
        `;
    }

    async afterRender() {
        document.getElementById('nav-change-password').addEventListener('click', () => this.loadComponent('changePassword'));
        document.getElementById('nav-change-name').addEventListener('click', () => this.loadComponent('changeName'));
        if (state.isAdmin) {
            document.getElementById('nav-create-user').addEventListener('click', () => this.loadComponent('createUser'));
            document.getElementById('nav-user-list').addEventListener('click', () => this.loadComponent('userList'));
        }
        document.getElementById('nav-delete-account').addEventListener('click', () => this.loadComponent('deleteAccount'));
        document.getElementById('nav-logout').addEventListener('click', () => this.logout());
    }

    async loadComponent(componentName) {
        const component = this.components[componentName];
        document.getElementById('settings-content').innerHTML = await component.getHtml();
        await component.afterRender();
    }

    logout() {
        state.clearState();
        alert("Logged out successfully");
        window.location.href = "/login";
    }
}
