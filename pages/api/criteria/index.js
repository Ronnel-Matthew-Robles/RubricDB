import { ValidateProps } from '@/api-lib/constants';
import {
  findStatusByName,
  findActivityByName,
  insertActivity,
  insertCriterion,
  insertCriterionToActivity
} from '@/api-lib/db';
import { auths, database, validateBody } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

// handler.get(async (req, res) => {
//   const posts = await findPosts(
//     req.db,
//     req.query.before ? new Date(req.query.before) : undefined,
//     req.query.by,
//     req.query.limit ? parseInt(req.query.limit, 10) : undefined
//   );

//   res.json({ posts });
// });

handler.post(...auths, async (req, res) => {
  if (!req.user) {
    return res.status(401).end();
  }

  const pending = await findStatusByName(req.db, 'Pending');

  const data = {
    title: req.body.title,
    c1: req.body.c1,
    c2: req.body.c2,
    c3: req.body.c3,
    c4: req.body.c4,
    creatorId: req.user._id,
    status: pending._id,
    activity: req.body.activity,
  };

  if (req.body.newActivity !== '') {
    // CHECK IF ACTIVITY IS ALREADY IN DB
    const act = await findActivityByName(req.db, req.body.newActivity);

    if (act == null) {
      // INSERT TO DB
      const newActivity = await insertActivity(req.db, req.body.newActivity);
      data.activity = newActivity._id;
    } else {
        data.activity = act._id;
    }
  }

  const criterion = await insertCriterion(req.db, data);

  return res.json({ criterion });
});

export default handler;
