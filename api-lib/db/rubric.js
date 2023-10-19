import { ObjectId } from "mongodb";
import { findCriterionById } from "./criterion";
import { findStatusByName } from "./status";
import { dbProjectionUsers } from "./user";

import keyword_extractor from "keyword-extractor";

export async function findRubricById(db, id) {
  const rubrics = await db
    .collection("rubrics")
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $limit: 1 },
      {
        $lookup: {
          from: "users",
          localField: "creatorId",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $lookup: {
          from: "activities",
          localField: "activity",
          foreignField: "_id",
          as: "activity",
        },
      },
      {
        $lookup: {
          from: "status",
          localField: "status",
          foreignField: "_id",
          as: "status",
        },
      },
      {
        $lookup: {
          from: "criterias",
          localField: "criteria.criteria",
          foreignField: "_id",
          as: "fetchedCriteria",
          pipeline: [
            {
              $project: {
                title: 1,
                c4: 1,
                c3: 1,
                c2: 1,
                c1: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "remarks",
          localField: "remarks",
          foreignField: "_id",
          as: "remarks",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "creatorId",
                foreignField: "_id",
                as: "creator",
              },
            },
            { $unwind: "$creator" },
            { $project: dbProjectionUsers("creator.") },
          ],
        },
      },
      { $unwind: "$creator" },
      { $unwind: "$activity" },
      { $unwind: "$status" },
      { $project: dbProjectionUsers("creator.") },
    ])
    .toArray();
  if (!rubrics[0]) return null;

  for (let rubric of rubrics) {
    const newCriteria = [];
    const criteria = rubric.criteria;
    for (let criterion of criteria) {
      for (let crit of rubric.fetchedCriteria) {
        if (criterion.criteria.toString() == crit._id) {
          newCriteria.push({
            criteria: crit,
            new_name: criterion.new_name,
            weight: criterion.weight,
          });
        }
      }
    }
    rubric.criteria = newCriteria;
    rubric.fetchedCriteria = undefined;
  }

  return rubrics[0];
}

export async function findRubrics(db, before, by, limit, statusId) {
  const rubrics = await db
    .collection("rubrics")
    .aggregate([
      {
        $match: {
          ...(by && { creatorId: new ObjectId(by) }),
          ...(before && { createdAt: { $lt: before } }),
          ...(statusId && { status: new ObjectId(statusId) }),
        },
      },
      { $sort: { views: -1 } },
      // { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "creatorId",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $lookup: {
          from: "activities",
          localField: "activity",
          foreignField: "_id",
          as: "activity",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "status",
          localField: "status",
          foreignField: "_id",
          as: "status",
        },
      },
      {
        $lookup: {
          from: "criterias",
          localField: "criteria.criteria",
          foreignField: "_id",
          as: "fetchedCriteria",
          pipeline: [
            {
              $project: {
                title: 1,
                c4: 1,
                c3: 1,
                c2: 1,
                c1: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "remarks",
          localField: "remarks",
          foreignField: "_id",
          as: "remarks",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "creatorId",
                foreignField: "_id",
                as: "creator",
              },
            },
            { $unwind: "$creator" },
            { $project: dbProjectionUsers("creator.") },
          ],
        },
      },
      { $unwind: "$creator" },
      { $unwind: "$activity" },
      { $unwind: "$status" },
      {
        $project: dbProjectionUsers("creator."),
      },
    ])
    .toArray();

  for (let rubric of rubrics) {
    const newCriteria = [];
    const criteria = rubric.criteria;
    for (let criterion of criteria) {
      for (let crit of rubric.fetchedCriteria) {
        if (criterion.criteria.toString() == crit._id) {
          newCriteria.push({
            criteria: crit,
            new_name: criterion.new_name,
            weight: criterion.weight,
          });
        }
      }
    }
    rubric.criteria = newCriteria;
    rubric.fetchedCriteria = undefined;
  }

  return rubrics;
}

export async function insertRubric(
  db,
  {
    creatorId,
    title,
    activityId,
    instructions,
    statusId,
    criteria,
    category_names,
  }
) {
  try {
    const criterias = criteria.map((criterion) => {
      return {
        criteria: new ObjectId(criterion.criteria),
        new_name: criterion.new_name,
        weight: criterion.weight ? criterion.weight : undefined,
      };
    });

    const categoryNames = [];
    for (let i = 0; i < category_names.length; i++) {
      if (category_names[i] == "") {
        categoryNames.push(i + 1 + "");
      } else {
        categoryNames.push(category_names[i]);
      }
    }

    const keywords = generateKeywords(title);

    const final_keywords = [];

    for (let keyword of keywords) {
      const filter = {
        name: keyword,
      };

      const update = { $setOnInsert: { name: keyword } };

      const options = {
        upsert: true,
        new: true,
        runValidators: true,
      };
      const k = await db
        .collection("keywords")
        .findOneAndUpdate(filter, update, options);
      final_keywords.push(k.value._id);
    }

    const rubric = {
      creatorId: new ObjectId(creatorId),
      title,
      activity: new ObjectId(activityId),
      instructions: instructions,
      status: new ObjectId(statusId),
      criteria: criterias,
      category_names: categoryNames,
      createdAt: new Date(),
      keywords: final_keywords,
      views: 0,
      downloads: 0,
      isActive: true
    };

    const { insertedId } = await db.collection("rubrics").insertOne(rubric);
    rubric._id = insertedId;

    for (let keyword of final_keywords) {
      await insertRubricToKeyword(db, insertedId, keyword);
    }

    const fetchedCriteria = [];
    for (let criterion of rubric.criteria) {
      const c = await findCriterionById(db, criterion.criteria);
      fetchedCriteria.push({
        new_name: criterion.new_name,
        criteria: c,
        weight: criterion.weight ? criterion.weight : undefined,
      });
    }
    rubric.criteria = fetchedCriteria;

    return rubric;
  } catch (e) {
    console.log(e);
  }
}

