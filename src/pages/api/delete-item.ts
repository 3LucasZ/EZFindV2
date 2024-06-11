import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { authOptions } from "./auth/[...nextauth]";
import { getGroupPerm } from "services/utils";
import { TypedRequestBody } from "@/types";

export default async function handle(
  req: TypedRequestBody<{
    groupId: number;
    id: number;
  }>,
  res: NextApiResponse
) {
  //--rcv--
  const { groupId, id } = req.body;
  //--API Protection--
  const session = await getServerSession(req, res, authOptions);
  const groupPerm = getGroupPerm(session?.user, groupId);
  if (groupPerm < 1) return res.status(403).json("Forbidden");
  //--operation--
  try {
    const op = await prisma.item.delete({
      where: {
        id,
      },
    });
    return res.status(200).json(op);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}
