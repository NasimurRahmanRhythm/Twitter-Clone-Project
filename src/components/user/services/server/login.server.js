import * as bcrypt from "bcryptjs";
import { getUserByEmail } from "./get-user.server";

export async function login({ email, password }) {
  let user = await getUserByEmail(email) 
  if (!user) {
    throw { status: 404, error: "Email not found" };
  }
  if(!user.passwordHash){
    throw {status:400,error: "please login with github"}
  }
  if(!user.isVerified){
    throw {status:400,error:"Please verify your email!"}
  }
  const isValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isValid) {
    throw { status: 400, error: "email or password incorrect" };
  }
  const { passwordHash, followers, followings , tweets,  ...userData } = user;
  return userData;
}
