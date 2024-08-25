crypto = require('crypto');

const config = {
    pagingNumber: 10
}

// This is the private key used to sign the JWTs, it should be changed for deployment
const tokenPrivateKey = crypto.randomBytes(64).toString('hex');

module.exports = {
    config,
    tokenPrivateKey
}