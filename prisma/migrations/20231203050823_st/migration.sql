/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Module` table. All the data in the column will be lost.
  - Added the required column `lastSeen` to the `Module` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Module" DROP COLUMN "updatedAt",
ADD COLUMN     "lastSeen" TEXT NOT NULL;
