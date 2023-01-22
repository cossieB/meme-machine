-- AlterTable
ALTER TABLE "User" ADD COLUMN     "banner" TEXT;

-- CreateTable
CREATE TABLE "MemesLikedByUser" (
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MemesLikedByUser_pkey" PRIMARY KEY ("postId","userId")
);

-- CreateTable
CREATE TABLE "FollowerFollowee" (
    "followerId" TEXT NOT NULL,
    "followeeId" TEXT NOT NULL,

    CONSTRAINT "FollowerFollowee_pkey" PRIMARY KEY ("followeeId","followerId")
);

-- AddForeignKey
ALTER TABLE "MemesLikedByUser" ADD CONSTRAINT "MemesLikedByUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemesLikedByUser" ADD CONSTRAINT "MemesLikedByUser_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Meme"("postId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowerFollowee" ADD CONSTRAINT "FollowerFollowee_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowerFollowee" ADD CONSTRAINT "FollowerFollowee_followeeId_fkey" FOREIGN KEY ("followeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
