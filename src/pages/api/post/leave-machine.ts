import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "services/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { machineName, machineSecret } = req.body;
  if (machineSecret != process.env.EZCHECK_SECRET) {
    return res.status(403).json("Unauthorized machine. Denied Access");
  }
  const machine = await prisma.machine.findUnique({
    where: {
      name: machineName,
    },
  });
  if (machine == null) return res.status(500).json("machine DNE");
  await prisma.machine.update({
    where: {
      name: machineName,
    },
    data: {
      usedById: null,
    },
  });
  return res.status(200).json("Successfully left.");
}
