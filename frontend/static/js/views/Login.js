import AbstractView from "./AbstractView.js";
import { state } from "../config.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Login");
    }

    async getHtml() {
        return `
            <h1>Login</h1>
            <div id="login-form">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
                <button id="login-button">Login</button>
            </div>
        `;
    }

    async handleLogin() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Validazione di base
        if (!username || !password) {
            alert("Please fill in both fields.");
            return;
        }

        try {
            // Esempio di chiamata fetch - sostituire con l'endpoint reale
            const response = await fetch("TOADD", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Gestione del login avvenuto con successo
                // TODO: Gestire il salvataggio dello stato dell'utente e della sessione
                state.setUser(data.user);
                alert("Login successful!");
                // Reindirizzamento alla pagina principale
                window.location.href = "/";
            } else {
                // Gestione degli errori di login
                alert(data.message || "Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred. Please try again.");
        }
    }

    addEventListeners() {
        document.getElementById("login-button").addEventListener("click", (event) => {
            event.preventDefault();
            this.handleLogin();
        });
    }
}
