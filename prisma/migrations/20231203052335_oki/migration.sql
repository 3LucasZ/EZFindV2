/*
  Warnings:

  - You are about to alter the column `lastSeen` on the `Module` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "Module" ALTER COLUMN "lastSeen" SET DATA TYPE VARCHAR(255);
