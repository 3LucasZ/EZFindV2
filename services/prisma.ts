import { PrismaClient } from "@prisma/client";

let prisma = new PrismaClient().$extends({
  result: {
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
