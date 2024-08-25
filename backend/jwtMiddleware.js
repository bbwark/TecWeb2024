const jwt = require("jsonwebtoken");
const { tokenPrivateKey } = require("./config");

function verifyAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No Token Provided" });
  }

  jwt.verify(token, tokenPrivateKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: Invalid Token" });
    }

    if (!user.isAdmin) {
      return res
        .status(403)
        .json({ error: "Forbidden: Admin Access Required" });
    }

    req.user = user;
    next();
  });
}

function verifyUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No Token Provided" });
  }

  jwt.verify(token, tokenPrivateKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: Invalid Token" });
    }

    req.user = user;
    next();
  });
}

function verifyAdminOrSelf(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No Token Provided" });
  }

  jwt.verify(token, tokenPrivateKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: Invalid Token" });
    }

    if (user.isAdmin) {
      return next();
    }

    if (user.id === parseInt(req.params.id, 10)) {
      return next();
    }

    return res.status(403).json({ error: "Forbidden: Invalid User" });
  });
}

function verifySelf(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No Token Provided" });
  }

  jwt.verify(token, tokenPrivateKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: Invalid Token" });
    }

    if (user.id === parseInt(req.body.id, 10)) {
      return next();
    }

    return res.status(403).json({ error: "Forbidden: Invalid User" });
  });
}

async function verifyAdminOrOwner(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No Token Provided" });
  }

  try {
    const user = jwt.verify(token, tokenPrivateKey);

    if (user.isAdmin) {
      return next();
    }

    const article = await articleService.getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    if (article.userId === user.id) {
      return next();
    } else {
      return res.status(403).json({ error: "Forbidden: Invalid User" });
    }
  } catch (error) {
    return res.status(403).json({ error: "Forbidden: Invalid Token" });
  }
}

module.exports = {
  verifyAdmin,
  verifyUser,
  verifyAdminOrSelf,
  verifySelf,
  verifyAdminOrOwner,
};
