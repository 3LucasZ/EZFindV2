import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { itemId, storageId, count } = req.body;

  try {
    const op = await prisma.relation.update({
      where: {
        itemId_storageId: {
          itemId,
          storageId,
        },
      },
      data: {
        count,
      },
    });
    return res.status(200).json(op);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(500).json(e);
    }
  }
  return res.status(500).json("unkown error");
}
