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
    user: {
      createdAt: {
        needs: {
          createdAt: true,
        },
        compute(user) {
          return user.createdAt.toString();
        },
      },
      updatedAt: {
        needs: {
          createdAt: true,
        },
        compute(user) {
          return user.createdAt.toString();
        },
      },
    },
  },
});

export default prisma;
