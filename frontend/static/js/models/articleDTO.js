export default class ArticleDTO {
  constructor(
    articleId,
    title,
    content,
    authorId,
    publishedDate,
    modifiedDate,
    tags,
    preview,
    showEditDeleteButtons
  ) {
    this.articleId = articleId;
    this.title = title;
    this.content = content;
    this.authorId = authorId;
    this.publishedDate = publishedDate;
    this.modifiedDate = modifiedDate;
    this.tags = tags;
    this.preview = preview;
    this.showEditDeleteButtons = showEditDeleteButtons;
  }
}
