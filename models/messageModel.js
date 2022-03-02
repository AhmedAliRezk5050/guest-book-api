const { ObjectId } = require('mongodb');
const MongoHandler = require('../db/MongoHandler');

const findAll = async () => {
  let client;
  let messages;
  try {
    client = await MongoHandler.Init();

    const messagesCollection = MongoHandler.GetCollection(client, 'messages');

    messages = await (
      await messagesCollection.find().sort({ _id: -1 })
    ).toArray();
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }

  return messages;
};

const findById = async (id) => {
  let message;
  let client;
  try {
    client = await MongoHandler.Init();

    const messagesCollection = MongoHandler.GetCollection(client, 'messages');

    message = await messagesCollection.findOne({
      _id: MongoHandler.StringIdToObject(id),
    });
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }

  if (!message) {
    return null;
  }
  return message;
};

const create = async (message) => {
  let client;
  let messageId;
  try {
    client = await MongoHandler.Init();

    const messagesCollection = MongoHandler.GetCollection(client, 'messages');

    const { insertedId } = await messagesCollection.insertOne(message);

    messageId = insertedId;
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
  return MongoHandler.ObjectIdToString(messageId);
};

const update = async (messageId, username, content, reply) => {
  let client;
  let updatingResult;
  try {
    client = await MongoHandler.Init();

    const messagesCollection = MongoHandler.GetCollection(client, 'messages');

    let replyInfo;
    if (reply) {
      replyInfo = { id: ObjectId(), ...reply, creationDate: Date.now() };
      console.log(replyInfo);
      updatingResult = await messagesCollection.updateOne(
        { _id: MongoHandler.StringIdToObject(messageId), username },
        {
          $set: { content, lastUpdateDate: Date.now() },
          $push: { replies: replyInfo },
        },
      );
    } else {
      updatingResult = await messagesCollection.updateOne(
        { _id: MongoHandler.StringIdToObject(messageId), username },
        {
          $set: { content, lastUpdateDate: Date.now() },
        },
      );
    }
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
  return updatingResult && updatingResult.matchedCount ? messageId : null;
};

const remove = async (id, username) => {
  let client;
  let deletionResult;
  try {
    client = await MongoHandler.Init();

    const messagesCollection = MongoHandler.GetCollection(client, 'messages');

    deletionResult = await messagesCollection.deleteOne({
      _id: MongoHandler.StringIdToObject(id),
      username,
    });
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
  return deletionResult && deletionResult.deletedCount ? id : null;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
