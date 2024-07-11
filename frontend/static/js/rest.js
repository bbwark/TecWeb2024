import { config } from "./config.js";
const axios = require('axios');

// Article Endpoints
const createArticle = async (articleData) => {
  try {
    const response = await axios.post(`${config.apiBaseUrl}/articles`, articleData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const getArticleById = async (id) => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/articles/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const getAllArticles = async () => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/articles`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const getRecentArticles = async (page) => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/articles/recent/${page}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const getArticlesByTag = async (tag, page) => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/articles/by-tag/${tag}/${page}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const updateArticle = async (id, updateData) => {
  try {
    const response = await axios.put(`${config.apiBaseUrl}/articles/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const deleteArticle = async (id) => {
  try {
    await axios.delete(`${config.apiBaseUrl}/articles/${id}`);
  } catch (error) {
    throw error.response.data;
  }
};

// User Endpoints
const createUser = async (userData) => {
  try {
    const response = await axios.post(`${config.apiBaseUrl}/users`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const getUserById = async (id) => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const getAllUsers = async () => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/users`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const getUsersPaginated = async (page) => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/users/list/${page}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const updateUser = async (id, updateData) => {
  try {
    const response = await axios.put(`${config.apiBaseUrl}/users/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const deleteUser = async (id) => {
  try {
    await axios.delete(`${config.apiBaseUrl}/users/${id}`);
  } catch (error) {
    throw error.response.data;
  }
};

module.exports = {
  createArticle,
  getArticleById,
  getAllArticles,
  getRecentArticles,
  getArticlesByTag,
  updateArticle,
  deleteArticle,
  createUser,
  getUserById,
  getAllUsers,
  getUsersPaginated,
  updateUser,
  deleteUser
};
