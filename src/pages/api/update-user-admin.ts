import type { NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { TypedRequestBody } from "types/types";
import { authOptions } from "./auth/[...nextauth]";

export default async function handle(
  req: TypedRequestBody<{
    email: string;
    isAdmin: boolean;
  }>,
  res: NextApiResponse
) {
  //--rcv--
  const { email, isAdmin } = req.body;
  //--API Protection--
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user.isAdmin) return res.status(403).json("Forbidden");
  //--operation--
  try {
    const op = await prisma.user.update({
      where: {
        email,
      },
      data: {
        isAdmin,
      },
    });
    return res.status(200).json(op);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}
