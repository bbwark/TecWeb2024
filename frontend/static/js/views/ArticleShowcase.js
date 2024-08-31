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
    const paginationView = new Pagination({
      currentPage: state.articlesOpenedPage,
      totalPages: numberOfPages,
    });
    const paginationHtml = await paginationView.getHtml();

    const headerView = new HeaderShowcase({ isLogged: state.isLogged });
    const headerHtml = await headerView.getHtml();

    return `
            ${headerHtml}
            <div class="w-full px-4 sm:px-6 md:px-8">
              <div class="max-w-6xl mx-auto">
                <div class="w-full lg:w-2/3 xl:w-1/2 mx-auto">
                  <div class="p-4">
                    <div id="article-list" class="mt-4">
                      ${articleHtml.join("")}
                    </div>
                    ${paginationHtml}
                  </div>
                </div>
              </div>
            </div>
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
