CREATE TABLE "DeferredPractice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeferredPractice_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DeferredPractice_userId_exerciseId_channel_key"
ON "DeferredPractice"("userId", "exerciseId", "channel");

CREATE INDEX "DeferredPractice_userId_completedAt_dueAt_idx"
ON "DeferredPractice"("userId", "completedAt", "dueAt");

ALTER TABLE "DeferredPractice"
ADD CONSTRAINT "DeferredPractice_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DeferredPractice"
ADD CONSTRAINT "DeferredPractice_exerciseId_fkey"
FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
