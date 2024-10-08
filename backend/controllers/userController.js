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
    if (error.name === "SequelizeUniqueConstraintError") {
      res
        .status(409)
        .json({
          message:
            "Username già in uso. Per favore, scegli un altro nome utente.",
        });
    } else if (error.name === "SequelizeValidationError") {
      res
        .status(400)
        .json({
          message:
            "Dati non validi. Per favore, controlla i dati inseriti e riprova.",
        });
    } else {
      res
        .status(500)
        .json({
          message:
            "Si è verificato un errore interno. Per favore riprova più tardi.",
        });
    }
  }
});

userController.get("/count", verifyAdmin, async (req, res) => {
  try {
    const count = (await userService.getNumberOfUsers()) - 1;
    res.status(200).json({ count: count });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userController.get("/list/:page/:id", verifyAdmin, async (req, res) => {
  try {
    const page = parseInt(req.params.page, 10) || 1;
    const users = await userService.getUsersPaginated(page, req.params.id);
    users.forEach((user) => {
      user.password = undefined;
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userController.put("/admin/:id", verifyAdmin, async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (user === null) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      req.body.password &&
      !(await bcrypt.compare(req.body.password, user.password))
    ) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
    }

    const userUpdated = await userService.updateUser(req.params.id, req.body);
    userUpdated.password = undefined;
    res.status(200).json(userUpdated);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    res.status(400).json({ message: error.message });
  }
});

userController.put("/:id", verifyAdminOrSelf, async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (user === null) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      req.body.password &&
      !(await bcrypt.compare(req.body.password, user.password))
    ) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
    }

    req.body.isAdmin = user.isAdmin;
    const userUpdated = await userService.updateUser(req.params.id, req.body);
    userUpdated.password = undefined;
    res.status(200).json(userUpdated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userController.delete("/:id", verifyAdminOrSelf, async (req, res) => {
  try {
    const success = await userService.deleteUser(req.params.id);
    if (success) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userController;
