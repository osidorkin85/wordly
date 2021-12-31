/*
  Warnings:

  - The primary key for the `Text` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Text" DROP CONSTRAINT "Text_pkey",
ADD CONSTRAINT "Text_pkey" PRIMARY KEY ("createdAt");
