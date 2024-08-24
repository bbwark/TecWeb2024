const express = require("express");
const bcrypt = require("bcrypt");
const userService = require("../services/userService");
const e = require("express");

const authenticationController = express.Router();

authenticationController.post("/login", async (req, res) => {
  const user = userService.getUserByUsername(req.body.username);
  if (user === null) {
    return res.status(404).json({ error: "User not found" });
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      return res.status(200).send("Login successful");
    } else {
      return res.status(401).send("Invalid password");
    }
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});

module.exports = authenticationController;
