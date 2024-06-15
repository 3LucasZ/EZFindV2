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
    id: number;
    newName: string;
    newDescription: string;
    newRelations: ItemStorageRelationProps[];
  }>,
  res: NextApiResponse
) {
  //--rcv--
  const {
    id,
    newName,
    newDescription,
    newRelations: newItemRelations,
  } = req.body;
  const newRelations = newItemRelations.map((relation) => ({
    count: relation.count,
    itemId: relation.itemId,
  }));
  //--API Protection--
  const session = await getServerSession(req, res, authOptions);
  const storage = await prisma.storage.findUnique({
    where: { id },
    include: { group: true },
  });
  const group = storage?.group;
  if (group == undefined) return res.status(500).json("Internal Error");
  const groupPerm = getGroupPerm(session?.user, group);
  if (groupPerm < 1) return res.status(403).json("Forbidden");
  if (newName == "")
    return res.status(500).json("Storage name can not be empty.");
  //--operation--
  try {
    const op = await prisma.storage.update({
      where: {
        id,
      },
      data: {
        name: newName,
        description: newDescription,
        itemRelations: {
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
