import type { NextApiRequest, NextApiResponse } from "next";
import { debugMode } from "services/constants";
import prisma from "services/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { machineName, studentPIN, machineSecret, IP } = req.body;

  if (machineSecret != process.env.EZCHECK_SECRET) {
    return res
      .status(403)
      .json(
        "Unauthorized machine. Denied Access." +
          (debugMode
            ? " Secret is: " +
              process.env.EZCHECK_SECRET +
              ". You entered: " +
              machineSecret
            : "")
      );
  }

  //find student
  const student = await prisma.student.findUnique({
    where: {
      PIN: studentPIN,
    },
    include: {
      machines: true,
    },
  });
  if (student == null) return res.status(500).json("PIN is incorrect");
  //find machine
  const machine = await prisma.machine.findUnique({
    where: {
      name: machineName,
    },
  });
  if (machine == null)
    return res.status(404).json("Machine " + machineName + " does not exist");
  //Can student use machine?
  const machinesStr = student.machines.map((machine) => machine.name);
  if (machinesStr.includes(machineName)) {
    await prisma.machine.update({
      where: {
        name: machineName,
      },
      data: {
        usedById: student.id,
        IP: IP,
      },
    });
    return res.status(200).json("Welcome, " + student.name + "!");
  } else {
    return res
      .status(403)
      .json(student.name + " does not have access to " + machineName);
  }
}
