const { verifyToken } = require('./jwt');
const { errorResponse } = require('./response-handle');

const authenticateJWT = (req, res) => {
  const authHeader = req[Object.getOwnPropertySymbols(req)[1]].authorization;
  const token = authHeader ? authHeader.split(' ')[1] : null;
  if (!token || !verifyToken(token)) {
    return errorResponse(res, 401, 'Unauthorized user');
  }
};

module.exports = authenticateJWT;
