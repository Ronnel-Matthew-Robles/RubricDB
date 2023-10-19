import { findActivities } from '@/api-lib/db';
import { getMongoClient } from '@/api-lib/middlewares/database';

export const getActivities = async () => {
  const client = await getMongoClient();
  const db = client.db();

  const res = await findActivities(db);
  const activities = JSON.parse(JSON.stringify(res));

  return activities;
};
