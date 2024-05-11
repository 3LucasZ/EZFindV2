import { ItemStorageRelationProps } from "types/db";
import type { NextApiResponse } from "next";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { TypedRequestBody } from "types/types";

export default async function handle(
  req: TypedRequestBody<{
    email: string;
    isAdmin: boolean;
  }>,
  res: NextApiResponse
) {
  const { email, isAdmin } = req.body;
  try {
    const op = await prisma.user.update({
      where: {
        email,
      },
      data: {
        isAdmin,
      },
    });
    return res.status(200).json(op);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}
