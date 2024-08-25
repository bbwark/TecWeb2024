import { config, state } from "./config.js";
import ArticleDTO from "./models/articleDTO.js";
import UserDTO from "./models/userDTO.js";

// Authentication Endpoints
const login = async (username, password) => {
  try {
    const response = await axios.post(`${config.apiBaseUrl}/auth/login`, {
      username,
      password,
    });
    state.setUserId(response.data.id);
    state.setAdminStatus(response.data.isAdmin);
    state.setLoggedInStatus(true);
    state.setAccessToken(response.data.accessToken);
    return response.data.accessToken;
  } catch (error) {
    throw error.response.data;
  }
}

// Article Endpoints
const createArticle = async (articleData) => {
  try {
    const response = await axios.post(
      `${config.apiBaseUrl}/articles`,
      articleData
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const getArticleById = async (id) => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/articles/${id}`);
    return articleBuilder(response.data);
  } catch (error) {
    throw error.response.data;
  }
};

const getAllArticles = async () => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/articles`);
    return response.data.map((data) => articleBuilder(data));
  } catch (error) {
    throw error.response.data;
  }
};

const getRecentArticles = async (page) => {
  try {
    const response = await axios.get(
      `${config.apiBaseUrl}/articles/recent/${page}`
    );
    return response.data.map((data) => articleBuilder(data));
  } catch (error) {
    throw error.response.data;
  }
};

const getArticlesByTag = async (tag, page) => {
  try {
    const response = await axios.get(
      `${config.apiBaseUrl}/articles/by-tag/${tag}/${page}`
    );
    return response.data.map((data) => articleBuilder(data));
  } catch (error) {
    throw error.response.data;
  }
};

const getArticlesByUserId = async (userId, page) => {
  try {
    const response = await axios.get(
      `${config.apiBaseUrl}/articles/by-user-id/${userId}/${page}`
    );
    return response.data.map((data) => articleBuilder(data));
  } catch (error) {
    throw error.response.data;
  }
};

const updateArticle = async (id, updateData) => {
  try {
    const response = await axios.put(
      `${config.apiBaseUrl}/articles/${id}`,
      updateData
    );
    return articleBuilder(response.data);
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
    return userBuilder(response.data);
  } catch (error) {
    throw error.response.data;
  }
};

const getUserById = async (id) => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/users/${id}`);
    return userBuilder(response.data);
  } catch (error) {
    throw error.response.data;
  }
};

const getAllUsers = async () => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/users`);
    return response.data.map((data) => userBuilder(data));
  } catch (error) {
    throw error.response.data;
  }
};

const getUsersPaginated = async (page) => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/users/list/${page}`);
    return response.data.map((data) => userBuilder(data));
  } catch (error) {
    throw error.response.data;
  }
};

const updateUser = async (id, updateData) => {
  try {
    const response = await axios.put(
      `${config.apiBaseUrl}/users/${id}`,
      updateData
    );
    return userBuilder(response.data);
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

const articleBuilder = (data) => {
  return new ArticleDTO(
    data.id,
    data.title,
    data.content,
    data.userId,
    data.createdAt,
    data.updatedAt,
    data.tags
  );
};

const userBuilder = (data) => {
  return new UserDTO(data.id, data.username, data.name, data.isAdmin);
};

export default {
  login,
  createArticle,
  getArticleById,
  getAllArticles,
  getRecentArticles,
  getArticlesByTag,
  getArticlesByUserId,
  updateArticle,
  deleteArticle,
  createUser,
  getUserById,
  getAllUsers,
  getUsersPaginated,
  updateUser,
  deleteUser,
};
