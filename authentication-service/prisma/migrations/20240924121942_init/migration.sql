-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "services";

-- CreateTable
CREATE TABLE "services"."Service" (
    "id" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services"."RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "services"."RefreshToken"("token");

-- AddForeignKey
ALTER TABLE "services"."RefreshToken" ADD CONSTRAINT "RefreshToken_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"."Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
