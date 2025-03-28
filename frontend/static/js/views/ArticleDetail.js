import { articleShowCaseState, state } from "../config.js";
import { navigateTo } from "../index.js";
import rest from "../rest.js";
import { setArticlesToShowBasedOnState } from "../utilities/utilities.js";
import AbstractView from "./AbstractView.js";
import HeaderDetail from "./components/HeaderDetail.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Article");

    if (state.articleShowCaseState !== articleShowCaseState.ALL_ARTICLES) {
      state.setArticlesOpenedPage(1);
      state.setArticleShowcaseState(articleShowCaseState.ALL_ARTICLES);
    }
    
    this.articleId = params.id ? parseInt(params.id) : null;
    
    if (!this.articleId) {
      console.error("No article ID provided");
    }
    
    this.headerComponent = null;
    
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
    
    console.log("ArticleDetail mounted: event listeners added");
  }
  
  onUnmount() {
    const app = document.querySelector("#app");
    app.removeEventListener('click', this.boundHandlers.click);
    
    if (this.headerComponent) {
      this.headerComponent.onUnmount();
    }
    
    console.log("ArticleDetail unmounted: event listeners removed");
  }

  async getHtml() {
    if (!this.articleId) {
      return `<div class="p-8 text-center">
                <h2 class="text-2xl font-bold text-red-600">Article Not Found</h2>
                <p class="mt-4">No article ID was provided.</p>
                <a href="/" data-link class="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded">
                  Return to Home
                </a>
              </div>`;
    }
    
    try {
      const article = await rest.getArticleById(this.articleId);
      
      this.headerComponent = new HeaderDetail({
        isOwner: article.authorId === state.userId,
      });
      
      this.setTitle(article.title);
      const headerHtml = await this.headerComponent.getHtml();
      
      const data = await rest.getUserById(article.authorId);
      const authorName = data.name;
      
      return `
        <div id="article-detail-view" class="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
          ${headerHtml}
          <div class="max-w-3xl mx-auto">
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
              <div class="p-6 sm:p-8">
                <div class="flex flex-wrap mb-4">
                  <div class="w-full lg:w-[70%] pr-4">
                    <h2 class="text-3xl font-bold text-gray-900 break-words">${article.title}</h2>
                    <h3 class="text-xl text-gray-700 mt-1 mb-2 italic">${article.subtitle}</h3>
                    <p class="text-sm text-gray-600 mt-2">
                      By <a class="text-blue-600 hover:underline" 
                            data-action="show-user-articles" 
                            data-user-id="${article.authorId}">${authorName}</a>
                    </p>
                  </div>
                  <div class="w-full lg:w-[30%] text-right text-sm text-gray-600 mt-3 lg:mt-0">
                    <p>Published on: ${new Date(article.publishedDate).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</p>
                    <p class="text-xs mt-1">Last modified: ${new Date(article.modifiedDate).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</p>
                  </div>
                </div>
                
                <div class="mt-6 prose prose-lg">${marked.parse(article.content)}</div>            
                <div class="mt-6">
                  <div class="mt-2 flex flex-wrap gap-2">
                    ${article.tags.map(tag => `
                      <a data-action="show-tag-articles" 
                         data-tag="${tag}" 
                         class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full hover:bg-blue-200 cursor-pointer">
                        #${tag}
                      </a>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } catch (error) {
      console.error("Error loading article:", error);
      return `<div class="p-8 text-center">
                <h2 class="text-2xl font-bold text-red-600">Error Loading Article</h2>
                <p class="mt-4">There was a problem loading the article.</p>
                <a href="/" data-link class="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded">
                  Return to Home
                </a>
              </div>`;
    }
  }

  handleClick(e) {
    if (!document.getElementById('article-detail-view')) return;
    
    const target = e.target.closest('[data-action]');
    if (!target) return;
    
    const action = target.dataset.action;
    
    switch(action) {
      case 'show-tag-articles':
        this.goToArticleShowcaseTag(target.dataset.tag);
        break;
      case 'show-user-articles':
        this.goToArticleShowcaseUser(target.dataset.userId);
        break;
    }
  }

  async goToArticleShowcaseTag(tag) {
    state.setOpenedTag(tag);
    state.setArticlesOpenedPage(1);
    state.setArticleShowcaseState(articleShowCaseState.TAG_ARTICLES);
    await setArticlesToShowBasedOnState();
    await navigateTo("/");
  }

  async goToArticleShowcaseUser(userId) {
    state.setUserIdArticlesToShow(userId);
    state.setArticlesOpenedPage(1);
    state.setArticleShowcaseState(articleShowCaseState.USER_ARTICLES);
    await setArticlesToShowBasedOnState();
    await navigateTo("/");
  }
}
