const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('PressPortal', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432
});

const User = require('./models/user')(sequelize);
const Article = require('./models/article')(sequelize);

User.hasMany(Article, { as: 'articles' });
Article.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
    sequelize,
    User,
    Article
};

