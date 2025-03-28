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
    
    this.articleComponents = [];
    this.headerComponent = null;
    this.paginationComponent = null;
    
    this.boundHandlers = {
      click: this.handleClick.bind(this)
    };
  }
  
  onMount() {
    const app = document.querySelector("#app");
    app.addEventListener('click', this.boundHandlers.click);
    
    if (this.headerComponent) {
      this.headerComponent.onMount();
    }
    
    for (const articleComponent of this.articleComponents) {
      articleComponent.onMount();
    }
    
    if (this.paginationComponent) {
      this.paginationComponent.onMount();
    }
    
    console.log("ArticleShowcase mounted: event listeners added");
  }
  
  onUnmount() {
    const app = document.querySelector("#app");
    app.removeEventListener('click', this.boundHandlers.click);
    
    if (this.headerComponent) {
      this.headerComponent.onUnmount();
    }
    
    for (const articleComponent of this.articleComponents) {
      articleComponent.onUnmount();
    }
    
    if (this.paginationComponent) {
      this.paginationComponent.onUnmount();
    }
    
    console.log("ArticleShowcase unmounted: event listeners removed");
  }

  handleClick(e) {
    if (!document.getElementById('article-list')) return;
    
    const target = e.target.closest('[data-action]');
    if (!target) return;
    
    const action = target.dataset.action;
    
    switch(action) {
      //Handle ArticleShowcase specific actions here
    }
  }

  async getHtml() {
    this.articleComponents = [];
    this.headerComponent = null;
    this.paginationComponent = null;
    
    const articleHtml = [];
    let firstArticle = true;
    for (const article of state.articlesToShow) {
      article.preview = firstArticle;
      firstArticle = false;
      if (article.authorId === state.userId || state.isAdmin) {
        article.showEditDeleteButtons = true;
      }

      const articleView = new Article(article);
      this.articleComponents.push(articleView);
      articleHtml.push(await articleView.getHtml());
    }

    const numberOfPages = await this.numberOfPages();
    this.paginationComponent = new Pagination({
      currentPage: state.articlesOpenedPage,
      totalPages: numberOfPages,
    });
    const paginationHtml = await this.paginationComponent.getHtml();

    this.headerComponent = new HeaderShowcase({ isLogged: state.isLogged });
    const headerHtml = await this.headerComponent.getHtml();

    return `
    <div id="article-showcase" class="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      ${headerHtml}
      <div class="max-w-4xl mx-auto">
        <div id="article-list" class="mt-4 flex flex-col items-center">
          ${articleHtml.join("")}
        </div>
        ${paginationHtml}
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
    const numberOfPages = Math.ceil(totalArticles / config.numberOfArticlesPerPage);
    return numberOfPages === 0 ? 1 : numberOfPages;
  }
}
