import UserModel from "@/main/models/user.schema";
import { dbConnect } from "@/main/libs/db";
import { getUserByEmail } from "@/components/user/services/server/get-user.server";
import { login } from "@/components/user/services/server/login.server";
import NextAuth from "next-auth";
import { getToken } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";

export const createOptions = (req) => ({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        await dbConnect();
        let user;
        const { email, password } = credentials;
        if (!email && !password) {
          const token = await getToken({ req });
          if (token) {
            const user = await getUserByEmail(token.email);
            return user;
          }
        }
        try {
          user = await login({ email, password });
          return user;
        } catch (err) {
          throw new Error(err.error);
        }
      },
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  pages: {
    signIn: "/?page=login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        try {
          user = await getUserByEmail(token.email);
        } catch (err) {
          return token;
        }
        token.id = user.id;
        token.name = user.name;
        token.username = user.username;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },

    async session({ session, token, params }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.username = token.username;
      session.user.email = token.email;
      session.user.image = token.image;
      return session;
    },

    async signIn({ user, account }) {
      if (account) {
        try {
          const { email, name, image } = user;
          await dbConnect();
          const existingUser = await UserModel.findOne({ email });
          if (!existingUser) {
            await UserModel.create({
              username: email.split("@")[0],
              email,
              name,
              image,
              isVerified: true,
            });
          } else if (!existingUser.isVerified) {
            existingUser.isVerified = true;
            existingUser.verificationToken = undefined;
            await existingUser.save();
          }
          return true;
        } catch (err) {
          return false;
        }
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export default (req, res) => NextAuth(req, res, createOptions(req));
