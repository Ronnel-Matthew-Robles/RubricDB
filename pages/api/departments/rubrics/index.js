import {
  findLatestRubricsInSameDepartment
} from '@/api-lib/db';
import { auths, database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo('en-US');


const handler = nc(ncOpts);

handler.use(database);

handler.post(async (req, res) => {
  const {deptId, userId, limit} = req.body;
  const rubrics = await findLatestRubricsInSameDepartment(
    req.db,
    deptId,
    userId,
    limit
  );

  const rubricsWithTextAgo = [];
  for (let rubric of rubrics) {
    const timeAgoText = timeAgo.format(
      new Date().getTime() -
        (new Date().getTime() - new Date(rubric.createdAt).getTime())
    );
    const newRubric = rubric;
    newRubric.timeAgoText = timeAgoText;
    rubricsWithTextAgo.push(newRubric);
  }

  res.json({ rubrics: rubricsWithTextAgo });
});

export default handler;
