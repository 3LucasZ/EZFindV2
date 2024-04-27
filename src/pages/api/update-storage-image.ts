import { ItemStorageRelationProps } from "components/Widget/ItemStorageRelationWidget";
import type { NextApiResponse } from "next";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { TypedRequestBody } from "services/types";

export default async function handle(
  req: TypedRequestBody<{
    id: number;
    newImageStr: string;
  }>,
  res: NextApiResponse
) {
  const { id, newImageStr } = req.body;
  try {
    const op = await prisma.storage.update({
      where: {
        id,
      },
      data: {
        image: Buffer.from(newImageStr, "base64"),
      },
    });
    return res.status(200).json(op);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}
