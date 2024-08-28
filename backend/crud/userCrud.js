const { Op } = require('sequelize');
const { User } = require("../databaseconn");

const createUser = async (userData) => {
  return await User.create(userData);
};

const getUserById = async (userId) => {
  return await User.findByPk(userId);
};

const getUserByUsername = async (username) => {
  return await User.findOne({ where: { username: username } });
};

const getAllUsers = async () => {
  return await User.findAll();
};

const getUsersPaginated = async (limit, offset, id) => {
  return await User.findAll({
    where: {
      id: {
        [Op.ne]: id,
      },
    },
    limit: limit,
    offset: offset,
    order: [["updatedAt", "DESC"]],
  });
};

const getNumberOfUsers = async () => {
  return await User.count();
};

const updateUser = async (userId, updateData) => {
  const user = await User.findByPk(userId);
  if (user) {
    return await user.update(updateData);
  }
  return null;
};

const deleteUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (user) {
    await user.destroy();
    return true;
  }
  return false;
};

module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
  getAllUsers,
  getUsersPaginated,
  getNumberOfUsers,
  updateUser,
  deleteUser,
};
