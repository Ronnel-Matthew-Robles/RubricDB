import { ObjectId } from "mongodb";

export async function findDepartments(db) {
  return db.collection('departments').find({}).toArray();
}

export async function findDepartmentById(db, deptId) {
  return db.collection('departments').findOne({_id: new ObjectId(deptId)});
}