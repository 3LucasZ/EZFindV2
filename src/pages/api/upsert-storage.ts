import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, name, studentIds } = req.body;
  if (name == "") {
    const prep = res.status(500);
    prep.json("form is incomplete");
    return prep;
  }
  try {
    const op = await prisma.machine.upsert({
      where: {
        id: id,
      },
      update: {
        name: name,
        students: {
          set: studentIds,
        },
      },
      create: {
        name: name,
        students: {
          connect: studentIds,
        },
      },
      include: {
        students: true,
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
