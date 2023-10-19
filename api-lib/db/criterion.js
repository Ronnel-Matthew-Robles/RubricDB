import { ObjectId } from 'mongodb';
import { dbProjectionUsers } from './user';
import { findStatusByName } from './status';

export async function findCriterionById(db, id) {
  const criteria = await db
    .collection('criterias')
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      {
        $lookup: {
          from: 'activities',
          localField: 'activity',
          foreignField: '_id',
          as: 'activity',
        },
      },
      {
        $lookup: {
          from: 'status',
          localField: 'status',
          foreignField: '_id',
          as: 'status',
        },
      },
      {
        $lookup: {
          from: 'remarks',
          localField: 'remarks',
          foreignField: '_id',
          as: 'remarks',
          pipeline: [
            {
              $lookup: {
                from: 'users',
                localField: 'creatorId',
                foreignField: '_id',
                as: 'creator',
              },
            },
            { $unwind: '$creator' },
            { $project: dbProjectionUsers('creator.') },
          ],
        },
      },
      { $unwind: '$creator' },
      { $unwind: '$activity' },
      { $unwind: '$status' },
      { $project: dbProjectionUsers('creator.') },
    ])
    .toArray();
  if (!criteria[0]) return null;
  return criteria[0];
}

export async function findCriteria(db, before, by, limit, statusId) {
  return db
    .collection('criterias')
    .aggregate([
      {
        $match: {
          ...(by && { creatorId: new ObjectId(by) }),
          ...(before && { createdAt: { $lt: before } }),
          ...(statusId && { status: new ObjectId(statusId) }),
        },
      },
      { $sort: { _id: -1 } },
      // { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      {
        $lookup: {
          from: 'activities',
          localField: 'activity',
          foreignField: '_id',
          as: 'activity',
        },
      },
      {
        $lookup: {
          from: 'status',
          localField: 'status',
          foreignField: '_id',
          as: 'status',
        },
      },
      { $unwind: '$creator' },
      { $unwind: '$activity' },
      { $unwind: '$status' },
      {
        $project: dbProjectionUsers('creator.'),
      },
    ])
    .toArray();
}

export async function insertCriterion(
  db,
  { title, c1, c2, c3, c4, creatorId, status, activity }
) {
  const criterion = {
    title,
    c1,
    c2,
    c3,
    c4,
    creatorId,
    status: new ObjectId(status),
    activity: new ObjectId(activity),
    createdAt: new Date(),
  };
  const { insertedId } = await db.collection('criterias').insertOne(criterion);
  criterion._id = insertedId;
  return criterion;
}

export async function approveCriterion(db, id) {
  const status = await findStatusByName(db, 'Approved');
  const { modifiedCount } = await db
    .collection('criterias')
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: new ObjectId(status._id) } }
    );
  return modifiedCount;
}

export async function rejectCriterion(db, id) {
  const status = await findStatusByName(db, 'Rejected');
  const { modifiedCount } = await db
    .collection('criterias')
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: new ObjectId(status._id) } }
    );
  return modifiedCount;
}

export async function addRemarkToCriterion(db, criterionId, remarkId) {
  const { modifiedCount } = await db
    .collection('criterias')
    .updateOne(
      { _id: new ObjectId(criterionId) },
      { $push: { remarks: new ObjectId(remarkId) } }
    );
  return modifiedCount;
}

export async function insertCriterionLog(db, criterionId, userId, statusId) {
  const criterionlog = {
    criterion: new ObjectId(criterionId),
    approvedBy: new ObjectId(userId),
    statusId: new ObjectId(statusId),
    createdAt: new Date(),
  };
  const { insertedId } = await db.collection('criterialogs').insertOne(criterionlog);
  return insertedId;
}