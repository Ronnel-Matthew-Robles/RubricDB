import { findStatusByName, findRubricLog } from "@/api-lib/db";
import { auths, database } from "@/api-lib/middlewares";
import { ncOpts } from "@/api-lib/nc";
import nc from "next-connect";

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const approved = await findStatusByName(req.db, "Approved");
  const rubricLog = await findRubricLog(req.db, req.query.rubricId, approved._id);

  res.json({ rubricLog });
});

export default handler;
