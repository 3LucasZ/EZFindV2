import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, name, itemIds } = req.body;
  if (name == "") {
    const prep = res.status(500);
    prep.json("form is incomplete");
    return prep;
  }
  try {
    const op = await prisma.storage.upsert({
      where: {
        id: id,
      },
      update: {
        name: name,
        items: {
          set: itemIds,
        },
      },
      create: {
        name: name,
        items: {
          connect: itemIds,
        },
      },
      include: {
        items: true,
      },
    });
    return res.status(200).json(op);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(500).json(e.meta?.target + " must be unique");
    }
  }
  return res.status(500).json("unkown error");
}
