const jwt = require("jsonwebtoken");
const { tokenPrivateKey } = require("../config");

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
