// pages/api/users/index.jsx
import User from "@/src/models/User";
import connectToDB from "@/src/libs/mongooseDB";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    await connectToDB();

    const users = await User.find({}).sort({ createdAt: "desc" });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