export async function insertRubricToKeyword(db, rubricId, keywordId) {
  const { modifiedCount } = db
    .collection("keywords")
    .updateOne(
      { _id: new ObjectId(keywordId) },
      { $push: { rubrics: new ObjectId(rubricId) } }
    );
}

export async function insertRubricToActivity(db, rubricId, activityId) {
  const { modifiedCount } = db
    .collection("activities")
    .updateOne(
      { _id: new ObjectId(activityId) },
      { $push: { rubrics: new ObjectId(rubricId) } }
    );
  return modifiedCount;
}

const generateKeywords = (title) => {
  return keyword_extractor.extract(title, {
    language: "english",
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  });
};

export async function insertRubricLog(
  db,
  rubricId,
  userId,
  actionId,
  statusId
) {
  const rubriclog = {
    rubric: new ObjectId(rubricId),
    userId: new ObjectId(userId),
    actionId: actionId ? new ObjectId(actionId) : undefined,
    statusId: statusId ? new ObjectId(statusId) : undefined,
    createdAt: new Date(),
  };
  const { insertedId } = await db.collection("rubriclogs").insertOne(rubriclog);
  return insertedId;
}

export async function setStatusOfRubric(db, id, statusName) {
  const status = await findStatusByName(db, statusName);
  const { modifiedCount } = await db
    .collection("rubrics")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: new ObjectId(status._id) } }
    );
  return modifiedCount;
}

export async function addRemarkToRubric(db, rubricId, remarkId) {
  const { modifiedCount } = await db
    .collection("rubrics")
    .updateOne(
      { _id: new ObjectId(rubricId) },
      { $push: { remarks: new ObjectId(remarkId) } }
    );
  return modifiedCount;
}

export async function addViewToRubric(db, id) {
  const { modifiedCount } = await db
    .collection("rubrics")
    .updateOne({ _id: new ObjectId(id) }, { $inc: { views: 1 } });
  return modifiedCount;
}

export async function addDownloadToRubric(db, id) {
  const { modifiedCount } = await db
    .collection("rubrics")
    .updateOne({ _id: new ObjectId(id) }, { $inc: { downloads: 1 } });
  return modifiedCount;
}

export async function findRubricLog(db, rubricId, statusId) {
  const rubricLogs = await db
    .collection("rubriclogs")
    .aggregate([
      {
        $match: {
          rubric: new ObjectId(rubricId),
          statusId: new ObjectId(statusId),
        },
      },
      { $limit: 1 },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "approver",
        },
      },
      {
        $lookup: {
          from: "status",
          localField: "statusId",
          foreignField: "_id",
          as: "status",
        },
      },
      { $unwind: "$status" },
      { $unwind: "$approver" },
      { $project: dbProjectionUsers("approver.") },
    ])
    .toArray();
  if (!rubricLogs[0]) return null;

  return rubricLogs[0];
}

export async function deleteRubricInKeywords(db, id) {
  console.log('deleting rubric in keywords', id);
  return await db.collection('keywords').updateMany(
    {rubrics: new ObjectId(id)},
    {$pull: {rubrics: new ObjectId(id)}}
  );
}

export async function deleteRubricInActivities(db, id) {
  console.log('deleting rubric in activities', id)
  return await db.collection('activities').updateMany(
    {rubrics: new ObjectId(id)},
    {$pull: {rubrics: new ObjectId(id)}}
  );
}

export async function deleteRubricInRubricLogs(db, id) {
  console.log('deleting rubric logs', id)
  return await db
  .collection('rubricLogs')
  .deleteMany({ rubric: new ObjectId(id) });
}

export async function deleteRubricById(db, id) {
  console.log('deleting rubric ', id)
  return await db
    .collection('rubrics')
    .deleteOne({ _id: new ObjectId(id) });
}

export async function findLatestRubricsInSameDepartment(db, deptId, userId, limit) {

  const rubrics = await db
    .collection('rubrics')
    .aggregate([
      {
        $lookup: {
          from: "users",
          localField: "creatorId",
          foreignField: "_id",
          as: "user"
        }
      }, {
        $unwind: {
          path: "$user"
        }
      }, {
        $lookup: {
          from: "departments",
          localField: "user.department",
          foreignField: "_id",
          as: "department"
        }
      }, {
        $unwind: {
          path: "$department"
        }
      }, {
        $match: {
          'department._id': new ObjectId(deptId),
          'user._id': { $ne: new ObjectId(userId) },
        }
      }, {
        $group: {
          _id: "$creatorId",
          name: {
            $first: "$user.name"
          },
          title: {
            $first: "$title"
          },
          createdAt: {
            $first: "$createdAt"
          },
          department: {
            $first: "$department.abbv"
          }
        }
      }, {
        $sort: {
          createdAt: -1
        }
      },
      { $limit: limit ? limit : 10 },
    ])
    .toArray();

  return rubrics;
}
