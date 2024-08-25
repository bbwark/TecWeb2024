import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Change Name");

    const app = document.querySelector("#app");
    if (!app.changeName) app.changeName = this.changeName;
  }

  async getHtml() {
    return `
            <h1>Change Name</h1>
            <div id="change-name">
                <div>
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div>
                    <label for="new-name">New Name:</label>
                    <input type="text" id="new-name" name="newName" required>
                </div>
                <button>Change Name</button>
            </div>
        `;
  }

  async changeName() {
    let passwordInserted = document.getElementById("password");
    let newNameInserted = document.getElementById("new-name");
    if (passwordInserted && newNameInserted) {
      escapeHtml(passwordInserted.value);
      escapeHtml(newNameInserted.value);

      const isPasswordCorrect = await rest.checkPassword(
        passwordInserted.value
      );

      if (isPasswordCorrect) {
        await rest.updateUser(state.userId, { name: newNameInserted.value });
      }
      passwordInserted.value = "";
      newNameInserted.value = "";
    }
  }
}
