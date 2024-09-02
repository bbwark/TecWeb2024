import { articleShowCaseState, state } from "../config.js";
import { navigateTo } from "../index.js";
import rest from "../rest.js";
import { setArticlesToShowBasedOnState } from "../utilities.js";
import AbstractView from "./AbstractView.js";
import ArticleShowcase from "./ArticleShowcase.js";
import HeaderDetail from "./components/HeaderDetail.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Article");

    if (state.articleShowCaseState !== articleShowCaseState.ALL_ARTICLES) {
      state.setArticlesOpenedPage(1);
      state.setArticleShowcaseState(articleShowCaseState.ALL_ARTICLES);
    }
    const app = document.querySelector("#app");
    if (!app.goToArticleShowcaseTag)
      app.goToArticleShowcaseTag = this.goToArticleShowcaseTag;
    if (!app.goToArticleShowcaseUser)
      app.goToArticleShowcaseUser = this.goToArticleShowcaseUser;
  }

  async getHtml() {
    const article = await rest.getArticleById(state.articleIdDetailOpened);
    const headerView = new HeaderDetail({
      isOwner: article.authorId === state.userId,
    });
    this.setTitle(article.title);
    const headerHtml = await headerView.getHtml();
    const data = await rest.getUserById(article.authorId);
    const authorName = data.name;
    
    return `
      <div class="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        ${headerHtml}
        <div class="max-w-3xl mx-auto">
          <div class="bg-white shadow-lg rounded-lg overflow-hidden">
            <div class="p-6 sm:p-8 relative">
              <div class="text-right text-sm text-gray-600 absolute top-4 right-4 sm:top-8 sm:right-6">
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
              <h2 class="text-3xl font-bold text-gray-900 mb-2">${article.title}</h2>
              <p class="text-sm text-gray-600 mb-4">
                By <a class="text-blue-600 hover:underline" onclick="app.goToArticleShowcaseUser('${article.authorId}')">${authorName}</a>
              </p>
              <div class="mt-6 prose prose-lg">${article.content}</div>            
              <div class="mt-6">
                <div class="mt-2 flex flex-wrap gap-2">
                  ${article.tags.map(tag => `
                    <a onclick="app.goToArticleShowcaseTag('${tag}')" 
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
