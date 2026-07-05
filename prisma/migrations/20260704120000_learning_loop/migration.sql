-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN "outcomesJson" JSONB;
ALTER TABLE "Lesson" ADD COLUMN "conceptKeys" JSONB;
ALTER TABLE "Lesson" ADD COLUMN "reviewSummary" TEXT;

-- CreateTable
CREATE TABLE "MistakeEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT,
    "wordId" TEXT,
    "lessonId" TEXT,
    "topicId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'LESSON',
    "submittedAnswer" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "errorCategory" TEXT NOT NULL,
    "feedbackMessage" TEXT NOT NULL,
    "weakSpotKey" TEXT NOT NULL,
    "occurrenceCount" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastOccurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MistakeEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MistakeEvent_userId_lastOccurredAt_idx" ON "MistakeEvent"("userId", "lastOccurredAt");

-- CreateIndex
CREATE INDEX "MistakeEvent_userId_errorCategory_idx" ON "MistakeEvent"("userId", "errorCategory");

-- CreateIndex
CREATE INDEX "MistakeEvent_weakSpotKey_idx" ON "MistakeEvent"("weakSpotKey");

-- AddForeignKey
ALTER TABLE "MistakeEvent" ADD CONSTRAINT "MistakeEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MistakeEvent" ADD CONSTRAINT "MistakeEvent_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MistakeEvent" ADD CONSTRAINT "MistakeEvent_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MistakeEvent" ADD CONSTRAINT "MistakeEvent_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MistakeEvent" ADD CONSTRAINT "MistakeEvent_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "GrammarTopic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
