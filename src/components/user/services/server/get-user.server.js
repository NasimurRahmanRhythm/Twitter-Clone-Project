import UserModel from "@/main/models/user.schema";
import { mapId } from "@/participated/libs/mapId";
export async function getUserByEmail(email) {
  const user = await UserModel.findOne({ email }).lean();
  if (user) return mapId(user);
}

export async function getUserById(id) {
  try {
    const user = await UserModel.findById(id).lean();
    if (user) return mapId(user);
    else throw { status: 404, error: "user not found" };
  } catch (err) {
    console.log("something went wrong in getUserById");
    return { status: 500, error: "something went wrong" };
  }
}

export async function getUser(queryObject) {
  const user = await UserModel.findOne(queryObject).lean();
  if (user) return mapId(user);
}

export async function getUsers() {
  try {
    const users = await UserModel.find({ isVerified: true }).lean();
    return users.map((user) => mapId(user));
  } catch (err) {
    console.log("err in getUser", err);
    throw err;
  }
}
