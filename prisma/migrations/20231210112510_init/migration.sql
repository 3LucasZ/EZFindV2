/*
  Warnings:

  - You are about to drop the `Module` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Module" DROP CONSTRAINT "Module_usedById_fkey";

-- DropForeignKey
ALTER TABLE "_authorized" DROP CONSTRAINT "_authorized_A_fkey";

-- DropForeignKey
ALTER TABLE "_authorized" DROP CONSTRAINT "_authorized_B_fkey";

-- DropTable
DROP TABLE "Module";

-- CreateTable
CREATE TABLE "machine" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "lastSeen" VARCHAR(255),
    "usedById" INTEGER,
    "IP" VARCHAR(255),

    CONSTRAINT "machine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "machine_name_key" ON "machine"("name");

-- CreateIndex
CREATE UNIQUE INDEX "machine_usedById_key" ON "machine"("usedById");

-- AddForeignKey
ALTER TABLE "machine" ADD CONSTRAINT "machine_usedById_fkey" FOREIGN KEY ("usedById") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_authorized" ADD CONSTRAINT "_authorized_A_fkey" FOREIGN KEY ("A") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_authorized" ADD CONSTRAINT "_authorized_B_fkey" FOREIGN KEY ("B") REFERENCES "machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
