import { PrismaClient } from "@prisma/client";
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
  for (let i = 0; i < 50; i++) {
    await prisma.item.upsert({
      create: {
        name: "item #" + i,
        description: "",
      },
      update: {},
      where: { name: "item #" + i },
    });
  }
  for (let i = 0; i < 50; i++) {
    await prisma.storage.upsert({
      create: {
        name: "storage #" + i,
        description: "",
      },
      update: {},
      where: { name: "storage #" + i },
    });
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
