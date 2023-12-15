import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body;
  const op = await prisma.machine.delete({
    where: {
      id: id,
    },
  });
  return res.status(200).json(op);
}
