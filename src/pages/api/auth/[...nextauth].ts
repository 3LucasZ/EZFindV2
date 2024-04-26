import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "services/prisma";
import type { Adapter } from "next-auth/adapters";
const { GOOGLE_ID = "", GOOGLE_SECRET = "" } = process.env;

// export default NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: GOOGLE_ID,
//       clientSecret: GOOGLE_SECRET,
//     }),
//   ],
// });

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const { host } = req.headers;
  if (!host) return res.status(400).json(`Bad Request, missing host header`);
  // else return res.status(400).json("Debug: " + host);

  process.env.NEXTAUTH_URL = "https://" + host + "/ezfind/api/auth";

  return NextAuth({
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
      GoogleProvider({
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
      }),
    ],
    callbacks: {
      //Add data to user object so it is passed along with session
      session({ session, token, user }) {
        //id
        session.user.id = user.id;
        //isAdmin
        session.user.isAdmin = user.isAdmin;
        if (
          user.email == "lucas.j.zheng@gmail.com" ||
          user.email == "lucas.zheng@warriorlife.net"
        )
          session.user.isAdmin = true;
        return session;
      },
    },
  })(req, res);
}
