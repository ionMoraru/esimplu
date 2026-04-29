/*
  Warnings:

  - A unique constraint covering the columns `[claimToken]` on the table `ServiceListing` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ServiceStatus" ADD VALUE 'DRAFT';
ALTER TYPE "ServiceStatus" ADD VALUE 'OWNER_REFUSED';
ALTER TYPE "ServiceStatus" ADD VALUE 'EXPIRED';

-- AlterTable
ALTER TABLE "ServiceListing" ADD COLUMN     "claimExpiresAt" TIMESTAMP(3),
ADD COLUMN     "claimMethod" TEXT,
ADD COLUMN     "claimToken" TEXT,
ADD COLUMN     "claimedAt" TIMESTAMP(3),
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "sourceUrl" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ServiceClaimEvent" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceClaimEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServiceClaimEvent_serviceId_idx" ON "ServiceClaimEvent"("serviceId");

-- CreateIndex
CREATE INDEX "ServiceClaimEvent_type_idx" ON "ServiceClaimEvent"("type");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceListing_claimToken_key" ON "ServiceListing"("claimToken");

-- CreateIndex
CREATE INDEX "ServiceListing_status_idx" ON "ServiceListing"("status");

-- CreateIndex
CREATE INDEX "ServiceListing_claimExpiresAt_idx" ON "ServiceListing"("claimExpiresAt");

-- AddForeignKey
ALTER TABLE "ServiceClaimEvent" ADD CONSTRAINT "ServiceClaimEvent_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "ServiceListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
