import { mkdir, stat, writeFile } from "fs/promises";
import { NextApiResponse } from "next";
import { join } from "path";
import { TypedRequestBody } from "types/types";

export default async function handle(
  req: TypedRequestBody<{
    image: string;
  }>,
  res: NextApiResponse
) {
  //--image
  const { image } = req.body;
  //--uploadDir
  const relativeUploadDir = `/uploads/${new Date(
    Date.now()
  ).getMonth()}-${new Date(Date.now()).getFullYear()}`;
  const uploadDir = join(process.cwd(), relativeUploadDir);
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
    const filename = `${Date.now()}.${image.split(";")[0].split("/")[1]}`;
    // await writeFile(`${uploadDir}/${filename}`, Buffer.from(image, "base64"));
    await writeFile(
      `${uploadDir}/${filename}`,
      Uint8Array.from(atob(image.split("base64,")[1]), (c) => c.charCodeAt(0))
    );
    const fileUrl = `${relativeUploadDir}/${filename}`;
    // console.log("upload-image-server fileUrl:", fileUrl);
    return res.status(200).json(fileUrl);
  } catch (e) {
    console.error("Error while trying to upload a file:" + e);
    return res.status(500).json("Error while trying to upload a file: " + e);
  }
}
