import type { NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { getGroupPerm } from "services/utils";
import { UserGroupRelationProps } from "types/db";
import { TypedRequestBody } from "types/types";
import { authOptions } from "./auth/[...nextauth]";

export default async function handle(
  req: TypedRequestBody<{
    id: number;
    newName: string;
    newDescription: string;
    newUserRelations: UserGroupRelationProps[];
    newMinPerm: boolean;
  }>,
  res: NextApiResponse
) {
  //--rcv--
  const { id, newName, newDescription, newUserRelations, newMinPerm } =
    req.body;
  const newRelations = newUserRelations
    ? newUserRelations.map((relation) => ({
        perm: relation.perm,
        userId: relation.userId,
      }))
    : [];
  //--API Protection--
  const session = await getServerSession(req, res, authOptions);
  const group = await prisma.group.findUnique({ where: { id } });
  if (group == undefined) return res.status(500).json("Internal Error");
  const groupPerm = getGroupPerm(session?.user, group);
  if (groupPerm < 1) return res.status(403).json("Forbidden");
  if (groupPerm < 2 && newRelations) return res.status(403).json("Forbidden");
  if (newName == "")
    return res.status(500).json("Group name can not be empty.");
  //--operation--
  try {
    const op = await prisma.group.update({
      where: {
        id,
      },
      data: {
        name: newName,
        description: newDescription,
        minPerm: Number(newMinPerm),
        userRelations: {
          deleteMany: {},
          createMany: { data: newRelations },
        },
      },
    });
    return res.status(200).json(op);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}
