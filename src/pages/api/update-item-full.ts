import { RelationProps } from "components/Widget/RelationWidget";
import type { NextApiResponse } from "next";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
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
    storageId: relation.storageId,
  }));
  if (newName == "")
    return res.status(500).json("Object name can not be empty");
  try {
    const op = await prisma.item.update({
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
  } catch (e) {
    const msg = prismaErrHandler(e);
    if (msg != "0") return res.status(500).json(msg);
    else return res.status(500).json("Unknown error: " + e);
  }
}
