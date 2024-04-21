import { PrismaClient } from "@prisma/client";

let prisma = new PrismaClient().$extends({
  result: {
    group: {
      image: {
        needs: {
          image: true,
        },
        compute(group) {
          return group.image.toString("base64");
        },
      },
    },
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
    storage: {
      image: {
        needs: {
          image: true,
        },
        compute(storage) {
          return storage.image.toString("base64");
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
