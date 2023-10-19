export async function findActionByName(db, name) {
    const action = await db
      .collection('actions')
      .aggregate([
        { $match: { name: name } },
        { $limit: 1 },
      ])
      .toArray();
    if (!action[0]) return null;
    return action[0];
  }
  