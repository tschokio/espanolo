import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    middlewareMode: false
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/lucide-react")) return "ui-vendor";
          if (
            id.includes("/src/course-sentence-meanings.mjs") ||
            id.includes("/src/learning-localization-core.mjs") ||
            id.includes("/src/word-localization-core.mjs") ||
            id.includes("/src/b2-word-localization.mjs") ||
            id.includes("/src/c1-c2-word-localization.mjs") ||
            id.includes("/src/speaking-library-localization.mjs") ||
            id.includes("/src/speaking-practice-core.mjs") ||
            id.includes("/src/SpeakingRoundStatus.jsx") ||
            id.includes("/src/word-catcher-core.mjs") ||
            id.includes("/src/daily-learning-core.mjs") ||
            id.includes("/src/conversation-core.mjs") ||
            id.includes("/src/lesson-pattern-core.mjs") ||
            id.includes("/src/recall-evaluation-core.mjs") ||
            id.includes("/src/sound-foundation-core.mjs") ||
            id.includes("/src/foundation-card-localization.mjs") ||
            id.includes("/src/topic-remember-points.mjs") ||
            id.includes("/src/exercise-question-localization.mjs") ||
            id.includes("/src/model-sentence-recall-core.mjs")
            || id.includes("/src/spanish-orthography-core.mjs")
            || id.includes("/src/spanish-content-core.mjs")
            || id.includes("/src/lesson-session-core.mjs")
            || id.includes("/src/lesson-phase-core.mjs")
            || id.includes("/src/lesson-resume-core.mjs")
            || id.includes("/src/foundation-check-core.mjs")
            || id.includes("/src/word-session-core.mjs")
            || id.includes("/src/connected-input-feedback.mjs")
            || id.includes("/src/connected-speech-core.mjs")
            || id.includes("/src/a1-context-bridge-core.mjs")
            || id.includes("/src/lesson-vocabulary-core.mjs")
            || id.includes("/src/LessonVocabularyLab.jsx")
            || id.includes("/src/SpanishCharacterBar.jsx")
            || id.includes("/src/image-sheet-catalog.mjs")
            || id.includes("/src/advanced-german-concept-titles.mjs")
          ) return "learning-content";
          if (id.includes("/src/MobileNavigation.jsx")) return "ui-shell";
          return undefined;
        }
      }
    }
  }
});
