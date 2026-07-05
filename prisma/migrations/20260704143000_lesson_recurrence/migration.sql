-- Add whole-lesson reinforcement scheduling so completed lessons can reappear later.
ALTER TABLE "UserLessonProgress"
ADD COLUMN "reviewDueAt" TIMESTAMP(3),
ADD COLUMN "lastReviewedAt" TIMESTAMP(3),
ADD COLUMN "reviewIntervalDays" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN "lessonReviewCount" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX "UserLessonProgress_userId_reviewDueAt_idx" ON "UserLessonProgress"("userId", "reviewDueAt");
