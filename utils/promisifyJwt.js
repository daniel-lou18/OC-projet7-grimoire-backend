const jwt = require("jsonwebtoken");

exports.promisifiedSign = function (payload, secretKey, options) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretKey, options, (err, decodedToken) => {
      if (err) reject(err);
      else resolve(decodedToken);
    });
  });
};

exports.promisifiedVerify = function (token, secretKey) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    });
  });
};
