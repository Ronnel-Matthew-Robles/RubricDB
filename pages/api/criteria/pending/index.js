import { findCriteria, findStatusByName } from '@/api-lib/db';
import { database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const status = await findStatusByName(req.db, 'Pending');
  const criteria = await findCriteria(
    req.db,
    undefined,
    undefined,
    undefined,
    status._id
  );
  res.json({ criteria });
});

export default handler;
