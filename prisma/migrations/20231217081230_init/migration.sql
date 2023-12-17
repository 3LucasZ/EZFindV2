-- DropForeignKey
ALTER TABLE "Relation" DROP CONSTRAINT "Relation_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Relation" DROP CONSTRAINT "Relation_storageId_fkey";

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_storageId_fkey" FOREIGN KEY ("storageId") REFERENCES "Storage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
