import { findActionByName } from './action';
import { ObjectId } from 'mongodb';

export async function getQuickStats(db) {
  let today = new Date();
  let yesterday = new Date();
  let sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);
  yesterday.setDate(today.getDate());
  yesterday.setHours(0, 0, 0, 0);
  today.setDate(today.getDate() + 1);
  today.setHours(0, 0, 0, 0);

  const viewAction = await findActionByName(db, 'View');
  const downloadAction = await findActionByName(db, 'Download');

  const rubricLogsViewedSinceYesterday = await db.collection('rubriclogs').find({
    createdAt: {
      $gte: yesterday,
      $lte: today,
    },
    actionId: viewAction._id,
  }).toArray();

  const rubricLogsViewedSinceSevenDaysAgo = await db.collection('rubriclogs').find({
    createdAt: {
      $gte: sevenDaysAgo,
      $lte: today,
    },
    actionId: viewAction._id,
  }).toArray();

  const rubricLogsDownloadedSinceYesterday = await db.collection('rubriclogs').find({
    createdAt: {
      $gte: yesterday,
      $lte: today,
    },
    actionId: new ObjectId(downloadAction._id),
  }).toArray();

  const rubricLogsDownloadedSinceSevenDaysAgo = await db.collection('rubriclogs').find({
    createdAt: {
      $gte: sevenDaysAgo,
      $lte: today,
    },
    actionId: new ObjectId(downloadAction._id),
  }).toArray();

  return {
    rlvy: rubricLogsViewedSinceYesterday,
    rlv7da: rubricLogsViewedSinceSevenDaysAgo,
    rldy: rubricLogsDownloadedSinceYesterday,
    rld7da: rubricLogsDownloadedSinceSevenDaysAgo,
  };
}
