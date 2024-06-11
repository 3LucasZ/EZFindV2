import { ItemStorageRelationProps } from "types/db";
import { UserGroupRelationProps } from "types/db";
import type { NextApiResponse } from "next";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { TypedRequestBody } from "types/types";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { getGroupPerm } from "services/utils";

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
  const addRelations = newUserRelations.map((relation) => ({
    perm: relation.perm,
    userId: relation.userId,
  }));
  //--API Protection--
  const session = await getServerSession(req, res, authOptions);
  const groupPerm = getGroupPerm(session?.user, id);
  if (groupPerm < 1) return res.status(403).json("Forbidden");
  //--operation--

  if (newName == "")
    return res.status(500).json("Group name can not be empty.");
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
          createMany: { data: addRelations },
        },
      },
    });
    return res.status(200).json(op);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}
