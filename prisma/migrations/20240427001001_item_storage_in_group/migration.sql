-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "groupId" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Storage" ADD COLUMN     "groupId" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Storage" ADD CONSTRAINT "Storage_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
