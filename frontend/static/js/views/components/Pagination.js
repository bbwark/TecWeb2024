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
    let startingPage = 1;
    let endingPage = this.totalPages;
    // TODO logic to render only 5 pages at a time


    for (let i = startingPage; i <= endingPage; i++) {
      paginationButtons.push(`
        <button onclick="app.changePage(${i}, ${this.isFromUserList})" class="pagination-button ${
          i === this.currentPage ? "active" : ""
        }" data-page="${i}">
          ${i}
        </button>
      `);
    }

    return `
      <div class="pagination-container">
        <button onclick="app.changePage(${this.currentPage - 1}, ${this.isFromUserList})" class="pagination-button previous" ${
          this.currentPage === 1 ? "disabled" : ""
        } data-page="${this.currentPage - 1}">
          &lt;
        </button>
        
        ${paginationButtons.join("")}

        <button onclick="app.changePage(${this.currentPage + 1}, ${this.isFromUserList})" class="pagination-button next" ${
          this.currentPage === this.totalPages ? "disabled" : ""
        } data-page="${this.currentPage + 1}">
          &gt;
        </button>
      </div>
    `;
  }

  async changePage(pageDestination, isFromUserList) {
    
    if (isFromUserList) {
      state.setUsersOpenedPage(pageDestination);
      document.querySelector("#settings-content").innerHTML = await new UserList().getHtml();
    } else {
      state.setArticlesOpenedPage(pageDestination);
      await setArticlesToShowBasedOnState();
      document.querySelector("#app").innerHTML = await new ArticleShowcase().getHtml();
    }
  }
}
