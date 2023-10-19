import { ObjectId } from 'mongodb';
import { dbProjectionUsers } from './user';

export async function findStatusByName(db, name) {
  const status = await db
    .collection('status')
    .aggregate([
      { $match: { name: name } },
      { $limit: 1 },
    ])
    .toArray();
  if (!status[0]) return null;
  return status[0];
}
