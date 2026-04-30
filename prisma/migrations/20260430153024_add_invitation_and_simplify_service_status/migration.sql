-- CreateEnum
CREATE TYPE "InvitationTargetType" AS ENUM ('SERVICE', 'TRIP', 'PRODUCT');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'CLAIMED', 'REFUSED', 'EXPIRED');

-- AlterEnum
BEGIN;
CREATE TYPE "ServiceStatus_new" AS ENUM ('PENDING', 'REJECTED');
ALTER TABLE "public"."ServiceListing" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ServiceListing" ALTER COLUMN "status" TYPE "ServiceStatus_new" USING ("status"::text::"ServiceStatus_new");
ALTER TYPE "ServiceStatus" RENAME TO "ServiceStatus_old";
ALTER TYPE "ServiceStatus_new" RENAME TO "ServiceStatus";
DROP TYPE "public"."ServiceStatus_old";
ALTER TABLE "ServiceListing" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "ServiceClaimEvent" DROP CONSTRAINT "ServiceClaimEvent_serviceId_fkey";

-- DropIndex
DROP INDEX "ServiceListing_claimExpiresAt_idx";

-- DropIndex
DROP INDEX "ServiceListing_claimToken_key";

-- AlterTable
ALTER TABLE "ServiceListing" DROP COLUMN "claimExpiresAt",
DROP COLUMN "claimMethod",
DROP COLUMN "claimToken",
DROP COLUMN "claimedAt",
DROP COLUMN "sourceUrl";

-- DropTable
DROP TABLE "ServiceClaimEvent";

-- CreateTable
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "targetType" "InvitationTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "sourceUrl" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "contactName" TEXT,
    "claimedAt" TIMESTAMP(3),
    "claimedById" TEXT,
    "refusedAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvitationEvent" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvitationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_token_key" ON "Invitation"("token");

-- CreateIndex
CREATE INDEX "Invitation_targetType_targetId_idx" ON "Invitation"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "Invitation_status_idx" ON "Invitation"("status");

-- CreateIndex
CREATE INDEX "Invitation_expiresAt_idx" ON "Invitation"("expiresAt");

-- CreateIndex
CREATE INDEX "InvitationEvent_invitationId_idx" ON "InvitationEvent"("invitationId");

-- CreateIndex
CREATE INDEX "InvitationEvent_type_idx" ON "InvitationEvent"("type");

-- AddForeignKey
ALTER TABLE "InvitationEvent" ADD CONSTRAINT "InvitationEvent_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

