import { Prisma } from "@prisma/client";
import { RelationProps } from "components/Widget/RelationWidget";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";
import { TypedRequestBody } from "services/types";

export default async function handle(
  req: TypedRequestBody<{
    id: number;
    newName: string;
    newDescription: string;
    newRelations: RelationProps[];
  }>,
  res: NextApiResponse
) {
  const { id, newName, newDescription, newRelations } = req.body;
  const relations = newRelations.map((relation) => ({
    count: relation.count,
    itemId: relation.itemId,
  }));
  const op = await prisma.storage.update({
    where: {
      id,
    },
    data: {
      name: newName,
      description: newDescription,
      relations: {
        deleteMany: {},
        createMany: { data: relations },
      },
    },
  });
  return res.status(200).json(op);
}
