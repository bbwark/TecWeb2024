const { where } = require("sequelize");
const { Article } = require("../databaseconn");

const createArticle = async (articleData) => {
  return await Article.create(articleData);
};

const getArticleById = async (articleId) => {
  return await Article.findByPk(articleId);
};

const getAllArticles = async () => {
  return await Article.findAll();
};

const getRecentArticles = async (limit, offset) => {
  return await Article.findAll({
    limit: limit,
    offset: offset,
    order: [["createdAt", "DESC"]],
  });
};

const getRecentArticlesByTag = async (tag, limit, offset) => {
  return await Article.findAll({
    where: {
      tags: tag,
    },
    limit: limit,
    offset: offset,
    order: [["createdAt", "DESC"]],
  });
};

const getRecentArticlesByUserId = async (userId, limit, offset) => {
  return await Article.findAll({
    where: {
      userId: userId,
    },
    limit: limit,
    offset: offset,
    order: [["createdAt", "DESC"]],
  });
};

const updateArticle = async (articleId, updateData) => {
  const article = await Article.findByPk(articleId);
  if (article) {
    return await article.update(updateData);
  }
  return null;
};

const deleteArticle = async (articleId) => {
  const article = await Article.findByPk(articleId);
  if (article) {
    await article.destroy();
    return true;
  }
  return false;
};

module.exports = {
  createArticle,
  getArticleById,
  getAllArticles,
  getRecentArticles,
  getRecentArticlesByTag,
  getRecentArticlesByUserId,
  updateArticle,
  deleteArticle,
};
