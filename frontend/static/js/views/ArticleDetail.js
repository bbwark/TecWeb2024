import { articleShowCaseState, state } from "../config.js";
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
        <div class="article-detail">
            <h2>${article.title}</h2>
            ${headerHtml}
            <div class="article-detail-subtitle">
                <a class="tag-link" onclick="app.goToArticleShowcaseUser('${
                  article.authorId
                }')">${authorName}</a>
                <p>Published on: ${new Date(
                  article.publishedDate
                ).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</p>
                <p>Last modified: ${new Date(
                  article.modifiedDate
                ).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</p>
            </div>
            <p>${article.content}</p>            
            <p>Tags: ${article.tags
              .map(
                (tag) =>
                  `<a class="tag-link" onclick="app.goToArticleShowcaseTag('${tag}')">#${tag}</a>`
              )
              .join(", ")}</p>
        </div>
        `;
  }

  async goToArticleShowcaseTag(tag) {
    state.setOpenedTag(tag);
    state.setArticlesOpenedPage(1);
    state.setArticleShowcaseState(articleShowCaseState.TAG_ARTICLES);
    await setArticlesToShowBasedOnState();
    history.pushState(null, null, "/");
    document.querySelector("#app").innerHTML =
      await new ArticleShowcase().getHtml();
  }

  async goToArticleShowcaseUser(userId) {
    state.setUserIdArticlesToShow(userId);
    state.setArticlesOpenedPage(1);
    state.setArticleShowcaseState(articleShowCaseState.USER_ARTICLES);
    await setArticlesToShowBasedOnState();
    history.pushState(null, null, "/");
    document.querySelector("#app").innerHTML =
      await new ArticleShowcase().getHtml();
  }
}
