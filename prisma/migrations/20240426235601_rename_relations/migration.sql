/*
  Warnings:

  - You are about to drop the `Relation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Relation" DROP CONSTRAINT "Relation_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Relation" DROP CONSTRAINT "Relation_storageId_fkey";

-- DropTable
DROP TABLE "Relation";

-- CreateTable
CREATE TABLE "ItemStorageRelation" (
    "itemId" INTEGER NOT NULL,
    "storageId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "ItemStorageRelation_pkey" PRIMARY KEY ("itemId","storageId")
);

-- AddForeignKey
ALTER TABLE "ItemStorageRelation" ADD CONSTRAINT "ItemStorageRelation_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemStorageRelation" ADD CONSTRAINT "ItemStorageRelation_storageId_fkey" FOREIGN KEY ("storageId") REFERENCES "Storage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
