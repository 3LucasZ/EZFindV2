import { Prisma, PrismaClient } from "@prisma/client";

const prismaExtension = Prisma.defineExtension({
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

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(prismaExtension);
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
