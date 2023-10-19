import { findActivityById, getApprovedCriteriaFromActivityId } from '@/api-lib/db';
import { database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const criteria = await getApprovedCriteriaFromActivityId(req.db, req.query.activityId);
  res.json({ criteria });
});

//   handler.post(async (req, res) => {
//     let { creatorId, criterionId, text  } = req.body;

//     let data = {
//         creatorId,
//         criterionId,
//         text,
//     };
//     const remark = await insertRemark(req.db, data);

//     if (!remark) {
//       res
//         .status(403)
//         .json({ error: { message: 'Failed to add remark.' } });
//       return;
//     }
//     res.json(remark);
//   });

export default handler;
