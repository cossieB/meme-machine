/*
  Warnings:

  - Made the column `username_lower` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "username_lower" SET NOT NULL;
