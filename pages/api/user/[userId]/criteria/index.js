import { findUserById, findCriteria } from '@/api-lib/db';
import { database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const user = await findUserById(req.db, req.query.userId);
  const criteria = await findCriteria(req.db, null, user._id);
  res.json({ criteria });
});

export default handler;
