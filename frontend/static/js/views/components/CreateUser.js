import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Create User");
    }

    async getHtml() {
        return `
            <h1>Create User</h1>
            <form id="create-user-form">
                <div>
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div>
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div>
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div>
                    <label for="is-admin">Is Admin:</label>
                    <input type="checkbox" id="is-admin" name="isAdmin">
                </div>
                <button type="submit">Create User</button>
            </form>
        `;
    }

    async afterRender() {
        document.getElementById("create-user-form").addEventListener("submit", async (event) => {
            event.preventDefault();
            const username = event.target.username.value;
            const password = event.target.password.value;
            const name = event.target.name.value;
            const isAdmin = event.target.isAdmin.checked;

            // Simulazione di una chiamata per creare un utente
            try {
                // Esegui la logica per creare un utente qui
                alert("User created successfully!");
            } catch (error) {
                console.error("Failed to create user:", error);
                alert("Failed to create user");
            }
        });
    }
}
