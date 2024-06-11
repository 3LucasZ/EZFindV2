import { ItemStorageRelationProps } from "types/db";
import type { NextApiResponse } from "next";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { TypedRequestBody } from "types/types";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { getGroupPerm } from "services/utils";

export default async function handle(
  req: TypedRequestBody<{
    groupId: number;
    id: number;
    image: string;
  }>,
  res: NextApiResponse
) {
  //--rcv--
  const { groupId, id, image } = req.body;
  //--API Protection--
  const session = await getServerSession(req, res, authOptions);
  const groupPerm = getGroupPerm(session?.user, groupId);
  if (groupPerm < 1) return res.status(403).json("Forbidden");
  //--operation--
  try {
    const op = await prisma.item.update({
      where: {
        id,
      },
      data: {
        image,
      },
    });
    return res.status(200).json(op);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}
