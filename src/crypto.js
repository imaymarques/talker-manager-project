const crypto = require('crypto');

const funcCrypto = () => crypto.randomBytes(8).toString('hex');

module.exports = {
  funcCrypto,
};
