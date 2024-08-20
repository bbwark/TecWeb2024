import AbstractView from "./AbstractView.js";
import Article from "./components/Article.js";
import HeaderShowcase from "./components/HeaderShowcase.js";
import { state } from "../config.js";

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

    const headerView = new HeaderShowcase({ isLogged: state.isLogged });
    const headerHtml = await headerView.getHtml();

    return `
            ${headerHtml}
            <div id="article-list">
                ${articleHtml.join("")}
            </div>
        `;
  }
}
