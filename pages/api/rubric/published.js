import { findStatusByName, findRubrics, findRubricById, setStatusOfRubric } from "@/api-lib/db";
import { auths, database } from "@/api-lib/middlewares";
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
  const publishedStatus = await findStatusByName(req.db, "Published");
  const rubrics = await findRubrics(req.db, null, null, null, publishedStatus._id + '');

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

handler.post(async (req, res) => {
  let { rubricId } = req.body;
  const rubric = await findRubricById(req.db, rubricId);

  if (!rubric) {
    res
      .status(403)
      .json({ error: { message: 'The rubric is not in database.' } });
    return;
  }

  const updated = await setStatusOfRubric(req.db, rubric._id, "Published");

  res.json({ isPublished: updated});
});

export default handler;
