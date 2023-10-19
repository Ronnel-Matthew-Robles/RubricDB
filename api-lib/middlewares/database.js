import { MongoClient } from 'mongodb';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentiatlly
 * during API Route usage.
 * https://github.com/vercel/next.js/pull/17666
 */
global.mongo = global.mongo || {};

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

let indexesCreated = false;
async function createIndexes(db) {
  await Promise.all([
    db
      .collection('tokens')
      .createIndex({ expireAt: -1 }, { expireAfterSeconds: 0 }),
    db
      .collection('posts')
      .createIndexes([{ key: { createdAt: -1 } }, { key: { creatorId: -1 } }]),
    db
      .collection('comments')
      .createIndexes([{ key: { createdAt: -1 } }, { key: { postId: -1 } }]),
    db.collection('users').createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { username: 1 }, unique: true },
    ]),
    db.collection('actions').createIndexes([{ key: { name: -1 } }]),
    db.collection('activities').createIndexes([{ key: { name: -1 } }]),
    db.collection('criterialogs').createIndexes([{ key: { createdAt: -1 } }]),
    db.collection('criterias').createIndexes([{ key: { createdAt: -1 } }]),
    db.collection('departments').createIndexes([{ key: { name: 1 } }]),
    db.collection('keywords').createIndexes([{ key: { name: 1 } }]),
    db.collection('remarks').createIndexes([{ key: { createdAt: -1 } }]),
    db.collection('rubriclogs').createIndexes([{ key: { createdAt: -1 } }]),
    db.collection('rubrics').createIndexes([{ key: { createdAt: -1 } }]),
    db.collection('status').createIndexes([{ key: { name: 1 } }]),
  ]);
  indexesCreated = true;
}

export async function getMongoClient() {
  if (!global.mongo.client) {
    global.mongo.client = new MongoClient(MONGODB_URI);
  }
  // It is okay to call connect() even if it is connected
  // using node-mongodb-native v4 (it will be no-op)
  // See: https://github.com/mongodb/node-mongodb-native/blob/4.0/docs/CHANGES_4.0.0.md
  await global.mongo.client.connect();
  return global.mongo.client;
}

export default async function database(req, res, next) {
  if (!global.mongo.client) {
    global.mongo.client = new MongoClient(MONGODB_URI);
  }
  req.dbClient = await getMongoClient();
  req.db = req.dbClient.db(); // this use the database specified in the MONGODB_URI (after the "/")
  if (!indexesCreated) await createIndexes(req.db);
  return next();
}
