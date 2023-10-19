import {
  findStatusByName,
  findRubrics,
  insertRubric,
  insertRubricToActivity,
  deleteRubricById,
  deleteRubricInActivities,
  deleteRubricInKeywords,
  deleteRubricInRubricLogs
} from '@/api-lib/db';
import { auths, database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo('en-US');


const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const rubrics = await findRubrics(
    req.db,
  );

  const rubricsWithTextAgo = [];
  for (let rubric of rubrics) {
    const timeAgoText = timeAgo.format(
      new Date().getTime() -
        (new Date().getTime() - new Date(rubric.createdAt).getTime())
    );
    const newRubric = rubric;
    newRubric.timeAgoText = timeAgoText;
    rubricsWithTextAgo.push(newRubric);
  }

  res.json({ rubrics: rubricsWithTextAgo });
});

handler.post(...auths, async (req, res) => {
  if (!req.user) {
    return res.status(401).end();
  }

  const unpublished = await findStatusByName(req.db, 'Unpublished');

  const data = {
    creatorId: req.user._id,
    title: req.body.data.title,
    activityId: req.body.data.activity,
    statusId: unpublished._id,
    criteria: req.body.data.criteria,
    category_names: req.body.data.category_names,
    instructions: req.body.data.instructions
  };

  const rubric = await insertRubric(req.db, data);

  const isAdded = await insertRubricToActivity(req.db, rubric._id, req.body.data.activity);

  return res.json({ rubric });
});

handler.delete(async (req, res) => {
  const { rubricId } = req.body;
  try {
    const deletedRubricInActivities = await deleteRubricInActivities(req.db, rubricId);
    const deletedRubricInKeywords = await deleteRubricInKeywords(req.db, rubricId);
    const deletedRubricLogs = await deleteRubricInRubricLogs(req.db, rubricId);
    const deletedRubric = await deleteRubricById(req.db, rubricId);

    if (!deletedRubric) {
      return res.status(404).json({ message: 'Rubric not found' });
    }
    if (!deletedRubricInActivities) {
      return res.status(404).json({ message: 'Rubric not found in any activities' });
    }
    if (!deletedRubricInKeywords) {
      return res.status(404).json({ message: 'Rubric not found in any keywords' });
    }
    if (!deletedRubricLogs) {
      return res.status(404).json({ message: 'Rubric logs not found' });
    }

    return res.status(200).json({ message: 'Rubric deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default handler;
