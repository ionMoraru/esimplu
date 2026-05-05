-- CreateTable: audit log des appels API d'import admin (Bearer token).
CREATE TABLE "ImportLog" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetId" TEXT,
    "targetSlug" TEXT,
    "payloadHash" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "status" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ImportLog_type_idx" ON "ImportLog"("type");
CREATE INDEX "ImportLog_createdAt_idx" ON "ImportLog"("createdAt");
CREATE INDEX "ImportLog_targetId_idx" ON "ImportLog"("targetId");
