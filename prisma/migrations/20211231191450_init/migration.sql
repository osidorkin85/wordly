/*
  Warnings:

  - A unique constraint covering the columns `[createdAt]` on the table `Text` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Text" ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "createdAt" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Text_createdAt_key" ON "Text"("createdAt");
