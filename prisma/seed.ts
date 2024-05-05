import prisma from "services/prisma";

async function main() {
  // if (false) {
  //   for (let i = 0; i < 50; i++) {
  //     await prisma.item.upsert({
  //       create: {
  //         name: "Item #" + i,
  //         description: "",
  //       },
  //       update: {},
  //       where: { name: "Item #" + i },
  //     });
  //   }
  //   for (let i = 0; i < 50; i++) {
  //     await prisma.storage.upsert({
  //       create: {
  //         name: "Storage #" + i,
  //         description: "",
  //       },
  //       update: {},
  //       where: { name: "Storage #" + i },
  //     });
  //   }
  // }
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
