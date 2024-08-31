const express = require("express");
const path = require("path");
const { sequelize } = require("./databaseconn");
const userController = require("./controllers/userController");
const articleController = require("./controllers/articleController");
const authenticationController = require("./controllers/authenticationController");
const { exec } = require('child_process');

const app = express();

app.use(express.json());
app.use(
  "/static",
  express.static(path.resolve(__dirname, "..", "frontend", "static"))
);

// API endpoints
app.use("/api/users", userController);
app.use("/api/articles", articleController);
app.use("/api/auth", authenticationController);

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "frontend", "index.html"));
});

const tailwindProcess = exec('npm run build-css');

tailwindProcess.stdout.on('data', (data) => {
  console.log(`Tailwind: ${data}`);
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
