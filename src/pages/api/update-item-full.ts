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
    newName: string;
    newDescription: string;
    newLink: string;
    addStorageRelations: ItemStorageRelationProps[];
    rmStorageRelations: ItemStorageRelationProps[];
  }>,
  res: NextApiResponse
) {
  //--rcv--
  const {
    groupId,
    id,
    newName,
    newDescription,
    newLink,
    addStorageRelations,
    rmStorageRelations,
  } = req.body;
  const addRelations = addStorageRelations.map((relation) => ({
    count: relation.count,
    storageId: relation.storageId,
  }));
  const rmRelations = addStorageRelations.map((relation) => ({
    count: relation.count,
    storageId: relation.storageId,
  }));
  //--API Protection--
  const session = await getServerSession(req, res, authOptions);
  const groupPerm = getGroupPerm(session?.user, groupId);
  if (groupPerm < 1) return res.status(403).json("Forbidden");
  if (newName == "") return res.status(500).json("Item name can not be empty.");
  //--operation--
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
          deleteMany: rmRelations, //extremely important, this denotes that you want to delete relations too
          createMany: { data: addRelations },
        },
      },
    });
    return res.status(200).json(op);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}
