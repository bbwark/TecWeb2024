import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    const { isLogged, isOwner, isAdmin } = this.params;
    return `
        <div id="header">
            ${
              isLogged
                ? `
                ${
                  isOwner || isAdmin
                    ? `
                <button id="delete">Delete</button>
                <button id="modify">Modify</button>`
                    : ""
                }
                <button id="settings">Settings</button>
                `
                : `
                <button id="login-button">Login</button>
                `
            }
        </div>
    `;
  } // TODO BUTTONS HERE
}
