# Implementation Plan

This plan turns the learning roadmap into concrete project work. Each milestone should be implemented, verified, and committed before moving to the next large change.

## Guiding Principles

- Keep the learner in one daily flow: review, lesson, words, production, optional play.
- Prefer active recall over passive recognition.
- Make every lesson testable.
- Add content in units, not random standalone lessons.
- Preserve the existing app strengths: review scheduling, images, audio lab, mini games, and admin tools.
- After each bigger completed change, commit automatically.

## Milestone 1: Curriculum Structure

Goal: make the lesson path visibly organized by unit and CEFR level.

Tasks:

- Add a documented unit structure for A1, A2, B1, and advanced phases.
- Decide whether units live only in seed metadata first or need a Prisma `Unit` model.
- Group existing A1 lessons into units.
- Show unit headings and checkpoint status in the Course tab.
- Add unit progress to the dashboard.

Deliverable: Course tab reads like a real curriculum, not a flat lesson list.

## Milestone 1.5: Asset QA and Visual Alignment

Goal: make every visible quiz and lesson image support the actual question.

Tasks:

- Audit all current lesson and exercise `imageKey` values.
- Replace generic or confusing images in active quiz cards.
- Use reward imagery only for completion, progress, badges, and challenge summaries.
- Create the next asset backlog from `asset-roadmap.md`.
- Run `npm run assets:audit` before committing quiz, lesson, or asset mapping changes.

Deliverable: no active question shows a strange or unrelated picture.

## Milestone 2: A1 Audit and Checkpoints

Goal: finish and validate the current beginner base before expanding.

Tasks:

- Audit all existing A1 lessons for duplicates, missing accents, weak summaries, and inconsistent lesson names.
- Add A1 checkpoints every 10-15 lessons.
- Add final A1 foundations checkpoint with mixed grammar, vocabulary, and typing recall.
- Ensure review items are created from checkpoint mistakes.
- Add admin labels for checkpoint lessons.

Deliverable: learner can complete A1 in units and prove mastery through mixed tests.

## Milestone 3: Exercise Type Expansion

Goal: support richer learning than multiple choice and basic sentence building.

New exercise types:

- `SHORT_ANSWER`: type a phrase or sentence.
- `TRANSFORMATION`: rewrite a sentence, such as singular to plural.
- `DIALOGUE_REPLY`: choose or type the natural response.
- `CONJUGATION`: fill a verb form.
- `LISTENING_DICTATION`: hear audio and type what was said.
- `WRITING_PROMPT`: compare learner output to model answers.

Tasks:

- Extend schema and API safely.
- Add rendering components in `PracticePanel`.
- Add evaluation helpers in `server/learning-core.js`.
- Add tests for answer normalization and partial accepted answers.

Deliverable: lessons can train real production, not only recognition.

## Milestone 4: A2 Curriculum Build

Goal: add the next real learning layer after A1.

Unit order:

1. Daily routine and time.
2. Irregular present verbs.
3. Useful verb frames: poder, querer, tener que, ir a.
4. Gustar and preferences.
5. Reflexive verbs.
6. Object pronouns.
7. Preterite past.
8. Imperfect past.
9. Practical scenarios.

Tasks:

- Seed lessons, exercises, and vocabulary for each A2 unit.
- Add A2 checkpoints.
- Expand image usage where possible.
- Add audio practice for high-frequency phrases.

Deliverable: learner can describe routine, plans, preferences, and simple past events.

## Milestone 5: Conjugation Trainer

Goal: make verb forms trainable outside normal lessons.

Features:

- Filter by tense, verb family, person, and difficulty.
- Show infinitive, pronoun, and English cue.
- Require typed Spanish form.
- Track weak verbs and weak endings.
- Feed mistakes into Review.

Suggested first tenses:

- Present regular.
- Present irregular.
- Preterite regular.
- Imperfect.
- Near future.

Deliverable: a dedicated trainer that reinforces lesson grammar.

## Milestone 6: Dialogue and Scenario Practice

Goal: make Spanish usable in realistic contexts.

Scenario packs:

- Introducing yourself.
- Ordering food.
- Asking directions.
- Hotel check-in.
- Doctor/pharmacy.
- Shopping and prices.
- Making plans.
- Explaining a problem.

Features:

- Multi-turn dialogue.
- Hidden answers until response.
- Natural response feedback.
- Role labels and context.
- Final scenario score.

Deliverable: learner can practice controlled conversations alone.

## Milestone 7: Listening and Reading Labs

Goal: move from sentence drills into comprehension.

Listening features:

- Audio prompt with transcript hidden.
- Replay controls.
- Dictation and comprehension questions.
- Transcript reveal after submission.
- Save unknown words to vocabulary review.

Reading features:

- Graded short texts by CEFR level.
- Click-to-save vocabulary.
- Comprehension quiz.
- Summary prompt.
- Weak vocabulary extraction.

Deliverable: the app supports input practice, not only grammar drills.

## Milestone 8: B1 Bridge

Goal: add intermediate grammar and communication.

Units:

- Past tense control.
- Present perfect.
- Future and conditional.
- Por vs para.
- Se constructions.
- Subjunctive introduction.
- Opinions and explanations.
- Storytelling.
- Reading and listening comprehension.

Deliverable: learner can explain experiences, opinions, problems, and plans.

## Milestone 9: Advanced Maintenance

Goal: keep the app useful after the learner is no longer a beginner.

Features:

- Custom vocabulary import.
- Article mode.
- Shadowing mode.
- Monthly fluency test.
- Topic packs.
- Writing prompts with rubrics.
- Advanced idioms and expressions.

Deliverable: Espanolo becomes a long-term Spanish practice system.

## Next 10 Concrete Steps

1. Add unit metadata to existing seed lessons.
2. Audit current lesson and quiz images for mismatches.
3. Replace confusing active quiz images with matching `imageKey` values.
4. Show unit grouping in the Course tab.
5. Add checkpoint lesson type and visual state.
6. Create A1 checkpoint exercises for units A1.0-A1.3.
7. Add `SHORT_ANSWER` exercise support.
8. Add `TRANSFORMATION` exercise support.
9. Add A2 unit skeletons to seed data.
10. Build first A2 unit: Daily Routine and Time.

## Definition of Done

For content changes:

- Lessons have goals, examples, vocabulary, exercises, and review summaries.
- Images match the actual prompt, word, or scenario.
- `npm run assets:audit` passes when image mappings changed.
- Exercises can be completed without seeing answers first.
- Mistakes flow into Review.
- Seed data runs cleanly.

For app changes:

- `npm test` passes.
- `npm run build` passes.
- Relevant API or logic checks pass.
- UI is usable on desktop and mobile.
- Change is committed after verification.
