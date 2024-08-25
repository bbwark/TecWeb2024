import { state } from "../../config.js";
import rest from "../../rest.js";
import { escapeHtml, validatePassword } from "../../utilities.js";
import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Change Password");

    const app = document.querySelector("#app");
    if (!app.changePassword) app.changePassword = this.changePassword;
  }

  async getHtml() {
    return `
            <h1>Change Password</h1>
            <div id="change-password">
                <div>
                    <label for="old-password">Old Password:</label>
                    <input type="password" id="old-password" name="oldPassword" required>
                </div>
                <div>
                    <label for="new-password">New Password:</label>
                    <input type="password" id="new-password" name="newPassword" required>
                </div>
                <button onclick="app.changePassword()">Change Password</button>
            </div>
        `;
  }

  async changePassword() {
    let oldPasswordInserted = document.getElementById("old-password");
    let newPasswordInserted = document.getElementById("new-password");
    if (oldPasswordInserted && newPasswordInserted) {
      escapeHtml(oldPasswordInserted.value);
      escapeHtml(newPasswordInserted.value);

      const isOldPasswordCorrect = await rest.checkPassword(
        oldPasswordInserted.value
      );
      
      if (
        isOldPasswordCorrect &&
        oldPasswordInserted !== newPasswordInserted &&
        validatePassword(newPasswordInserted.value)
      ) {
        await rest.updateUser(state.userId, {
          password: newPasswordInserted.value,
        });
        oldPasswordInserted.value = "";
        newPasswordInserted.value = "";
      }
    }
  }
}
