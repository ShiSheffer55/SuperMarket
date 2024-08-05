//generate a secret key to keep privecy
const crypto = require('crypto');
console.log(crypto.randomBytes(64).toString('hex'));
