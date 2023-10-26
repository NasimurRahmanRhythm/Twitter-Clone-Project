import bcrypt from "bcrypt";
import connectToDB from "@/libs/mongooseDB";
import User from "@/models/User";
import { sendVerficiationMail } from "@/libs/sendVerificationMail";
import urlencode from "urlencode";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    await connectToDB();

    const { email, username, name, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = Math.random().toString(36).substring(2, 15);
    const user = await User.create({
      email,
      username,
      name,
      hashedPassword,
      verificationToken
    });

    const mailInfo = await sendVerficiationMail({
      id: urlencode(user._id), 
      email,
      verificationToken,
    });

    console.log(user);
    console.log("Verification email sent:", mailInfo);


    return res.status(200).json(user.toObject());
  } catch (error) {
    console.log("Register error" + error);
    return res.status(400).end();
  }
}