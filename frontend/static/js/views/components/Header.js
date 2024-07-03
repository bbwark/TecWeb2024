import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    const { isLogged, isAdmin } = this.params;
    return `
        <div id="header">
            ${
              isLogged
                ? `
                <button id="my-articles">My Articles</button>
                <button id="new-article">New Article</button>
                <button id="settings">Settings</button>
                `
                : `
                <button id="login-button">Login</button>
                `
            }
        </div>
    `;
  }
}
