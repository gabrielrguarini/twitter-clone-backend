/*
  Warnings:

  - You are about to drop the column `bit` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "bit",
ADD COLUMN     "bio" TEXT;
