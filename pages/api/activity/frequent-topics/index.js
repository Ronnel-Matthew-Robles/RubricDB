import { getFrequentActivities } from '@/api-lib/db';
import { database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const activities = await getFrequentActivities(req.db);
  res.json({ activities });
});

export default handler;