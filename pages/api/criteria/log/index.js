import { findStatusByName, insertCriterionLog } from '@/api-lib/db';
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

  const status = await findStatusByName(req.db, req.body.statusName);

  const isCriterionLogAdded = await insertCriterionLog(req.db, req.body.criterionId, req.user._id, status._id);

  const result = { isCriterionLogAdded: isCriterionLogAdded, status: status.name };

  return res.json({result});
});

export default handler;
