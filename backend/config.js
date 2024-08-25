const { randomBytes } = require('crypto');

const config = {
    pagingNumber: 10
}

const tokenPrivateKey = randomBytes(64).toString('hex');

module.exports = {
    config,
    tokenPrivateKey
}