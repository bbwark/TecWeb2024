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
        <button onclick="app.changePage(${i}, ${
        this.isFromUserList
      })" class="pagination-button ${
        i === this.currentPage ? "active" : ""
      }" data-page="${i}">
          ${i}
        </button>
      `);
    }

    return `
      <div class="pagination-container">

        ${
          this.currentPage >= 4
            ? `<button onclick="app.changePage(1, ${this.isFromUserList})" class="pagination-button" data-page="1">1</button>`
            : ``
        }

        <button onclick="app.changePage(${this.currentPage - 1}, ${
      this.isFromUserList
    })" class="pagination-button previous" ${
      this.currentPage === 1 ? "disabled" : ""
    } data-page="${this.currentPage - 1}">
          &lt;
        </button>
        
        ${paginationButtons.join("")}

        <button onclick="app.changePage(${this.currentPage + 1}, ${
      this.isFromUserList
    })" class="pagination-button next" ${
      this.currentPage === this.totalPages ? "disabled" : ""
    } data-page="${this.currentPage + 1}">
          &gt;
        </button>

        ${
          this.currentPage <= this.totalPages - 3
            ? `<button onclick="app.changePage(${this.totalPages}, ${this.isFromUserList})" class="pagination-button" data-page="${this.totalPages}">${this.totalPages}</button>`
            : ``
        }

        <p>Page selected = ${this.currentPage}</p>
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
  }
}
