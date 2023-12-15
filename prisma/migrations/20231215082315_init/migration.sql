/*
  Warnings:

  - You are about to drop the column `PIN` on the `Item` table. All the data in the column will be lost.
  - Added the required column `description` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Item_PIN_key";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "PIN",
ADD COLUMN     "description" VARCHAR(255) NOT NULL;
