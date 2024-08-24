const config = require('../config.js');
const userCrud = require("../crud/userCrud");

const createUser = async (userData) => {
  return await userCrud.createUser(userData);
};

const getUserById = async (userId) => {
  return await userCrud.getUserById(userId);
};

const getUserByUsername = async (username) => {
  return await userCrud.getUserByUsername(username);
};

const getAllUsers = async () => {
  return await userCrud.getAllUsers();
};

const getUsersPaginated = async (page) => {
  const limit = config.pagingNumber;
  const offset = (page - 1) * limit;
  return await userCrud.getUsersPaginated(limit, offset);
};

const updateUser = async (userId, updateData) => {
  return await userCrud.updateUser(userId, updateData);
};

const deleteUser = async (userId) => {
  return await userCrud.deleteUser(userId);
};

module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
  getAllUsers,
  getUsersPaginated,
  updateUser,
  deleteUser,
};
