import { findStatusByName, findCriterionById, rejectCriterion, findCriteria } from '@/api-lib/db';
import { database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const status = await findStatusByName(req.db, 'Rejected');
  const criteria = await findCriteria(
    req.db,
    undefined,
    undefined,
    undefined,
    status._id
  );
  res.json({ criteria });
});

handler.post(async (req, res) => {
    let { criterionId } = req.body;
    const criterion = await findCriterionById(req.db, criterionId);
    
    if (!criterion) {
      res
        .status(403)
        .json({ error: { message: 'The criterion is not in database.' } });
      return;
    }
  
  const updated = await rejectCriterion(req.db, criterion._id);
  res.json({ updated });
});

export default handler;
