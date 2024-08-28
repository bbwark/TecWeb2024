import { config, state } from "./config.js";
import ArticleDTO from "./models/articleDTO.js";
import UserDTO from "./models/userDTO.js";

// token interceptor
axios.interceptors.request.use(
  (config) => {
    const token = state.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
};

const checkPassword = async (password) => {
  try {
    const response = await axios.post(
      `${config.apiBaseUrl}/auth/passwordcheck`,
      {
        id: state.userId,
        password,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

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

const getNumberOfArticles = async () => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/articles/count`);
    return response.data.count;
  } catch (error) {
    throw error.response.data;
  }
};

const getNumberOfArticlesByTag = async (tag) => {
  try {
    const response = await axios.get(
      `${config.apiBaseUrl}/articles/count/tag/${tag}`
    );
    return response.data.count;
  } catch (error) {
    throw error.response.data;
  }
};

const getNumberOfArticlesByUserId = async (userId) => {
  try {
    const response = await axios.get(
      `${config.apiBaseUrl}/articles/count/owner/${userId}`
    );
    return response.data.count;
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

const getNumberOfUsers = async () => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/users/count`);
    return response.data.count;
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

const updateUserAdmin = async (id, updateData) => {
  try {
    const response = await axios.put(
      `${config.apiBaseUrl}/users/admin/${id}`,
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

// DTO Builders
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
  return new UserDTO(
    data.id,
    data.username,
    data.password,
    data.name,
    data.isAdmin
  );
};

export default {
  login,
  checkPassword,
  createArticle,
  getArticleById,
  getAllArticles,
  getRecentArticles,
  getArticlesByTag,
  getArticlesByUserId,
  getNumberOfArticles,
  getNumberOfArticlesByTag,
  getNumberOfArticlesByUserId,
  updateArticle,
  deleteArticle,
  createUser,
  getUserById,
  getAllUsers,
  getUsersPaginated,
  getNumberOfUsers,
  updateUser,
  updateUserAdmin,
  deleteUser,
};
