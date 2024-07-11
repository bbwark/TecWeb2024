import { config } from "../config.js";
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
  updateArticle,
  deleteArticle,
};
