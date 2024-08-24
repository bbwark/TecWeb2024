const config = {
    pagingNumber: 10
}

// This is the private key used to sign the JWTs, it should be changed for deployment
const tokenPrivateKey = "5af331f690becdec832639fd5a7a92eb1f2f79b4be02e2a0b15af521f2e656d0f5567aa8345c6d4eba432cff6dc445419e709e392fe8c2b3669501cc38f177dd"

module.exports = {
    config,
    tokenPrivateKey
}