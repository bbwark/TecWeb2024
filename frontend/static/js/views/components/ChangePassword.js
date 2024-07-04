import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Change Password");
    }

    async getHtml() {
        return `
            <h1>Change Password</h1>
            <form id="change-password-form">
                <div>
                    <label for="old-password">Old Password:</label>
                    <input type="password" id="old-password" name="oldPassword" required>
                </div>
                <div>
                    <label for="new-password">New Password:</label>
                    <input type="password" id="new-password" name="newPassword" required>
                </div>
                <button type="submit">Change Password</button>
            </form>
        `;
    }

    async afterRender() {
        document.getElementById("change-password-form").addEventListener("submit", async (event) => {
            event.preventDefault();
            const oldPassword = event.target.oldPassword.value;
            const newPassword = event.target.newPassword.value;

            // Simulazione di una chiamata per cambiare la password
            try {
                // Esegui la logica per cambiare la password qui
                alert("Password changed successfully!");
            } catch (error) {
                console.error("Failed to change password:", error);
                alert("Failed to change password");
            }
        });
    }
}
