-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "clerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "dpLink" TEXT NOT NULL,
    "coverImageLink" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "birthDay" TEXT,
    "email" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerId_key" ON "User"("clerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
