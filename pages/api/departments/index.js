import { ValidateProps } from '@/api-lib/constants';
import { findDepartments } from '@/api-lib/db';
import { auths, database, validateBody } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const departments = await findDepartments(
    req.db
  );

  res.json({ departments });
});

export default handler;