import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import User from "@/models/User";
import connectToDB from "@/libs/mongooseDB";
import GithubProvider from "next-auth/providers/github";

export const AuthOptions = {
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

    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

  ],

  callbacks: {

    async signIn({ user, account}) {
      if (account) {
        try{
        const { email, name } = user;
        await connectToDB();
        const existingUser = await User.findOne({email});
        if (!existingUser) {
           await User.create({
            username: email.split("@")[0],
            email,
            name,
            isVerified:true,
          });
        }
        else if(!existingUser.isVerified){
           existingUser.isVerified = true;
           existingUser.verificationToken = undefined;
           await existingUser.save();
        }
        return true;
        }
        catch(err){
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, profile}){
      //console.log("nextauth user is ",user);
      //console.log("nextauth profile is ",profile);
     // console.log("nextAuthhh token is ",token);
      if(user) {
        //console.log("dhukbena");
        return {
          ...token,
          _id: user._id,
        }
      }
      else {
        const {email} = token;
        const existingUser = await User.findOne({email});
        return {
          ...token,
          _id: existingUser._id,
        }
      }
    },
    async session({ session, token, user}) {
     // console.log("Token is ", token);
      //console.log("session is ",session);
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