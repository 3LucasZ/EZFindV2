import { Prisma } from "@prisma/client";

export function prismaErrHandler(e: any): string {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    console.log(
      "code: " +
        e.code +
        ", meta: " +
        JSON.stringify(e.meta) +
        ", msg: " +
        e.message
    );
    if (e.code == "P2000") {
      //varChar constraint
      return "Field " + e.meta?.column_name + " is too long.";
    } else if (e.code == "P2002") {
      //unique constraint
      //e.meta.target
      return (
        "Another object with the same " + e.meta?.target + " exists already."
      );
    } else if (e.code == "P2025") {
      //object DNE
      //e.meta.modelName
      return "Your data is outdated, please refresh your webpage.";
    } else if (e.code == "P2003") {
      //relation DNE
      //e.meta.modelName, e.meta.field_name
      return "Your data is outdated, please refresh your webpage.";
    } else {
      //unhandled prisma error
      return "Your data is outdated, please refresh your webpage.";
      //   return "Unhandled error: " + e.code + " | " + e.message;
    }
  } else {
    return "Unknown error: " + e;
  }
}
