# TODO

## High Priority

- Fix vocabulary deck progress. Completing or knowing words in a deck should update deck progress such as `City Transport 10/10`; currently it can remain `0/10` after clicking through the deck.
- Rework flashcards so the answer is not obvious before recall:
  - Front side should show the Spanish word and controls only.
  - Do not show the image before the learner chooses `Flip Card`.
  - Show the image together with the meaning after flipping.

## Pronunciation Follow-Up

- Keep two pronunciation options available: SpanishDict and LEO.
- Some provider-specific buttons can fail for words such as `el estudiante` and show `Audio unavailable`; acceptable for now as long as at least one source often works.
- Later improvement: show per-provider availability after resolving audio, instead of letting the user discover a failed provider by clicking.

## Navigation / Product Shape

- Review `Path` and `Dashboard`; they currently feel too similar.
- Consider merging them or making their roles clearer:
  - `Path`: main learning map and lesson progression.
  - `Dashboard`: quick daily summary, streaks, due reviews, rankings, and next recommended action.
