import AbstractView from "./AbstractView.js";
import HeaderDetail from "./components/HeaderDetail.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Article Detail");
    this.article = params.article;
  }

  async getHtml() {
    const headerView = new HeaderDetail({
      isLogged: this.params.isLogged,
      isOwner: this.params.isOwner,
      isAdmin: this.params.isAdmin,
    });
    const headerHtml = await headerView.getHtml();

    return `
        <div class="article-detail">
            <h2>${this.article.title}</h2>
            ${headerHtml}
            <div class="article-detail-subtitle">
                <p>Author: ${this.article.author}</p>
                <p>Published on: ${this.article.publishedDate}</p>
                <p>Last modified: ${this.article.modifiedDate}</p>
            </div>
            <p>${this.article.content}</p>            
            <p>Tags: ${this.article.tags.join(", ")}</p>
        </div>
        `;
  }
}
