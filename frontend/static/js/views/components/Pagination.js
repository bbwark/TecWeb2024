import { state } from "../../config.js";
import { setArticlesToShowBasedOnState } from "../../utilities.js";
import AbstractView from "../AbstractView.js";
import ArticleShowcase from "../ArticleShowcase.js";
import UserList from "./UserList.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);

    this.currentPage = params.currentPage;
    this.totalPages = params.totalPages;
    if (params.isFromUserList) {
      this.isFromUserList = params.isFromUserList;
    } else {
      this.isFromUserList = false;
    }

    const app = document.querySelector("#app");
    if (!app.changePage) app.changePage = this.changePage;
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
        <button onclick="app.changePage(${i}, ${this.isFromUserList})" 
                class="pagination-button ${i === this.currentPage 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'} 
                px-3 py-1 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out" 
                data-page="${i}">
          ${i}
        </button>
      `);
    }
  
    return `
      <div class="pagination-container flex items-center justify-center mt-6 space-x-1">
        <button onclick="app.changePage(1, ${this.isFromUserList})" 
                class="pagination-button ${this.currentPage === 1 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-100'} 
                px-2 py-1 rounded-md text-sm font-medium bg-white text-gray-700 transition-colors duration-150 ease-in-out" 
                ${this.currentPage === 1 ? 'disabled' : ''}>
          &laquo;
        </button>
        
        <button onclick="app.changePage(${this.currentPage - 1}, ${this.isFromUserList})" 
                class="pagination-button previous ${this.currentPage === 1 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-100'} 
                px-2 py-1 rounded-md text-sm font-medium bg-white text-gray-700 transition-colors duration-150 ease-in-out" 
                ${this.currentPage === 1 ? 'disabled' : ''}>
          &lsaquo;
        </button>
        
        ${paginationButtons.join('')}
  
        <button onclick="app.changePage(${this.currentPage + 1}, ${this.isFromUserList})" 
                class="pagination-button next ${this.currentPage === this.totalPages 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-100'} 
                px-2 py-1 rounded-md text-sm font-medium bg-white text-gray-700 transition-colors duration-150 ease-in-out" 
                ${this.currentPage === this.totalPages ? 'disabled' : ''}>
          &rsaquo;
        </button>
  
        <button onclick="app.changePage(${this.totalPages}, ${this.isFromUserList})" 
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
    if (isFromUserList) {
      state.setUsersOpenedPage(pageDestination);
      document.querySelector("#settings-content").innerHTML =
        await new UserList().getHtml();
    } else {
      state.setArticlesOpenedPage(pageDestination);
      await setArticlesToShowBasedOnState();
      document.querySelector("#app").innerHTML =
        await new ArticleShowcase().getHtml();
    }
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }
}
