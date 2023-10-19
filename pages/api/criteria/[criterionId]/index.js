import {
  findCriterionById
} from '@/api-lib/db';
import { auths, database, validateBody } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const criterion = await findCriterionById(
    req.db,
    req.query.criterionId
  );
    // console.log(req.query);
  res.json({ criterion });
});

export default handler;
