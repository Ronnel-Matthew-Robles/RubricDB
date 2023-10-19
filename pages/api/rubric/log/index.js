import { findStatusByName, insertRubricLog } from '@/api-lib/db';
import { auths, database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

handler.post(...auths, async (req, res) => {
  if (!req.user) {
    return res.status(401).end();
  }

  const status = await findStatusByName(req.db, req.body.statusName);

  const isRubricLogAdded = await insertRubricLog(req.db, req.body.rubricId, req.user._id, undefined, status._id);

  const result = { isRubricLogAdded: isRubricLogAdded, status: status.name };

  return res.json({result});
});

export default handler;
