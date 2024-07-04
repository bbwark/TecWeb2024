import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Delete Account");
    }

    async getHtml() {
        return `
            <h1>Delete Account</h1>
            <form id="delete-account-form">
                <div>
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit">Delete Account</button>
            </form>
        `;
    }

    async afterRender() {
        document.getElementById("delete-account-form").addEventListener("submit", async (event) => {
            event.preventDefault();
            const password = event.target.password.value;

            // Simulazione di una chiamata per eliminare l'account
            try {
                // Esegui la logica per eliminare l'account qui
                alert("Account deleted successfully!");
            } catch (error) {
                console.error("Failed to delete account:", error);
                alert("Failed to delete account");
            }
        });
    }
}
