import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, newName, newDescription, newRelations } = req.body;
  if (newName == "") {
    const prep = res.status(500);
    prep.json("Invalid Update");
    return prep;
  }
  try {
    const op = await prisma.item.update({
      where: {
        id: id,
      },
      data: {
        name: newName,
        description: newDescription,
        relations: newRelations,
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
