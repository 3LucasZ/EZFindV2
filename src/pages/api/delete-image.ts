import { PrismaClient } from "@prisma/client";

import mime from "mime";
import { join } from "path";
import { stat, mkdir, writeFile, unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import _ from "lodash";
import { TypedRequestBody } from "services/types";
import { NextApiResponse } from "next";

export default async function handle(
  req: TypedRequestBody<{
    image: string;
  }>,
  res: NextApiResponse
) {
  //--image
  const { image } = req.body;
  //--imagePath
  const imagePath = join(process.cwd(), "public", image);
  //--delete file
  try {
    await unlink(imagePath);
    console.log("delete-image-server imagePath:", imagePath);
    return res.status(200).json(imagePath);
  } catch (e) {
    console.error("Error while trying to delete a file:" + e);
    return res.status(500).json("Error while trying to delete a file: " + e);
  }
}
