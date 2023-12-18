import { Prisma } from "@prisma/client";
import { debugMode } from "./constants";

export function prismaErrHandler(e: any): string {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (debugMode) {
      console.log(
        "code: " +
          e.code +
          ", meta: " +
          JSON.stringify(e.meta) +
          ", msg: " +
          e.message
      );
    }
    if (e.code == "P2002") {
      //e.meta.target
      return (
        "Another object with the same " + e.meta?.target + " exists already."
      );
    } else if (e.code == "P2025") {
      //e.meta.modelName
      return "Your data is outdated, please refresh your webpage.";
    } else if (e.code == "P2003") {
      //e.meta.modelName, e.meta.field_name
      return "Your data is outdated, please refresh your webpage.";
    } else {
      return "Your data is outdated, please refresh your webpage.";
      //   return "Unhandled error: " + e.code + " | " + e.message;
    }
  } else {
    return "0";
  }
}
