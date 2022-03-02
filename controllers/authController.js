const crypto = require('crypto');
const getRequestData = require('../helpers/get-request-data');
const User = require('../models/authModel');

const {
  successResponse,
  errorResponse,
} = require('../helpers/response-handle');
const { validateUser } = require('../helpers/validation');
const { createToken } = require('../helpers/jwt');
const MongoHandler = require('../db/MongoHandler');

const register = async (req, res) => {
  try {
    const body = await getRequestData(req);

    const userData = JSON.parse(body);

    const validationErrors = validateUser(userData);

    if (validationErrors.length > 0) {
      return errorResponse(res, 400, validationErrors);
    }

    const { username, email, password } = userData;

    const users = await User.find(username, email);

    if (users.length > 0) {
      const isDuplicatedUsername =
        users.filter((u) => u.username === username).length > 0;

      const isDuplicatedEmail =
        users.filter((u) => u.email === email).length > 0;

      if (isDuplicatedUsername && isDuplicatedEmail) {
        return errorResponse(res, 400, [
          'Username and Email address already exist',
        ]);
      }
      if (isDuplicatedUsername) {
        return errorResponse(res, 400, ['Username already exists']);
      }
      if (isDuplicatedEmail) {
        return errorResponse(res, 400, ['Email address already exists']);
      }
    }

    const userId = await User.create(username, email, password);

    return successResponse(res, 200, { userId });
  } catch (error) {
    console.log(error);
    res.writeHead(500, { 'Content-Type': 'application/json' });

    res.end(JSON.stringify({ message: 'Failed to create register' }));
  }
};

const login = async (req, res) => {
  try {
    const body = await getRequestData(req);

    const userData = JSON.parse(body);

    const validationErrors = validateUser(userData);

    if (validationErrors.length > 0) {
      return errorResponse(res, 400, validationErrors);
    }

    const { username, email, password } = userData;

    const users = await User.find(username, email);

    if (users.length === 0) {
      return errorResponse(res, 400, [
        'No User found for provided username and email address',
      ]);
    }

    const foundByUsername =
      users.filter((u) => u.username === username).length > 0;

    const foundByUserEmail = users.filter((u) => u.email === email).length > 0;

    if (foundByUsername && !foundByUserEmail) {
      return errorResponse(res, 400, [
        'No User found for provided email address',
      ]);
    }

    if (foundByUserEmail && !foundByUsername) {
      return errorResponse(res, 400, ['No User found for provided username']);
    }

    const { _id, salt, hash } = users[0];

    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`);

    if (hash !== hashedPassword) {
      return errorResponse(res, 400, ['Incorrect password']);
    }

    const userId = MongoHandler.ObjectIdToString(_id);

    const token = createToken(username, email, userId);

    return successResponse(res, 200, {
      userData: { id: userId, username, email, token },
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, ['Failed to login']);
  }
};

module.exports = {
  register,
  login,
};
