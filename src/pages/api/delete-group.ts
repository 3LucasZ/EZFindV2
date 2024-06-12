import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { authOptions } from "./auth/[...nextauth]";
import { getGroupPerm } from "services/utils";
import { TypedRequestBody } from "@/types";

export default async function handle(
  req: TypedRequestBody<{
    id: number;
  }>,
  res: NextApiResponse
) {
  //--recv--
  const { id } = req.body;
  //--API Protection--
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user.isAdmin) return res.status(403).json("Forbidden");
  //--operation--
  try {
    const op = await prisma.group.delete({
      where: {
        id,
      },
    });
    return res.status(200).json(op);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}
