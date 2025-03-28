import { state } from "../../config.js";
import { navigateTo } from "../../index.js";
import { setArticlesToShowBasedOnState } from "../../utilities/utilities.js";
import AbstractView from "../AbstractView.js";
import UserList from "./UserList.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    
    this.currentPage = params.currentPage;
    this.totalPages = params.totalPages;
    this.isFromUserList = params.isFromUserList || false;
    
    this.boundHandlers = {
      click: this.handleClick.bind(this)
    };
  }
  
  onMount() {
    const paginationContainer = document.querySelector('.pagination-container');
    if (paginationContainer) {
      paginationContainer.addEventListener('click', this.boundHandlers.click);
      console.log("Pagination mounted directly on pagination container");
    } else {
      const app = document.querySelector("#app");
      app.addEventListener('click', this.boundHandlers.click);
      console.log("Pagination mounted on app container");
    }
    console.log("Pagination mounted: event listeners added");
  }
  
  onUnmount() {
    const paginationContainer = document.querySelector('.pagination-container');
    if (paginationContainer) {
      paginationContainer.removeEventListener('click', this.boundHandlers.click);
    }
    
    const app = document.querySelector("#app");
    app.removeEventListener('click', this.boundHandlers.click);
    
    console.log("Pagination unmounted: event listeners removed");
  }
  
  handleClick(e) {
    const target = e.target.closest('[data-action="change-page"]');
    if (!target) return;
    
    const page = parseInt(target.dataset.page);
    if (isNaN(page)) return;
    
    this.changePage(page, this.isFromUserList);
    e.preventDefault();
  }

  async getHtml() {
    let paginationButtons = [];
    const maxVisibleButtons = 5;
    let startingPage, endingPage;
  
    if (this.totalPages <= maxVisibleButtons) {
      startingPage = 1;
      endingPage = this.totalPages;
    } else {
      const halfRange = Math.floor(maxVisibleButtons / 2);
  
      if (this.currentPage <= halfRange) {
        startingPage = 1;
        endingPage = maxVisibleButtons;
      } else if (this.currentPage + halfRange >= this.totalPages) {
        startingPage = this.totalPages - maxVisibleButtons + 1;
        endingPage = this.totalPages;
      } else {
        startingPage = this.currentPage - halfRange;
        endingPage = this.currentPage + halfRange;
      }
    }
  
    for (let i = startingPage; i <= endingPage; i++) {
      paginationButtons.push(`
        <button data-action="change-page" 
                data-page="${i}"
                class="pagination-button ${i === this.currentPage 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'} 
                px-3 py-1 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out">
          ${i}
        </button>
      `);
    }
  
    return `
      <div class="pagination-container flex items-center justify-center mt-6 space-x-1">
        <button data-action="change-page" 
                data-page="1"
                class="pagination-button ${this.currentPage === 1 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-100'} 
                px-2 py-1 rounded-md text-sm font-medium bg-white text-gray-700 transition-colors duration-150 ease-in-out" 
                ${this.currentPage === 1 ? 'disabled' : ''}>
          &laquo;
        </button>
        
        <button data-action="change-page" 
                data-page="${Math.max(1, this.currentPage - 1)}"
                class="pagination-button previous ${this.currentPage === 1 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-100'} 
                px-2 py-1 rounded-md text-sm font-medium bg-white text-gray-700 transition-colors duration-150 ease-in-out" 
                ${this.currentPage === 1 ? 'disabled' : ''}>
          &lsaquo;
        </button>
        
        ${paginationButtons.join('')}
  
        <button data-action="change-page" 
                data-page="${Math.min(this.totalPages, this.currentPage + 1)}"
                class="pagination-button next ${this.currentPage === this.totalPages 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-100'} 
                px-2 py-1 rounded-md text-sm font-medium bg-white text-gray-700 transition-colors duration-150 ease-in-out" 
                ${this.currentPage === this.totalPages ? 'disabled' : ''}>
          &rsaquo;
        </button>
  
        <button data-action="change-page" 
                data-page="${this.totalPages}"
                class="pagination-button ${this.currentPage === this.totalPages 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-100'} 
                px-2 py-1 rounded-md text-sm font-medium bg-white text-gray-700 transition-colors duration-150 ease-in-out" 
                ${this.currentPage === this.totalPages ? 'disabled' : ''}>
          &raquo;
        </button>
      </div>
    `;
  }

  async changePage(pageDestination, isFromUserList) {
    if (pageDestination === this.currentPage) return;
    
    if (isFromUserList) {
      state.setUsersOpenedPage(pageDestination);
      
      const settingsView = document.getElementById('settings-view');
      if (settingsView) {
        const settings = window._appCurrentView;
        if (settings && typeof settings.setSettingsContent === 'function') {
          await settings.setSettingsContent('userList');
        } else {
          const contentContainer = document.querySelector("#settings-content");
          if (contentContainer) {
            const userList = new UserList();
            contentContainer.innerHTML = await userList.getHtml();
            userList.onMount();
          }
        }
      }
    } else {
      state.setArticlesOpenedPage(pageDestination);
      await setArticlesToShowBasedOnState();
      await navigateTo(`/page/${pageDestination}`);
    }
    
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}
