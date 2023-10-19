import { findUserById, findRubrics } from "@/api-lib/db";
import { database } from "@/api-lib/middlewares";
import { ncOpts } from "@/api-lib/nc";
import nc from "next-connect";

const TimeAgo = require("javascript-time-ago");

// English.
const en = require("javascript-time-ago/locale/en.json");

TimeAgo.addDefaultLocale(en);

// Create formatter (English).
const timeAgo = new TimeAgo("en-US");

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const user = await findUserById(req.db, req.query.userId);
  const rubrics = await findRubrics(req.db, null, user._id);

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
