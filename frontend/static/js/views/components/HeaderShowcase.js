import { articleShowCaseState, state } from "../../config.js";
import { navigateTo } from "../../index.js";
import { setArticlesToShowBasedOnState } from "../../utilities/utilities.js";
import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    
    this.boundHandlers = {
      click: this.handleClick.bind(this),
      scroll: this.handleScroll.bind(this)
    };
    
    this.lastScrollTop = 0;
  }
  
  onMount() {
    const app = document.querySelector("#app");
    app.addEventListener('click', this.boundHandlers.click);
    window.addEventListener('scroll', this.boundHandlers.scroll);
    console.log("HeaderShowcase mounted: event listeners added");
  }
  
  onUnmount() {
    const app = document.querySelector("#app");
    app.removeEventListener('click', this.boundHandlers.click);
    window.removeEventListener('scroll', this.boundHandlers.scroll);
    console.log("HeaderShowcase unmounted: event listeners removed");
  }
  
  handleScroll() {
    const header = document.getElementById('header-showcase');
    if (!header) return;
    
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScrollTop > this.lastScrollTop && currentScrollTop > 250) {
      header.classList.add('-translate-y-full');
    } else {
      header.classList.remove('-translate-y-full');
    }
    
    this.lastScrollTop = currentScrollTop;
  }
  
  handleClick(e) {
    if (!document.getElementById('header-showcase')) return;
    
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
        <div id="header-showcase" class="p-4 bg-gray-100 sticky top-0 z-10 transition-transform duration-300 ease-in-out">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <h1 class="text-4xl font-bold text-blue-600 mb-3 sm:mb-0">PressPortal</h1>
                <div class="flex flex-wrap gap-2">
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
            </div>
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
