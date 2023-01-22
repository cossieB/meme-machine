/*
  Warnings:

  - You are about to drop the column `username_lower` on the `User` table. All the data in the column will be lost.
  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "User_username_lower_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username_lower",
ALTER COLUMN "username" SET NOT NULL,
ALTER COLUMN "username" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "Meme" (
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" VARCHAR(100) NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Meme_pkey" PRIMARY KEY ("postId")
);

-- AddForeignKey
ALTER TABLE "Meme" ADD CONSTRAINT "Meme_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
