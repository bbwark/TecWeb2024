const express = require("express");
const path = require("path");
const { sequelize, User, Article } = require("./databaseconn");
const userController = require("./controllers/userController");
const articleController = require("./controllers/articleController");

const app = express();

app.use(express.json());
app.use(
  "/static",
  express.static(path.resolve(__dirname, "..", "frontend", "static"))
);

// API endpoints
app.use("/api/users", userController);
app.use("/api/articles", articleController);

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "frontend", "index.html"));
});

const PORT = process.env.PORT || 3000;

//change force:true to alter:true when developing finished
sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
