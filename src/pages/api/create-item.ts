import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { authOptions } from "./auth/[...nextauth]";
import { TypedRequestBody } from "types/types";
import { getGroupPerm } from "services/utils";

export default async function handle(
  req: TypedRequestBody<{
    groupId: number;
  }>,
  res: NextApiResponse
) {
  //--recv--
  const { groupId } = req.body;
  //--API Protection--
  const session = await getServerSession(req, res, authOptions);
  const group = await prisma.group.findUnique({ where: { id: groupId } });
  if (group == undefined) return res.status(500).json("Internal Error");
  const groupPerm = getGroupPerm(session?.user, group);
  if (groupPerm < 1) return res.status(403).json("Forbidden");
  //--operation--
  try {
    const op = await prisma.item.create({
      data: {
        name: "Item-" + new Date().getTime(),
        description: "",
        groupId: groupId,
      },
    });
    return res.status(200).json(op.id);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}
