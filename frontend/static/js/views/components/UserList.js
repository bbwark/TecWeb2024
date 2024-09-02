import AbstractView from "../AbstractView.js";
import rest from "../../rest.js";
import { config, state } from "../../config.js";
import Pagination from "./Pagination.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("User List");

    const app = document.querySelector("#app");
    if (!app.loadUsers) app.loadUsers = this.loadUsers;
    if (!app.toggleAdmin) app.toggleAdmin = this.toggleAdmin;
    if (!app.deleteUser) app.deleteUser = this.deleteUser;
  }

  async getHtml() {
    const totalUsers = await rest.getNumberOfUsers();
    const numberOfPages = Math.ceil(totalUsers / config.numberOfUsersPerPage);
    const paginationView = new Pagination({
      currentPage: state.usersOpenedPage,
      totalPages: numberOfPages,
      isFromUserList: true,
    });
    const paginationHtml = await paginationView.getHtml();

    if (state.isAdmin) {
      setTimeout(() => {
        this.loadUsers();
      }, 0);
    } // Allow to load users after injecting the HTML

    return `
        <h1 class="text-2xl font-bold mb-4">User List</h1>
        <div class="overflow-x-auto">
            <table id="user-list-table" class="min-w-full max-w-full bg-white shadow-md rounded-lg table-fixed">
                <thead class="bg-gray-100 w-full">
                    <tr class="w-full">
                        <th class="p-4 border-b w-1/4">Username</th>
                        <th class="p-4 border-b w-1/4">Name</th>
                        <th class="p-4 border-b w-1/4">Admin</th>
                        <th class="p-4 border-b w-1/4"></th>
                    </tr>
                </thead>
                <tbody id="user-list-tbody" class="text-center divide-y divide-gray-200 w-full">
                    <tr class="w-full">
                        <td colspan="4" class="p-4">Loading...</td>
                    </tr>
                </tbody>
            </table>
        </div>
        ${paginationHtml}
    `;
}

async loadUsers() {
    let users = await rest.getUsersPaginated(state.usersOpenedPage);
    const userListTbody = document.getElementById("user-list-tbody");
    userListTbody.innerHTML = "";

    users.forEach((user) => {
        let tr = document.createElement("tr");
        tr.classList.add("hover:bg-gray-50", "w-full");

        tr.innerHTML = `
            <td class="p-4">${user.username}</td>
            <td class="p-4">${user.name}</td>
            <td class="p-4">
                <input onclick="app.toggleAdmin(${user.id})" type="checkbox" ${
            user.isAdmin ? "checked" : ""
        }
                data-id="${user.id}" class="admin-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
            </td>
            <td class="p-4">
                <button onclick="app.deleteUser(${user.id})" data-id="${user.id}" class="delete-user-btn text-red-500 hover:text-red-700">Delete</button>
            </td>
        `;

        userListTbody.appendChild(tr);
    });
}


  async toggleAdmin(userId) {
    let adminCheckbox = document.querySelector(
      `.admin-checkbox[data-id="${userId}"]`
    );
    if (adminCheckbox) {
      await rest.updateUserAdmin(userId, { isAdmin: adminCheckbox.checked });
    }
  }

  async deleteUser(userId) {
    await rest.deleteUser(userId);
    const app = document.querySelector("#app");
    app.loadUsers();
  }
}
