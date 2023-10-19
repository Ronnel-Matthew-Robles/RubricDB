import { ObjectId } from 'mongodb';
import { addRemarkToCriterion } from './criterion';
import { addRemarkToRubric } from './rubric';

export async function insertRemark(db, { creatorId, itemId, text, type }) {
  // const criterion = await findCriterionById(db, criterionId);

  const remark = {
    creatorId: new ObjectId(creatorId),
    itemId: new ObjectId(itemId),
    text: text,
    createdAt: new Date(),
  };
  const { insertedId } = await db.collection('remarks').insertOne(remark);
  remark._id = insertedId;

  var modifiedCount = 0;

  if (type === "criteria") {
    modifiedCount = await addRemarkToCriterion(
      db,
      itemId,
      remark._id
    );
  } else if (type === "rubric") {
    modifiedCount = await addRemarkToRubric(
      db,
      itemId,
      remark._id
    );
  }
  
  return { remark: remark, addRemarkToItem: modifiedCount, type: type};
}
