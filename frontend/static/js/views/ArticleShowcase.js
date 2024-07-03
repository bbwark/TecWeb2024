import AbstractView from "./AbstractView.js";
import Article from "./components/Article.js";
import Header from "./components/Header.js";
import config from "../config.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Article Showcase");
  }

  async getHtml() {
    const articleHtml = [];
    for (let i = 0; i < config.numberOfArticles; i++) {
         //si dovrebbe passare tra i parametri un array di dictionary di articleparams
      const articleParams = {
        articleId: `${i}`, // Genera un ID fittizio per l'articolo
        title: `Sample Article ${i + 1}`,
        author: `Author ${i + 1}`,
        publishedDate: "2024-01-01",
        modifiedDate: "2024-02-01",
        tags: ["news", "update"],
        preview:
          i === 0
            ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat..."
            : "",
        showEditDeleteButtons: true,
      };
      const articleView = new Article(articleParams);
      articleHtml.push(await articleView.getHtml());
    }

    const headerView = new Header({isLogged: true, isAdmin: true});
    const headerHtml = await headerView.getHtml()

    return `
            ${headerHtml}
            <div id="article-list">
                ${articleHtml.join("")}
            </div>
        `;
  }
}
