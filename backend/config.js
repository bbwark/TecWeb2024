const { randomBytes } = require('crypto');

const config = {
    numberOfArticlesPerPage: 10,
    numberOfUsersPerPage: 10,
}

const tokenPrivateKey = randomBytes(64).toString('hex');

module.exports = {
    config,
    tokenPrivateKey
}