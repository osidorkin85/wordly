-- CreateTable
CREATE TABLE "Text" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "text" TEXT,

    CONSTRAINT "Text_pkey" PRIMARY KEY ("id")
);
