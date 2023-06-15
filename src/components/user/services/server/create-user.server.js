import UserModel from "@/main/models/user.schema";
import { mapId } from "@/participated/libs/mapId";
import { genSalt, genSaltSync, hashSync } from "bcryptjs";
export default async function createUser({
  name,
  username,
  email,
  password,
  dateOfBirth,
  verificationToken,
}) {
  try {
    const passwordHash = hashSync(password, genSaltSync(8));
    const user = await UserModel.create({
      name,
      username,
      email,
      passwordHash,
      dateOfBirth,
      verificationToken,
    });
    return mapId(user._doc);
  } catch (err) {
    console.log(err);
    throw { status: 500, error: "something went wrong" };
  }
}
