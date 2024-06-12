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
    newLink: string;
    newStorageRelations: ItemStorageRelationProps[];
  }>,
  res: NextApiResponse
) {
  //--rcv--
  const { id, newName, newDescription, newLink, newStorageRelations } =
    req.body;
  const newRelations = newStorageRelations.map((relation) => ({
    count: relation.count,
    storageId: relation.storageId,
  }));

  //--API Protection--
  const session = await getServerSession(req, res, authOptions);
  const item = await prisma.item.findUnique({
    where: { id },
    include: { group: true },
  });
  const group = item?.group;
  if (group == undefined) return res.status(500).json("Internal Error");
  const groupPerm = getGroupPerm(session?.user, group);
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
          deleteMany: {}, //extremely important, this denotes that you want to delete relations too
          createMany: { data: newRelations },
        },
      },
    });
    return res.status(200).json(op);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}
