-- Existing completed lessons predate whole-lesson recurrence.
-- Give them a reinforcement due date so they can reappear in the learning path.
UPDATE "UserLessonProgress"
SET
  "reviewDueAt" = "completedAt" + INTERVAL '1 day',
  "lastReviewedAt" = "completedAt"
WHERE "completedAt" IS NOT NULL
  AND "reviewDueAt" IS NULL;
