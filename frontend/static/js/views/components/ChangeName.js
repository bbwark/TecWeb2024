import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Change Name");
    }

    async getHtml() {
        return `
            <h1>Change Name</h1>
            <form id="change-name-form">
                <div>
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div>
                    <label for="new-name">New Name:</label>
                    <input type="text" id="new-name" name="newName" required>
                </div>
                <button type="submit">Change Name</button>
            </form>
        `;
    }

    async afterRender() {
        document.getElementById("change-name-form").addEventListener("submit", async (event) => {
            event.preventDefault();
            const password = event.target.password.value;
            const newName = event.target.newName.value;

            // Simulazione di una chiamata per cambiare il nome
            try {
                // Esegui la logica per cambiare il nome qui
                alert("Name changed successfully!");
            } catch (error) {
                console.error("Failed to change name:", error);
                alert("Failed to change name");
            }
        });
    }
}
