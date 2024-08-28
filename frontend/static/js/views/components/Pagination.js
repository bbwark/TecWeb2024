import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.currentPage = params.currentPage;
    this.totalPages = params.totalPages;
  }

  async getHtml() {
    let paginationButtons = [];

    for (let i = 1; i <= this.totalPages; i++) {
      paginationButtons.push(`
            <button class="pagination-button ${
              i === this.currentPage ? "active" : ""
            }" data-page="${i}">
              ${i}
            </button>
          `);
    }

    return `
      <div class="pagination-container">
        ${paginationButtons.join("")}
      </div>
    `;
  }
}
