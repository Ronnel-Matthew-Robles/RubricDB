import { ObjectId } from "mongodb";

export async function findActivities(db) {
  return db.collection('activities').find({}).toArray();
}

export async function findActivityByName(db, activityName) {
  return db.collection('activities').findOne({name: activityName});
}

export async function findActivityById(db, activityId) {
  return db.collection('activities').findOne({_id: new ObjectId(activityId)});
}

export async function insertActivity(db, name) {
  const activity = {
    name,
    criteria: [],
    rubrics: [],
  };
  const { insertedId } = await db.collection('activities').insertOne(activity);
  activity._id = insertedId;
  return activity;
}

export async function insertCriterionToActivity(db, activityId, criterionId) {
  const {modifiedCount} = await db.collection('activities').updateOne(
    { _id: new ObjectId(activityId) },
    { $push: { criteria: new ObjectId(criterionId) } }
  );
  return modifiedCount;
}

export async function getApprovedCriteriaFromActivityId(db, activityId) {
  const activities = await db
    .collection('activities')
    .aggregate([
      {
        $match: {
          ...({ _id: new ObjectId(activityId) }),
        },
      },
      {
        $lookup: {
          from: 'criterias',
          localField: 'criteria',
          foreignField: '_id',
          as: 'criteria',
        },
      },
      {
        $unwind: '$criteria',
      },
      {
        $lookup: {
          from: 'users',
          let: { creatorId: '$criteria.creatorId' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', '$$creatorId'] },
              },
            },
            {
              $project: {
                _id: 0,
                name: 1,
              },
            },
          ],
          as: 'criteria.creator',
        },
      },
      {
        $group: {
          _id: '$_id',
          criteria: { $push: '$criteria' },
        },
      },
    ])
    .toArray();

    if (!activities[0]) return null;
  return activities[0].criteria;
}

export async function getFrequentActivities(db) {
  const activities = await db.collection('activities').aggregate([
    {
      $project: {
        name: 1,
        criterias: 1,
        rubrics: 1,
        timesUsed: {
          $size: "$rubrics",
        },
      },
    },
    {
      $sort: {
        timesUsed: -1,
      },
    },
    {
      $limit: 10,
    },
  ]).toArray();
  if (!activities[0]) return null;
  return activities;
}
