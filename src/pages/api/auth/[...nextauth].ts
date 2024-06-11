import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "services/prisma";
import type { Adapter } from "next-auth/adapters";
const { GOOGLE_ID = "", GOOGLE_SECRET = "" } = process.env;

const prismaAdapter = PrismaAdapter(prisma);

export const authOptions = {
  adapter: prismaAdapter as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    //Add data to user object so it is passed along with session
    async session({ session, user }: { session: Session; user: User }) {
      session.user = user;
      //instant lucas admin
      if (user.email == "lucas.zheng@warriorlife.net")
        session.user.isAdmin = true;
      return session;
    },
    //if signIn block commented in
    //only VCS emails can create an account on the service
    // async signIn({ user }: { user: User }) {
    //   const prismaUser = await prisma.user.findUnique({
    //     where: { email: user.email },
    //   });
    //   return validEmail(user.email) || prismaUser != null;
    // },
  },
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const { host } = req.headers;
  if (!host) return res.status(400).json(`Bad Request, missing host header`);
  // else return res.status(400).json("Debug: " + host);

  // process.env.NEXTAUTH_URL = "https://" + host + "/ezfind/api/auth";
  process.env.NEXTAUTH_URL = "https://" + host + "/api/auth";
  return NextAuth(authOptions)(req, res);
}

//--Extend prisma adapter--
//Extend official open-source: https://github.com/nextauthjs/next-auth/blob/main/packages/adapter-prisma/src/index.ts
//Extra help: https://next-auth.js.org/configuration/events#createuser
//retrieve relational columns from user ("include" tag)
prismaAdapter.getSessionAndUser = async (sessionToken) => {
  // console.log("GET SESSION + USER");
  const userAndSession = await prisma.session.findUnique({
    where: { sessionToken },
    include: {
      user: {
        include: {
          groupRelations: {
            include: {
              group: true,
            },
          },
        },
      },
    },
  });
  if (!userAndSession) return null;
  const { user, ...session } = userAndSession;
  return { user, session };
};
