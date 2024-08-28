import AbstractView from "../AbstractView.js";
import rest from "../../rest.js";
import { state } from "../../config.js";
import Pagination from "./Pagination.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("User List");

    const app = document.querySelector("#app");
    if (!app.loadUsers) app.loadUsers = this.loadUsers;
    if (!app.toggleAdmin) app.toggleAdmin = this.toggleAdmin;
    if (!app.deleteUser) app.deleteUser = this.deleteUser;
    if (state.isAdmin) {
      this.loadUsers();
    }
  }

  async getHtml() {
    const totalUsers = await rest.getNumberOfUsers();
    const numberOfPages = Math.ceil(totalUsers / 10);
    const paginationView = new Pagination({
      currentPage: state.usersOpenedPage,
      totalPages: numberOfPages,
      isFromUserList: true,
    });
    const paginationHtml = await paginationView.getHtml();

    return `
            <h1>User List</h1>
            <table id="user-list-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Name</th>
                        <th>Is Admin</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody id="user-list-tbody">
                    
                </tbody>
            </table>
            ${paginationHtml}
        `;
  }

  async loadUsers() {
    let users = await rest.getUsersPaginated(state.usersOpenedPage);
    const userListTbody = document.getElementById("user-list-tbody");
    userListTbody.innerHTML = "";

    users.forEach((user) => {
      let tr = document.createElement("tr");

      tr.innerHTML = `
              <td>${user.username}</td>
              <td>${user.name}</td>
              <td>
                <input onclick="app.toggleAdmin(${user.id})" type="checkbox" ${
        user.isAdmin ? "checked" : ""
      } data-id="${user.id}" class="admin-checkbox">
              </td>
              <td>
                <button onclick="app.deleteUser(${user.id})" data-id="${
        user.id
      }" class="delete-user-btn">Delete</button>
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
      await rest.updateUser(userId, { isAdmin: adminCheckbox.checked });
    }
  }

  async deleteUser(userId) {
    await rest.deleteUser(userId);
    const app = document.querySelector("#app");
    app.loadUsers();
  }
}
