const express = require("express");
const userService = require("../services/userService");

const userController = express.Router();

userController.post("/", async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userController.get("/:id", async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userController.get("/", async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userController.get("/list/:page", async (req, res) => {
  try {
    const page = parseInt(req.params.page, 10) || 1;
    const users = await userService.getUsersPaginated(page);
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userController.put("/:id", async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userController.delete("/:id", async (req, res) => {
  try {
    const success = await userService.deleteUser(req.params.id);
    if (success) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = userController;