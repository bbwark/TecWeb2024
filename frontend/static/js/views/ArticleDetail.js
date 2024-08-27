import { state } from "../config.js";
import rest from "../rest.js";
import AbstractView from "./AbstractView.js";
import HeaderDetail from "./components/HeaderDetail.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Article");
  }

  async getHtml() {
    const article = await rest.getArticleById(state.articleIdDetailOpened);
    const headerView = new HeaderDetail({isOwner: article.authorId === state.userId});
    this.setTitle(article.title);
    const headerHtml = await headerView.getHtml();
    const data = await rest.getUserById(article.authorId);
    const authorName = data.name;

    return `
        <div class="article-detail">
            <h2>${article.title}</h2>
            ${headerHtml}
            <div class="article-detail-subtitle">
                <p>Author: ${authorName}</p>
                <p>Published on: ${article.publishedDate}</p>
                <p>Last modified: ${article.modifiedDate}</p>
            </div>
            <p>${article.content}</p>            
            <p>Tags: ${article.tags}</p>
        </div>
        `;
  }
}
