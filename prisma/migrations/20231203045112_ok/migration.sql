/*
  Warnings:

  - You are about to drop the column `lastSeen` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the column `usedBy` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the `_ModuleToStudent` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[usedById]` on the table `Module` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Module` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ModuleToStudent" DROP CONSTRAINT "_ModuleToStudent_A_fkey";

-- DropForeignKey
ALTER TABLE "_ModuleToStudent" DROP CONSTRAINT "_ModuleToStudent_B_fkey";

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "lastSeen",
DROP COLUMN "usedBy",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "usedById" INTEGER;

-- DropTable
DROP TABLE "_ModuleToStudent";

-- CreateTable
CREATE TABLE "_authorized" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_authorized_AB_unique" ON "_authorized"("A", "B");

-- CreateIndex
CREATE INDEX "_authorized_B_index" ON "_authorized"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Module_usedById_key" ON "Module"("usedById");

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_usedById_fkey" FOREIGN KEY ("usedById") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_authorized" ADD CONSTRAINT "_authorized_A_fkey" FOREIGN KEY ("A") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_authorized" ADD CONSTRAINT "_authorized_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
