const express = require("express");
const bcrypt = require("bcrypt");
const userService = require("../services/userService");
const { verifyAdmin, verifyAdminOrSelf } = require("../jwtMiddleware");

const userController = express.Router();

userController.post("/", verifyAdmin, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const user = await userService.createUser(req.body);
    user.password = undefined;
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userController.get("/count", verifyAdmin, async (req, res) => {
  try {
    const count = await userService.getNumberOfUsers();
    res.status(200).json({ count: count });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userController.get("/list/:page", verifyAdmin, async (req, res) => {
  try {
    const page = parseInt(req.params.page, 10) || 1;
    const users = await userService.getUsersPaginated(page);
    users.forEach((user) => {
      user.password = undefined;
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userController.get("/:id", async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (user) {
      user.password = undefined;
      user.username = undefined;
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userController.get("/", verifyAdmin, async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    users.forEach((user) => {
      user.password = undefined;
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userController.put("/:id", verifyAdminOrSelf, async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (user === null) {
      return res.status(404).json({ error: "User not found" });
    }

    if (req.body.password && !(await bcrypt.compare(req.body.password, user.password))) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
    }

    const userUpdated = await userService.updateUser(req.params.id, req.body);
    userUpdated.password = undefined;
    res.status(200).json(userUpdated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userController.delete("/:id", verifyAdminOrSelf, async (req, res) => {
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
