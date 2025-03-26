import { state } from "../../config.js";
import { navigateTo } from "../../index.js";
import rest from "../../rest.js";
import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    
    this.boundHandlers = {
      click: this.handleClick.bind(this)
    };
  }
  
  onMount() {
    const app = document.querySelector("#app");
    app.addEventListener('click', this.boundHandlers.click);
    console.log("HeaderDetail mounted: event listeners added");
  }
  
  onUnmount() {
    const app = document.querySelector("#app");
    app.removeEventListener('click', this.boundHandlers.click);
    console.log("HeaderDetail unmounted: event listeners removed");
  }
  
  handleClick(e) {
    if (!document.getElementById('header-detail')) return;
    
    const target = e.target.closest('[data-action]');
    if (!target) return;
    
    const action = target.dataset.action;
    const articleId = parseInt(target.dataset.articleId);
    
    switch(action) {
      case 'delete-article':
        this.articleDeleteButton(articleId);
        break;
      case 'edit-article':
        this.articleEditButton(articleId);
        break;
      case 'go-to-settings':
        this.goToSettings();
        break;
      case 'go-to-login':
        this.goToLogin();
        break;
    }
  }

  async getHtml() {
    const isOwner = this.params.isOwner;
    const articleId = new URL(window.location.href).pathname.split('/').pop();
    return `
        <div id="header-detail" class="p-4 bg-gray-100 flex justify-end space-x-2">
            ${
              state.isLogged
                ? `
                ${
                  isOwner || state.isAdmin
                    ? `
                    <button 
                      data-action="delete-article"
                      data-article-id="${articleId}" 
                      class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                      Delete
                    </button>
                    <button 
                      data-action="edit-article"
                      data-article-id="${articleId}" 
                      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Modify
                    </button>
                `
                    : ""
                }
                <button 
                  data-action="go-to-settings" 
                  class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
                  Settings
                </button>
            `
                : `
                <button 
                  data-action="go-to-login" 
                  class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Login
                </button>
            `
            }
        </div>
    `;
  }

  async articleDeleteButton(articleId) {
    try {
      await rest.deleteArticle(articleId);
      await navigateTo("/");
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  }

  async articleEditButton(articleId) {
    state.setArticleModifying(parseInt(articleId));
    await navigateTo("/modify-article");
  }

  async goToSettings() {
    await navigateTo("/settings");
  }

  async goToLogin() {
    await navigateTo("/login");
  }
}
