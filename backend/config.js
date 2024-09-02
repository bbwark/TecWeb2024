const { randomBytes } = require('crypto');

const config = {
    numberOfArticlesPerPage: 10,
    numberOfUsersPerPage: 8,
}

const tokenPrivateKey = randomBytes(64).toString('hex');

module.exports = {
    config,
    tokenPrivateKey
}