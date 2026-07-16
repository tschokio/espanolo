ALTER TABLE "DeferredPractice"
ALTER COLUMN "exerciseId" DROP NOT NULL;

ALTER TABLE "DeferredPractice"
ADD COLUMN "lessonId" TEXT;

CREATE UNIQUE INDEX "DeferredPractice_userId_lessonId_channel_key"
ON "DeferredPractice"("userId", "lessonId", "channel");

ALTER TABLE "DeferredPractice"
ADD CONSTRAINT "DeferredPractice_lessonId_fkey"
FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DeferredPractice"
ADD CONSTRAINT "DeferredPractice_exactly_one_target_check"
CHECK (("exerciseId" IS NOT NULL AND "lessonId" IS NULL) OR ("exerciseId" IS NULL AND "lessonId" IS NOT NULL));
