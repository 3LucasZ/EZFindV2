/*
  Warnings:

  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_authorized` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `machine` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_authorized" DROP CONSTRAINT "_authorized_A_fkey";

-- DropForeignKey
ALTER TABLE "_authorized" DROP CONSTRAINT "_authorized_B_fkey";

-- DropForeignKey
ALTER TABLE "machine" DROP CONSTRAINT "machine_usedById_fkey";

-- DropTable
DROP TABLE "Student";

-- DropTable
DROP TABLE "_authorized";

-- DropTable
DROP TABLE "machine";

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "PIN" VARCHAR(255) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Storage" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "Storage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relation" (
    "itemId" INTEGER NOT NULL,
    "storageId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "Relation_pkey" PRIMARY KEY ("itemId","storageId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_name_key" ON "Item"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Item_PIN_key" ON "Item"("PIN");

-- CreateIndex
CREATE UNIQUE INDEX "Storage_name_key" ON "Storage"("name");

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_storageId_fkey" FOREIGN KEY ("storageId") REFERENCES "Storage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
