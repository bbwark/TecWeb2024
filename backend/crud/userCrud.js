const { User } = require("../databaseconn");

const createUser = async (userData) => {
  return await User.create(userData);
};

const getUserById = async (userId) => {
  return await User.findByPk(userId);
};

const getAllUsers = async () => {
  return await User.findAll();
};

const getUsersPaginated = async (limit, offset) => {
  return await User.findAll({
    limit: limit,
    offset: offset,
    order: [["updatedAt", "DESC"]],
  });
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
  getAllUsers,
  getUsersPaginated,
  updateUser,
  deleteUser,
};
