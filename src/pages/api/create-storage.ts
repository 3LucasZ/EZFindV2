import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { groupId } = req.body;
  try {
    const op = await prisma.storage.create({
      data: {
        name: "Storage-" + new Date().getTime(),
        description: "",
        groupId: groupId,
      },
    });
    return res.status(200).json(op.id);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}
