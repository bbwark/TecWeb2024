// /src/views/UserList.js
import AbstractView from "../AbstractView.js";
import UserDTO from "../../models/userDTO.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("User List");
    }

    async getHtml() {
        return `
            <h1>User List</h1>
            <table id="user-list-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Name</th>
                        <th>Is Admin</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="user-list-tbody">
                    <!-- Users will be loaded here -->
                </tbody>
            </table>
        `;
    }

    async afterRender() {
        this.loadUsers();
    }

    async loadUsers() {
        // Simulazione di una chiamata per ottenere gli utenti
        const users = [
            new UserDTO(1, "john_doe", "John Doe", false),
            new UserDTO(2, "admin_user", "Admin User", true)
        ];

        const tbody = document.getElementById("user-list-tbody");
        tbody.innerHTML = "";

        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.name}</td>
                <td>${user.isAdmin ? "Yes" : "No"}</td>
                <td>
                    <button class="delete-user" data-id="${user.id}">Delete</button>
                    ${!user.isAdmin ? `<button class="make-admin" data-id="${user.id}">Make Admin</button>` : ''}
                </td>
            `;
            tbody.appendChild(row);
        });

        document.querySelectorAll(".delete-user").forEach(button => {
            button.addEventListener("click", (event) => {
                const userId = event.target.dataset.id;
                this.deleteUser(userId);
            });
        });

        document.querySelectorAll(".make-admin").forEach(button => {
            button.addEventListener("click", (event) => {
                const userId = event.target.dataset.id;
                this.makeAdmin(userId);
            });
        });
    }

    async deleteUser(userId) {
        // Simulazione di una chiamata per eliminare l'utente
        alert(`User with ID ${userId} deleted!`);
        this.loadUsers();
    }

    async makeAdmin(userId) {
        // Simulazione di una chiamata per rendere admin l'utente
        alert(`User with ID ${userId} is now an admin!`);
        this.loadUsers();
    }
}
