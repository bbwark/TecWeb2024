const userCrud = require('../crud/userCrud');

const createUser = async (userData) => {
    return await userCrud.createUser(userData);
};

const getUserById = async (userId) => {
    return await userCrud.getUserById(userId);
};

const getAllUsers = async () => {
    return await userCrud.getAllUsers();
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
    getAllUsers,
    updateUser,
    deleteUser
};
