const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Article = sequelize.define("Article", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Article;
};
