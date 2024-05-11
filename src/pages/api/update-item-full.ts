import { ItemStorageRelationProps } from "types/db";
import type { NextApiResponse } from "next";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { TypedRequestBody } from "types/types";

export default async function handle(
  req: TypedRequestBody<{
    id: number;
    newName: string;
    newDescription: string;
    newLink: string;
    newRelations: ItemStorageRelationProps[];
  }>,
  res: NextApiResponse
) {
  const { id, newName, newDescription, newLink, newRelations } = req.body;
  const relations = newRelations.map((relation) => ({
    count: relation.count,
    storageId: relation.storageId,
  }));
  if (newName == "") return res.status(500).json("Item name can not be empty.");
  try {
    const op = await prisma.item.update({
      where: {
        id,
      },
      data: {
        name: newName,
        description: newDescription,
        link: newLink,
        storageRelations: {
          deleteMany: {},
          createMany: { data: relations },
        },
      },
    });
    return res.status(200).json(op);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}
