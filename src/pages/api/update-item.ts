import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, name, description, storageIds, counts } = req.body;
  if (name == "" || storageIds.length != counts.length) {
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
        name: name,
        description: description,
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
