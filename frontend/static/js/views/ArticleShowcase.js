import AbstractView from "./AbstractView.js";
import Article from "./components/Article.js";
import HeaderShowcase from "./components/HeaderShowcase.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Article Showcase");
    this.articles = params.articles;
  }

  async getHtml() {
    const articleHtml = [];
    for (const article in this.articles) {
      const articleView = new Article(article);
      articleHtml.push(await articleView.getHtml());
    }

    const headerView = new HeaderShowcase({ isLogged: true, isAdmin: true });
    const headerHtml = await headerView.getHtml();

    return `
            ${headerHtml}
            <div id="article-list">
                ${articleHtml.join("")}
            </div>
        `;
  }
}
