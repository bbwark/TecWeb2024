import { articleShowCaseState, state } from "../../config.js";
import { navigateTo } from "../../index.js";
import { setArticlesToShowBasedOnState } from "../../utilities.js";
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
    console.log("HeaderShowcase mounted: event listeners added");
  }
  
  onUnmount() {
    const app = document.querySelector("#app");
    app.removeEventListener('click', this.boundHandlers.click);
    console.log("HeaderShowcase unmounted: event listeners removed");
  }
  
  handleClick(e) {
    if (!document.getElementById('header')) return;
    
    const target = e.target.closest('[data-action]');
    if (!target) return;
    
    const action = target.dataset.action;
    
    switch(action) {
      case 'show-articles':
        this.showArticles();
        break;
      case 'new-article':
        this.newArticle();
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
    const { isLogged } = this.params;
    const showcaseState = state.articleShowCaseState;
    return `
        <div id="header" class="p-4 bg-gray-100 flex justify-end space-x-2">
            ${
              isLogged
                ? `
                <button id="show-articles" 
                        data-action="show-articles" 
                        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    ${
                      showcaseState === articleShowCaseState.ALL_ARTICLES
                        ? "My Articles"
                        : "Recent Articles"
                    }
                </button>
                <button id="new-article" 
                        data-action="new-article" 
                        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  New Article
                </button>
                <button id="settings" 
                        data-action="go-to-settings" 
                        class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
                  Settings
                </button>
            `
                : `
                <button id="login-button" 
                        data-action="go-to-login" 
                        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Login
                </button>
            `
            }
        </div>
    `;
  }

  async showArticles() {
    state.setArticleShowcaseState(
      state.articleShowCaseState === articleShowCaseState.ALL_ARTICLES
        ? articleShowCaseState.USER_ARTICLES
        : articleShowCaseState.ALL_ARTICLES
    );
    state.setUserIdArticlesToShow(state.userId);
    state.setArticlesOpenedPage(1);
    await setArticlesToShowBasedOnState();
    await navigateTo("/");
  }

  async newArticle() {
    state.setArticleModifying(0);
    await navigateTo("/modify-article");
  }

  async goToSettings() {
    await navigateTo("/settings");
  }

  async goToLogin() {
    await navigateTo("/login");
  }
}
