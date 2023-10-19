import { findRubricById, findActionByName, insertRubricLog, deleteRubricInActivities, deleteRubricInKeywords, deleteRubricInRubricLogs, deleteRubricById } from '@/api-lib/db';
import { auths, database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const TimeAgo = require('javascript-time-ago');

// English.
const en = require('javascript-time-ago/locale/en.json');

TimeAgo.addDefaultLocale(en);

// Create formatter (English).
const timeAgo = new TimeAgo('en-US');

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const rubric = await findRubricById(req.db, req.query.rubricId);

  const timeAgoText = timeAgo.format(
    new Date().getTime() -
      (new Date().getTime() - new Date(rubric.createdAt).getTime())
  );
  rubric.timeAgoText = timeAgoText;

  res.json({ rubric });
});

handler.delete(async (req, res) => {
  const { rubricId } = req.query;
  try {
    const deletedRubricInActivities = await deleteRubricInActivities(req.db, rubricId);
    const deletedRubricInKeywords = await deleteRubricInKeywords(req.db, rubricId);
    const deletedRubricLogs = await deleteRubricInRubricLogs(req.db, rubricId);
    const deletedRubric = await deleteRubricById(req.db, rubricId);

    if (!deletedRubricInActivities) {
      return res.status(404).json({ message: 'Rubric not found in any activities' });
    }
    if (!deletedRubricInKeywords) {
      return res.status(404).json({ message: 'Rubric not found in any keywords' });
    }
    if (!deletedRubricLogs) {
      return res.status(404).json({ message: 'Rubric logs not found' });
    }
    if (!deletedRubric) {
      return res.status(404).json({ message: 'Rubric not found' });
    }

    return res.status(200).json({ message: 'Rubric deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default handler;
