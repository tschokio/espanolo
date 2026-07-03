-- CreateTable
CREATE TABLE "WordAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "xpAwarded" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WordAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "state" "ReviewState" NOT NULL DEFAULT 'LEARNING',
    "intervalDays" INTEGER NOT NULL DEFAULT 1,
    "ease" DOUBLE PRECISION NOT NULL DEFAULT 2.3,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "lastAttemptAt" TIMESTAMP(3),
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "wrongCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WordReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WordAttempt_userId_createdAt_idx" ON "WordAttempt"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "WordAttempt_wordId_idx" ON "WordAttempt"("wordId");

-- CreateIndex
CREATE INDEX "WordReview_userId_dueAt_idx" ON "WordReview"("userId", "dueAt");

-- CreateIndex
CREATE UNIQUE INDEX "WordReview_userId_wordId_key" ON "WordReview"("userId", "wordId");

-- AddForeignKey
ALTER TABLE "WordAttempt" ADD CONSTRAINT "WordAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordAttempt" ADD CONSTRAINT "WordAttempt_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordReview" ADD CONSTRAINT "WordReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordReview" ADD CONSTRAINT "WordReview_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
