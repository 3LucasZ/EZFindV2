import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, name, PIN, machineIds } = req.body;
  if (name == "" || PIN == "") {
    const prep = res.status(500);
    prep.json("form is incomplete");
    return prep;
  }
  try {
    const op = await prisma.student.upsert({
      where: {
        id: id,
      },
      update: {
        name: name,
        PIN: PIN,
        machines: {
          set: machineIds,
        },
      },
      create: {
        name: name,
        PIN: PIN,
        machines: {
          connect: machineIds,
        },
      },
      include: {
        machines: true,
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
