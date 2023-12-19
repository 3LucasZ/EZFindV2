import { PrismaClient } from "@prisma/client";
import { debugMode } from "services/constants";
const prisma = new PrismaClient();
async function main() {
  const admin1 = await prisma.admin.upsert({
    create: {
      email: "lucas.zheng@warriorlife.net",
    },
    update: {},
    where: {
      email: "lucas.zheng@warriorlife.net",
    },
  });
  if (debugMode) {
    for (let i = 0; i < 50; i++) {
      await prisma.item.upsert({
        create: {
          name: "Item #" + i,
          description: "",
        },
        update: {},
        where: { name: "Item #" + i },
      });
    }
    for (let i = 0; i < 50; i++) {
      await prisma.storage.upsert({
        create: {
          name: "Storage #" + i,
          description: "",
        },
        update: {},
        where: { name: "Storage #" + i },
      });
    }
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
