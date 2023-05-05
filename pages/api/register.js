import bcrypt from "bcrypt";
import connectToDB from "@/src/libs/mongooseDB";
import User from "@/src/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    await connectToDB();

    const { email, username, name, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      username,
      name,
      hashPassword,
    });

    return res.status(200).json(user.toObject());
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
