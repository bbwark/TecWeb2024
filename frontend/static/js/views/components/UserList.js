import AbstractView from "../AbstractView.js";
import rest from "../../rest.js";
import { config, state } from "../../config.js";
import Pagination from "./Pagination.js";
import { showAlert } from "../../utilities/utilities.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("User List");
    
    this.paginationComponent = null;
    
    this.boundHandlers = {
      click: this.handleClick.bind(this)
    };
  }
  
  onMount() {
    const app = document.querySelector("#app");
    app.addEventListener('click', this.boundHandlers.click);
    
    if (this.paginationComponent) {
      this.paginationComponent.onMount();
    }
    
    if (state.isAdmin) {
      setTimeout(() => {
        this.loadUsers();
      }, 0);
    }
    
    console.log("UserList mounted: event listeners added");
  }
  
  onUnmount() {
    const app = document.querySelector("#app");
    app.removeEventListener('click', this.boundHandlers.click);
    
    if (this.paginationComponent) {
      this.paginationComponent.onUnmount();
    }
    
    console.log("UserList unmounted: event listeners removed");
  }
  
  handleClick(e) {
    if (!document.getElementById('user-list-table')) return;
    
    const target = e.target.closest('[data-action]');
    if (!target) return;
    
    const action = target.dataset.action;
    
    if (action === 'toggle-admin' || action === 'delete-user') {
      const userId = parseInt(target.dataset.userId);
      
      switch(action) {
        case 'toggle-admin':
          this.toggleAdmin(userId, target.checked);
          break;
        case 'delete-user':
          this.deleteUser(userId);
          break;
      }
    }
  }

  async getHtml() {
    const totalUsers = await rest.getNumberOfUsers();
    const numberOfPages = Math.ceil(totalUsers / config.numberOfUsersPerPage);
    
    this.paginationComponent = new Pagination({
      currentPage: state.usersOpenedPage,
      totalPages: numberOfPages,
      isFromUserList: true,
    });
    
    const paginationHtml = await this.paginationComponent.getHtml();

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
    const userListTbody = document.getElementById("user-list-tbody");
    if (!userListTbody) return; 
    
    try {
      let users = await rest.getUsersPaginated(state.usersOpenedPage);
      userListTbody.innerHTML = "";

      users.forEach((user) => {
        let tr = document.createElement("tr");
        tr.classList.add("hover:bg-gray-50", "w-full");

        tr.innerHTML = `
              <td class="p-4">${user.username}</td>
              <td class="p-4">${user.name}</td>
              <td class="p-4">
                  <input 
                    type="checkbox" 
                    ${user.isAdmin ? "checked" : ""}
                    data-action="toggle-admin"
                    data-user-id="${user.id}" 
                    class="admin-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
              </td>
              <td class="p-4">
                  <button 
                    data-action="delete-user" 
                    data-user-id="${user.id}" 
                    class="delete-user-btn text-red-500 hover:text-red-700">
                    Delete
                  </button>
              </td>
          `;

        userListTbody.appendChild(tr);
      });
    } catch (error) {
      userListTbody.innerHTML = `
        <tr class="w-full">
          <td colspan="4" class="p-4 text-red-500">Error loading users: ${error.message}</td>
        </tr>
      `;
    }
  }

  async toggleAdmin(userId, isChecked) {
    if (!document.getElementById('user-list-table')) return; 
    
    try {
      await rest.updateUserAdmin(userId, { isAdmin: isChecked });
    } catch (error) {
      const checkbox = document.querySelector(`.admin-checkbox[data-user-id="${userId}"]`);
      if (checkbox) {
        checkbox.checked = !isChecked;
      }
      showAlert(error.message, "red", "user-list-table");
    }
  }

  async deleteUser(userId) {
    if (!document.getElementById('user-list-table')) return; 
    
    try {
      await rest.deleteUser(userId);
      this.loadUsers();
    } catch (error) {
      showAlert(error.message, "red", "user-list-table");
    }
  }
}
