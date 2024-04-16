import { PrismaClient } from "@prisma/client";

let prisma = new PrismaClient().$extends({
  result: {
    item: {
      image: {
        needs: {
          image: true,
        },
        compute(item) {
          return item.image.toString("base64");
        },
      },
    },
  },
});

export default prisma;
