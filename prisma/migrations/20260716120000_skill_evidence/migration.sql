ALTER TABLE "WordAttempt"
ADD COLUMN "activityMode" TEXT NOT NULL DEFAULT '';

CREATE TABLE "SkillAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "isSuccessful" BOOLEAN NOT NULL,
    "usedSupport" BOOLEAN NOT NULL DEFAULT false,
    "sourceKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkillAttempt_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SkillAttempt_userId_createdAt_idx" ON "SkillAttempt"("userId", "createdAt");
CREATE INDEX "SkillAttempt_userId_skill_idx" ON "SkillAttempt"("userId", "skill");

ALTER TABLE "SkillAttempt"
ADD CONSTRAINT "SkillAttempt_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
