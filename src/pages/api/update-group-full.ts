import { RelationProps } from "components/Widget/RelationWidget";
import { UserGroupRelationProps } from "components/Widget/UserGroupRelationWidget";
import type { NextApiResponse } from "next";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { TypedRequestBody } from "services/types";

export default async function handle(
  req: TypedRequestBody<{
    id: number;
    newName: string;
    newDescription: string;
    newUserRelations: UserGroupRelationProps[];
  }>,
  res: NextApiResponse
) {
  const { id, newName, newDescription, newUserRelations } = req.body;
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
