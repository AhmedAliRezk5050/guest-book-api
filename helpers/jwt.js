const crypto = require('crypto');

const fs = require('fs');

const path = require('path');

class Base64 {
  static B64StringToBase64Url = (string) => {
    let buff = new Buffer.from(string);
    return Base64.ToBase64Url(buff.toString('base64'));
  };
  static ToBase64Url = (b64string) => {
    return b64string.replace(/[=+/]/g, (charToBeReplaced) => {
      switch (charToBeReplaced) {
        case '=':
          return '';
        case '+':
          return '-';
        case '/':
          return '_';
      }
    });
  };
  static Decode = (data) => {
    let buff = new Buffer.from(data, 'base64');
    return JSON.parse(buff.toString('ascii'));
  };
}

const createToken = (username, email, userId) => {
  const headerObj = {
    alg: 'RS256',
    typ: 'JWT',
  };
  const payloadObj = {
    username,
    email,
    userId,
  };

  const signatureFunction = crypto.createSign('RSA-SHA256');

  const headerObjString = JSON.stringify(headerObj);
  const payloadObjString = JSON.stringify(payloadObj);

  const base64UrlHeader = Base64.B64StringToBase64Url(headerObjString);
  const base64UrlPayload = Base64.B64StringToBase64Url(payloadObjString);

  signatureFunction.write(base64UrlHeader + '.' + base64UrlPayload);
  signatureFunction.end();

  // The private key without line breaks
  const PRIV_KEY_URL = path.join(process.cwd(), 'id_rsa_priv.pem');
  const PRIV_KEY = fs.readFileSync(PRIV_KEY_URL, 'utf8');
  // Will sign our data and return Base64 signature (not the same as Base64Url!)
  const signatureBase64 = signatureFunction.sign(PRIV_KEY, 'base64');

  const signatureBase64Url = Base64.ToBase64Url(signatureBase64);
  return base64UrlHeader + '.' + base64UrlPayload + '.' + signatureBase64Url;
};

const verifyToken = (jwt) => {
  const verifyFunction = crypto.createVerify('RSA-SHA256');
  const PUB_KEY_URL = path.join(process.cwd(), 'id_rsa_pub.pem');
  const PUB_KEY = fs.readFileSync(PUB_KEY_URL, 'utf8');
  const jwtHeader = jwt.split('.')[0];
  const jwtPayload = jwt.split('.')[1];
  const jwtSignature = jwt.split('.')[2];
  verifyFunction.write(jwtHeader + '.' + jwtPayload);
  verifyFunction.end();
  const jwtSignatureBase64 = Base64.ToBase64Url(jwtSignature);
  return verifyFunction.verify(PUB_KEY, jwtSignatureBase64, 'base64');
};

const getDataFromJwt = (jwt) => {
  const jwtParts = jwt.split('.');
  const payloadInBase64UrlFormat = jwtParts[1];
  return Base64.Decode(payloadInBase64UrlFormat);
};

module.exports = {
  createToken,
  verifyToken,
  getDataFromJwt,
};
