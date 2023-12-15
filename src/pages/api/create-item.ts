import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const op = await prisma.item.create({
    data: {
      name: "Item-" + new Date().getTime(),
      description: "",
    },
  });
  return res.status(200).json(op.id);
}
