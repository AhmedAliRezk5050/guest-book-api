const { MongoClient, ObjectId } = require('mongodb');

class MongoHandler {
  constructor() {}

  static Init = async () => {
    const uri =
      'mongodb+srv://ahmed:ahmed1234@cluster0.gs9mp.mongodb.net/node-native';
    const client = new MongoClient(uri);
    await client.connect();

    return client;
  };
  // d
  static GetCollection = (client, collectionName) => {
    return client.db().collection(collectionName);
  };

  static ObjectIdToString = (id) => ObjectId(id).toString();
  static StringIdToObject = (id) => ObjectId(id);
}

module.exports = MongoHandler;
