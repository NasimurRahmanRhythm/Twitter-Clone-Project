// libs/serverAuth.js
import { getSession } from "next-auth/react";
import User from "../models/User";
import connectToDB from "./mongooseDB";

const serverAuth = async (req) => {
  await connectToDB();

  const session = await getSession({ req, jwt: true });

  if (!session?.user?.email) {
    console.log(session);
    throw new Error("Not signed in");
  }

  const currentUser = await User.findOne({
    email: session.user.email,
  }).exec();

  if (!currentUser) {
    throw new Error("Not signed in");
  }

  return { currentUser };
};

export default serverAuth;
