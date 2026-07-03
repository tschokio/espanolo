-- AlterTable
ALTER TABLE "AssetPrompt" ADD COLUMN     "imagePath" TEXT;

-- AlterTable
ALTER TABLE "GrammarTopic" ADD COLUMN     "imageKey" TEXT;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "imageKey" TEXT;

-- AlterTable
ALTER TABLE "VocabularyGroup" ADD COLUMN     "imageKey" TEXT;
