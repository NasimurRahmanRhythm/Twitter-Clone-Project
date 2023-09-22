import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import User from "@/src/models/User";
import connectToDB from "@/src/libs/mongooseDB";
import mongooseAdapter from "@/src/libs/mongooseAdapter";
import { toast } from "react-hot-toast";

export const AuthOptions = {
  adapter: mongooseAdapter(User),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDB();

        if (!credentials?.email || !credentials?.password) {
          console.log(credentials);
          throw new Error("Invalid credentials 1");
        }

        const user = await User.findOne({
          email: credentials.email,
        }).exec();
        console.log({user});
        console.log(credentials);
        if(user.isVerified === false){
          throw new Error("User is not verified");
        }
        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid credentials 2");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials 3 ");
        }

        return user;
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(AuthOptions);


