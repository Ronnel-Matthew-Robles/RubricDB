import { findActionByName, insertRubricLog, addViewToRubric, addDownloadToRubric } from '@/api-lib/db';
import { auths, database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

// handler.get(async (req, res) => {
//   const rubric = await findRubricById(req.db, req.query.rubricId);

//   const timeAgoText = timeAgo.format(
//     new Date().getTime() -
//       (new Date().getTime() - new Date(rubric.createdAt).getTime())
//   );
//   rubric.timeAgoText = timeAgoText;

//   const action = await findActionByName(req.db, "View");

//   const isRubricLogAdded = await insertRubricLog(req.db, rubric._id, )

//   res.json({ rubric });
// });

handler.post(...auths, async (req, res) => {
  if (!req.user) {
    return res.status(401).end();
  }

  const action = await findActionByName(req.db, req.body.actionName);

  const isRubricLogAdded = await insertRubricLog(req.db, req.body.rubricId, req.user._id, action._id);

  const result = { isRubricLogAdded: isRubricLogAdded, action: action };

  if (req.body.actionName == "View") {
      const isViewAdded = await addViewToRubric(req.db, req.body.rubricId);
      result.isViewAdded = isViewAdded;
  }

  if (req.body.actionName == "Download") {
      const isDownloadAdded = await addDownloadToRubric(req.db, req.body.rubricId);
      result.isDownloadAdded = isDownloadAdded;
  }

  return res.json({result});
});

export default handler;
