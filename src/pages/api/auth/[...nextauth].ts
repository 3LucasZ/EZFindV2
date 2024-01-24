import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
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
  console.log(req.headers);
  if (!host) return res.status(400).json(`Bad Request, missing host header`);
  // else return res.status(400).json("Debug: " + host);

  process.env.NEXTAUTH_URL = "https://" + host + "/ezfind/api/auth";

  return NextAuth({
    providers: [
      GoogleProvider({
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
      }),
    ],
  })(req, res);
}
