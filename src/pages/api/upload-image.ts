import { PrismaClient } from "@prisma/client";

import mime from "mime";
import { join } from "path";
import { stat, mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import _ from "lodash";
import { TypedRequestBody } from "services/types";
import { NextApiResponse } from "next";

export default async function handle(
  req: TypedRequestBody<{
    image: File;
  }>,
  res: NextApiResponse
) {
  //--image buffer
  const { image } = req.body;
  const buffer = Buffer.from(await image.arrayBuffer());
  //--uploadDir
  const relativeUploadDir = `/uploads/${new Date(
    Date.now()
  ).getMonth()}-${new Date(Date.now()).getFullYear()}`;
  const uploadDir = join(process.cwd(), "public", relativeUploadDir);
  //--create uploadDir
  try {
    await stat(uploadDir);
  } catch (e: any) {
    if (e.code === "ENOENT") {
      // This is for checking the directory is exist (ENOENT : Error No Entry)
      await mkdir(uploadDir, { recursive: true });
    } else {
      console.error(
        "Error while trying to create directory when uploading a file: " + e
      );
      return res
        .status(500)
        .json(
          "Error while trying to create directory when uploading a file: " + e
        );
    }
  }
  //--create file
  try {
    const filename = `${Date.now()}.${mime.getExtension(image.type)}`;
    await writeFile(`${uploadDir}/${filename}`, buffer);
    const fileUrl = `${relativeUploadDir}/${filename}`;
    return res.status(200).json(fileUrl);
  } catch (e) {
    console.error("Error while trying to upload a file:" + e);
    return res.status(500).json("Error while trying to upload a file: " + e);
  }
}
