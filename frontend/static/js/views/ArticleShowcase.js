import AbstractView from "./AbstractView.js";
import Article from "./components/Article.js";
import HeaderShowcase from "./components/HeaderShowcase.js";
import Pagination from "./components/Pagination.js";
import { articleShowCaseState, config, state } from "../config.js";
import rest from "../rest.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("PressPortal");
  }

  async getHtml() {
    const articleHtml = [];
    let firstArticle = true;
    for (const article of state.articlesToShow) {
      article.preview = firstArticle;
      firstArticle = false;
      if (article.authorId === state.userId || state.isAdmin) {
        article.showEditDeleteButtons = true;
      }

      const articleView = new Article(article);
      articleHtml.push(await articleView.getHtml());
    }

    const numberOfPages = await this.numberOfPages();
    const paginationView = new Pagination({ currentPage: state.openedPage, totalPages: numberOfPages });
    const paginationHtml = await paginationView.getHtml();

    const headerView = new HeaderShowcase({ isLogged: state.isLogged });
    const headerHtml = await headerView.getHtml();

    return `
            ${headerHtml}
            <div id="article-list">
                ${articleHtml.join("")}
            </div>
            ${paginationHtml}
        `;
  }

  async numberOfPages() {
    let totalArticles = 0;
    switch (state.articleShowCaseState) {
      case articleShowCaseState.USER_ARTICLES:
        totalArticles = await rest.getNumberOfArticlesByUserId(
          state.userIdArticlesToShow
        );
        break;
      case articleShowCaseState.TAG_ARTICLES:
        totalArticles = await rest.getNumberOfArticlesByTag(state.openedTag);
        break;
      case articleShowCaseState.ALL_ARTICLES:
      default:
        totalArticles = await rest.getNumberOfArticles();
        break;
    }
    return Math.ceil(totalArticles / config.numberOfArticlesPerPage);
  }
}
