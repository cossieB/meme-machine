-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "editDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
