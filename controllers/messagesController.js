const authenticateJWT = require('../helpers/authenticate-jwt');
const getRequestData = require('../helpers/get-request-data');
const {
  errorResponse,
  successResponse,
} = require('../helpers/response-handle');
const Message = require('../models/messageModel');
const { protectedTrimString } = require('../helpers/validation');
const { _idKeyReplace } = require('../helpers/data-convertions');

const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll();

    if (!messages) {
      return errorResponse(res, 500, ['Failed to fetch messages']);
    }

    return successResponse(res, 200, {
      messages: messages.map((message) => _idKeyReplace(message)),
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, ['Failed to fetch messages']);
  }
};

const getMessage = async (req, res, id) => {
  try {
    const message = await Message.findById(id);

    if (!message) {
      return errorResponse(res, 404, ['Message not found']);
    }
    return successResponse(res, 200, { message: _idKeyReplace(message) });
  } catch (error) {
    console.log(error);
    return errorResponse(res, 404, ['Failed to get message']);
  }
};

const createMessage = async (req, res) => {
  try {
    authenticateJWT(req, res);

    const body = await getRequestData(req);

    const { username, content } = JSON.parse(body);

    if (!username || !content) {
      return errorResponse(res, 400, [
        'Failed to create message -- missing values',
      ]);
    }

    const message = {
      username,
      content,
      replies: [],
      creationDate: Date.now(),
      lastUpdateDate: null,
    };

    const newMessageId = await Message.create(message);

    if (!newMessageId) {
      return errorResponse(res, 500, ['Failed to create message']);
    }
    console.log(newMessageId);
    return successResponse(res, 201, { newMessageId });
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, ['Failed to create message']);
  }
};

const updateMessage = async (req, res, id) => {
  try {
    authenticateJWT(req, res);

    const body = await getRequestData(req);

    const { username, content, reply } = JSON.parse(body);

    if (!protectedTrimString(username) || !protectedTrimString(content)) {
      return errorResponse(res, 400, [
        'Failed to update product -- missing values',
      ]);
    }

    const updatedMessageId = await Message.update(id, username, content, reply);

    if (!updatedMessageId) {
      return errorResponse(res, 500, ['Failed to update message']);
    }

    return successResponse(res, 200, { updatedMessageId });
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, ['Failed to update message']);
  }
};

const deleteMessage = async (req, res, id) => {
  try {
    authenticateJWT(req, res);

    const body = await getRequestData(req);

    const { username } = JSON.parse(body);

    if (!protectedTrimString(username)) {
      return errorResponse(res, 400, [
        'Failed to delete message -- missing values',
      ]);
    }

    const deletedMessageId = await Message.remove(id, username);

    if (!deletedMessageId) {
      return errorResponse(res, 500, ['Failed to delete message']);
    }

    return successResponse(res, 200, { deletedMessageId });
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, ['Failed to delete message']);
  }
};

module.exports = {
  getMessages,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage,
};
