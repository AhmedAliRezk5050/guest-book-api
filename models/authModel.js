const MongoHandler = require('../db/MongoHandler');
const crypto = require('crypto');
const { protectedTrimString } = require('../helpers/validation');

const create = async (username, email, password) => {
  let client;
  let userId;
  try {
    client = await MongoHandler.Init();

    const usersCollection = MongoHandler.GetCollection(client, 'users');

    const salt = crypto.randomBytes(16).toString('hex');

    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`);

    const user = { username, email, salt, hash };

    const { insertedId } = await usersCollection.insertOne(user);
    userId = MongoHandler.ObjectIdToString(insertedId);
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
  return userId;
};

const find = async (username, email) => {
  let users;
  let client;
  try {
    client = await MongoHandler.Init();

    const usersCollection = MongoHandler.GetCollection(client, 'users');

    users = await (await usersCollection.find({ email })).toArray();
    users.push(...(await (await usersCollection.find({ username })).toArray()));
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }

  return users ? users : [];
};

const findByUsername = async (username) => {
  let user;
  let client;
  try {
    client = await MongoHandler.Init();

    const usersCollection = MongoHandler.GetCollection(client, 'users');

    if (!protectedTrimString(username)) {
      return null;
    }

    user = await usersCollection.findOne({
      username,
    });
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }

  return user;
};

module.exports = {
  create,
  find,
  findByUsername,
};
