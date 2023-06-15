import { sendVerificationMail } from "@/main/libs/sendVerificationMail";
import createUser from "@/components/user/services/server/create-user.server";
import { getUserByEmail } from "@/components/user/services/server/get-user.server";
import { handleRequest } from "@/participated/middlewares/request-handler";
import { generateVerificationToken } from "@/participated/libs/generateVerificationToken";
export default handleRequest({
  POST: async (req, res) => {
    const { name, email, password, dateOfBirth } = req.body;
    const verificationToken = generateVerificationToken();
    const username = email.split("@")[0];
    let user = await getUserByEmail(email);
    if (user) {
      throw { status: 409, error: "user exists" };
    }
    user = await createUser({
      name,
      username,
      email,
      dateOfBirth,
      password,
      verificationToken,
    });
    await sendVerificationMail({
      email: email,
      id: user.id,
      verificationToken,
    });
    return res.status(201).json({
      success: true,
    });
  },
});
