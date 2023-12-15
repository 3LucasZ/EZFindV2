/*
  Warnings:

  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Storage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ItemToStorage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ItemToStorage" DROP CONSTRAINT "_ItemToStorage_A_fkey";

-- DropForeignKey
ALTER TABLE "_ItemToStorage" DROP CONSTRAINT "_ItemToStorage_B_fkey";

-- DropTable
DROP TABLE "Item";

-- DropTable
DROP TABLE "Storage";

-- DropTable
DROP TABLE "_ItemToStorage";

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "PIN" VARCHAR(255) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "lastSeen" TIMESTAMP(3),
    "usedBy" VARCHAR(255),
    "IP" VARCHAR(255),

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ModuleToStudent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_name_key" ON "Student"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Student_PIN_key" ON "Student"("PIN");

-- CreateIndex
CREATE UNIQUE INDEX "Module_name_key" ON "Module"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ModuleToStudent_AB_unique" ON "_ModuleToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_ModuleToStudent_B_index" ON "_ModuleToStudent"("B");

-- AddForeignKey
ALTER TABLE "_ModuleToStudent" ADD CONSTRAINT "_ModuleToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModuleToStudent" ADD CONSTRAINT "_ModuleToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
