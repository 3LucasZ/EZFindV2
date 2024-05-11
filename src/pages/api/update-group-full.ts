import { ItemStorageRelationProps } from "types/db";
import { UserGroupRelationProps } from "types/db";
import type { NextApiResponse } from "next";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { TypedRequestBody } from "types/types";

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
  const { id, newName, newDescription, newUserRelations, newMinPerm } =
    req.body;
  const _newUserRelations = newUserRelations.map((relation) => ({
    perm: relation.perm,
    userId: relation.userId,
  }));
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
          createMany: { data: _newUserRelations },
        },
      },
    });
    return res.status(200).json(op);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}
