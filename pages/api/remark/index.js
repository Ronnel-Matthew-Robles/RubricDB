import {
    insertRemark
  } from '@/api-lib/db';
  import { database } from '@/api-lib/middlewares';
  import { ncOpts } from '@/api-lib/nc';
  import nc from 'next-connect';
  
  const handler = nc(ncOpts);
  
  handler.use(database);
  
  handler.post(async (req, res) => {
    let { creatorId, itemId, text, type  } = req.body;
  
    let data = {
        creatorId,
        itemId,
        text,
        type,
    };
    const remark = await insertRemark(req.db, data);
    
    if (!remark) {
      res
        .status(403)
        .json({ error: { message: 'Failed to add remark.' } });
      return;
    }
    res.json(remark);
  });
  
  export default handler;
  