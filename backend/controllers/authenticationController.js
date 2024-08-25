const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");
const { tokenPrivateKey } = require("../config");

const authenticationController = express.Router();

authenticationController.post("/login", async (req, res) => {
  const user = await userService.getUserByUsername(req.body.username);
  if (user === null) {
    return res.status(404).json({ error: "User not found" });
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const tokenPayload = {
        id: user.id,
        isAdmin: user.isAdmin,
      };
      const accessToken = jwt.sign(tokenPayload, tokenPrivateKey);
      res.json({ accessToken, id: user.id, isAdmin: user.isAdmin });
    } else {
      return res.status(401).send("Invalid password");
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

authenticationController.post("/passwordcheck", async (req, res) => {
  const user = await userService.getUserById(req.body.id);
  if (user === null) {
    return res.status(404).json({ error: "User not found" });
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.json(true);
    } else {
      res.json(false);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = authenticationController;
