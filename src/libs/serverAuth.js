// libs/serverAuth.js
import { getServerSession } from "next-auth";
import User from "../models/User";
import { AuthOptions } from "@/pages/api/auth/[...nextauth]";
import connectToDB from "./mongooseDB";

const serverAuth = async (req, res) => {
  await connectToDB();

  const session = await getServerSession( req, res, AuthOptions);

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
