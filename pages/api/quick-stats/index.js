import { getQuickStats } from '@/api-lib/db';
import { auths, database, validateBody } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const quickStats = await getQuickStats(
    req.db
  );

  res.json({ quickStats });
});

export default handler;