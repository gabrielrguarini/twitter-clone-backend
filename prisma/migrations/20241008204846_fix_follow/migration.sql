/*
  Warnings:

  - You are about to drop the column `user1` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `user2` on the `Follow` table. All the data in the column will be lost.
  - Added the required column `user1Slug` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user2Slug` to the `Follow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Follow" DROP COLUMN "user1",
DROP COLUMN "user2",
ADD COLUMN     "user1Slug" TEXT NOT NULL,
ADD COLUMN     "user2Slug" TEXT NOT NULL;
