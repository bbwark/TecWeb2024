const express = require("express");
const articleService = require("../services/articleService");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const article = await articleService.createArticle(req.body);
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const article = await articleService.getArticleById(req.params.id);
    if (article) {
      res.status(200).json(article);
    } else {
      res.status(404).json({ error: "Article not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const articles = await articleService.getAllArticles();
    res.status(200).json(articles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/recent/:page", async (req, res) => {
  try {
    const page = parseInt(req.params.page, 10) || 1;
    const articles = await articleService.getRecentArticles(page);
    res.status(200).json(articles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/by-tag/:tag/:page", async (req, res) => {
  try {
    const { tag, page } = req.params;
    const articles = await articleService.getRecentArticlesByTag(
      tag,
      parseInt(page, 10)
    );
    res.status(200).json(articles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const article = await articleService.updateArticle(req.params.id, req.body);
    if (article) {
      res.status(200).json(article);
    } else {
      res.status(404).json({ error: "Article not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const success = await articleService.deleteArticle(req.params.id);
    if (success) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: "Article not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
