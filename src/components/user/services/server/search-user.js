import UserModel from "@/main/models/user.schema";
import { mapId } from "@/participated/libs/mapId";

export async function searchUser(name) {
  const users = await UserModel.find(
    { $text: { $search: name } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .select("name username email")
    .lean();
  return users.map((user) => mapId(user));
}
