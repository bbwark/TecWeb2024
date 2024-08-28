const { config } = require("../config.js");
const articleCrud = require("../crud/articleCrud.js");

const createArticle = async (articleData) => {
  return await articleCrud.createArticle(articleData);
};

const getArticleById = async (articleId) => {
  return await articleCrud.getArticleById(articleId);
};

const getAllArticles = async () => {
  return await articleCrud.getAllArticles();
};

const getRecentArticles = async (page) => {
  const limit = config.pagingNumber;
  const offset = (page - 1) * limit;
  return await articleCrud.getRecentArticles(limit, offset);
};

const getRecentArticlesByTag = async (tag, page) => {
  const limit = config.pagingNumber;
  const offset = (page - 1) * limit;
  return await articleCrud.getRecentArticlesByTag(tag, limit, offset);
};

const getRecentArticlesByUserId = async (userId, page) => {
  const limit = config.pagingNumber;
  const offset = (page - 1) * limit;
  return await articleCrud.getRecentArticlesByUserId(userId, limit, offset);
};

const getNumberOfArticles = async () => {
  return await articleCrud.getNumberOfArticles();
};

const getNumberOfArticlesByTag = async (tag) => {
  return await articleCrud.getNumberOfArticlesByTag(tag);
};

const getNumberOfArticlesByUserId = async (userId) => {
  return await articleCrud.getNumberOfArticlesByUserId(userId);
};

const updateArticle = async (articleId, updateData) => {
  return await articleCrud.updateArticle(articleId, updateData);
};

const deleteArticle = async (articleId) => {
  return await articleCrud.deleteArticle(articleId);
};

module.exports = {
  createArticle,
  getArticleById,
  getAllArticles,
  getRecentArticles,
  getRecentArticlesByTag,
  getRecentArticlesByUserId,
  getNumberOfArticles,
  getNumberOfArticlesByTag,
  getNumberOfArticlesByUserId,
  updateArticle,
  deleteArticle,
};
