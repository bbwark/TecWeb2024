const express = require("express");
const articleService = require("../services/articleService");
const { verifyUser, verifyAdminOrOwner } = require("../jwtMiddleware");

const articleController = express.Router();

articleController.get("/count/tag/:tag", async (req, res) => {
  try {
    const count = await articleService.getNumberOfArticlesByTag(req.params.tag);
    res.status(200).json({ count });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

articleController.get("/count/owner/:id", async (req, res) => {
  try {
    const count = await articleService.getNumberOfArticlesByUserId(req.params.id);
    res.status(200).json({ count });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

articleController.get("/count", async (req, res) => {
  try {
    const count = await articleService.getNumberOfArticles();
    res.status(200).json({ count });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

articleController.get("/by-tag/:tag/:page", async (req, res) => {
  try {
    const tag = req.params.tag;
    const page = req.params.page;
    const articles = await articleService.getRecentArticlesByTag(
      tag,
      parseInt(page, 10)
    );
    res.status(200).json(articles);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

articleController.get("/by-user-id/:id/:page", async (req, res) => {
  try {
    const userId = req.params.id;
    const page = req.params.page;
    const articles = await articleService.getRecentArticlesByUserId(
      userId,
      parseInt(page, 10)
    );
    res.status(200).json(articles);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

articleController.get("/recent/:page", async (req, res) => {
  try {
    const page = parseInt(req.params.page, 10) || 1;
    const articles = await articleService.getRecentArticles(page);
    res.status(200).json(articles);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

articleController.get("/:id", async (req, res) => {
  try {
    const article = await articleService.getArticleById(req.params.id);
    if (article) {
      res.status(200).json(article);
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

articleController.get("/", async (req, res) => {
  try {
    const articles = await articleService.getAllArticles();
    res.status(200).json(articles);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

articleController.post("/", verifyUser, async (req, res) => {
  try {
    const article = await articleService.createArticle(req.body);
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

articleController.put("/:id", verifyAdminOrOwner, async (req, res) => {
  try {
    const article = await articleService.updateArticle(req.params.id, req.body);
    if (article) {
      res.status(200).json(article);
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

articleController.delete("/:id", verifyAdminOrOwner, async (req, res) => {
  try {
    const success = await articleService.deleteArticle(req.params.id);
    if (success) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = articleController;
