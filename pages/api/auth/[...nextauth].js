import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import User from "@/src/models/User";
import connectToDB from "@/src/libs/mongooseDB";
import mongooseAdapter from "@/src/libs/mongooseAdapter";
import { toast } from "react-hot-toast";
import { Router, useRouter } from "next/router";
import GithubProvider from "next-auth/providers/github";

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
       // const router = useRouter();
        if(user.isVerified === false){
          throw new Error("User is not verified");
          //router.push('/');
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

    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

  ],

  callbacks: {
    async jwt({ token, user, session}){
      // console.log("jwt callback", { token, user, session });
      if(user) {
        return {
          ...token,
          _id: user._id,
        }
      }
      return token;
    },
    async session({ session, token, user}) {
      // console.log("session callback", {session, token, user});
      // pass userId to session
      return {
        ...session,
        user: { 
          ...session.user,
          _id: token._id,
        }
      };

      return session;
    },
  },
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