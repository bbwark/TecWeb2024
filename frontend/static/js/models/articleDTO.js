

export default class ArticleDTO {
  constructor(
    articleId = "",
    title = "",
    subtitle = "",
    content = "",
    authorId = 0,
    publishedDate = "",
    modifiedDate = "",
    tags = [],
    preview,
    showEditDeleteButtons
  ) {
    this.articleId = articleId;
    this.title = title;
    this.subtitle = subtitle;
    this.content = content;
    this.authorId = authorId;
    this.publishedDate = publishedDate;
    this.modifiedDate = modifiedDate;
    this.tags = tags;
    this.preview = preview;
    this.showEditDeleteButtons = showEditDeleteButtons;
  }
}
