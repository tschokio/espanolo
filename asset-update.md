# Quiz and Lesson Asset Update

This catalog is the result of a full audit of the reconciled learning surface: 79 published lessons, 1,141 live quiz exercises, 228 vocabulary entries, 26 image sheets, and 685 source image references.

## Important audit finding

The reported `el ojo` problem does **not** require a new eye picture. The existing `body-and-health:3` cell is already a clear, tightly cropped eye. The live word record incorrectly pointed to `emotions-and-states:10`, which is a person sitting at a table choosing between an apple and a doughnut. The same stale-data problem affected the hand, mouth, foot, body, and most nature words. Those are mapping fixes, not generation work.

Existing sheets that should be retained:

- `body-and-health.webp`: head, hand, eye, mouth, foot, full body, hunger, thirst, hot, cold, and doctor cells are clear.
- `nature-and-animals.webp`: the tree, flower, dog, cat, bird, sun, rain, beach, and water cells are clear.
- `food-and-ordering.webp`, `fruit-and-produce.webp`, `home-objects.webp`, `classroom-basics.webp`, and `clothing-basics.webp`: the individual-object cells are generally specific and usable.
- The A2 action sheets are generally well framed and should be remapped where necessary rather than regenerated.

## New sheets required

| Priority | Proposed sheet | Grid | What it fixes |
| --- | --- | --- | --- |
| 1 | `quantities-and-clear-colors.webp` | 5x5 | Missing pictures for six through ten; color questions that currently fall back to a mixed swatch sheet or unrelated object. |
| 1 | `subject-pronouns-and-roles.webp` | 4x4 | `él`, `ella`, `nosotros`, and `ellos` currently use generic work/group scenes that include distracting furniture and do not identify the referent clearly. |
| 1 | `communication-repair.webp` | 4x4 | “I do not understand,” “more slowly,” “repeat,” “help,” “please,” “sorry,” and other repair phrases currently reuse generic conversation, menu, or travel scenes. |
| 1 | `directions-and-question-intents.webp` | 5x5 | “Go straight,” “turn left,” near/far, address/direction, and question-word exercises do not have precise visual support. |
| 1 | `pharmacy-and-medicine.webp` | 4x4 | Medicine, allergy, dosage frequency, and pharmacist questions currently reuse a doctor portrait or a generic pharmacy shelf. |
| 2 | `object-location-scenes.webp` | 5x5 | Exact location sentences such as “the book is on the table,” “the backpack is on the chair,” and “the keys are in the kitchen” currently show only one noun or a different object relationship. |
| 2 | `wants-needs-and-possession.webp` | 4x4 | High-frequency `quiero`, `necesito`, and `tengo` questions currently show only the object and not the intended practical situation. |

## Shared generation contract

Apply every rule below to every prompt in this file:

- Produce one square sheet, not separate image files.
- Use the exact grid requested. Every cell must have equal width and height with straight, consistent gutters.
- Each cell must be independently croppable. Nothing may cross a gutter or continue into another cell.
- Put exactly one primary learning concept in each cell.
- Make the primary subject fill roughly 70–82% of the cell. Avoid zoomed-out rooms unless the room itself is the vocabulary target.
- Use a consistent polished, friendly educational-app illustration style, bright natural colors, soft shadows, and simple pale backgrounds.
- Keep faces, hands, body parts, objects, and direction gestures anatomically correct.
- No readable text, letters, digits, captions, labels, logos, brands, flags, watermarks, speech bubbles, menus with writing, road-sign writing, UI, or decorative typography.
- Do not add unrelated tables, food, furniture, people, or scenery. Props are allowed only when necessary to communicate the target.
- Do not use a generic portrait when the target is a body part, object, direction, symptom, or action.
- Do not use borders drawn through a subject. Leave safe space around every cell edge.

## Prompt 1: Quantities and Clear Colors, 5x5

Target file: `images/quantities-and-clear-colors.webp`

```text
Create a 1200x1200 square educational Spanish-learning image sheet divided into a mathematically precise 5x5 grid. Every cell is exactly 240x240 pixels. Use equal clean gutters and obey the shared generation contract.

Purpose: unmistakable quantity recognition from one through ten and unmistakable beginner color recognition. For cells 1–10, use identical small blue wooden counting disks, all fully visible, separated, non-overlapping, and arranged in tidy rows. The learner must be able to count every disk instantly. Do not use digits. For cells 16–21, show one large centered matte wooden color tile; do not add any second color except a thin medium-gray outline around the white tile so it remains visible.

Cells, left to right and top to bottom:
1. Exactly one blue counting disk.
2. Exactly two blue counting disks.
3. Exactly three blue counting disks.
4. Exactly four blue counting disks.
5. Exactly five blue counting disks.
6. Exactly six blue counting disks in two rows of three.
7. Exactly seven blue counting disks in rows of four and three.
8. Exactly eight blue counting disks in two rows of four.
9. Exactly nine blue counting disks in three rows of three.
10. Exactly ten blue counting disks in two rows of five.
11. Exactly six separate purple grapes, not a large bunch and not more than six.
12. Exactly seven separate closed books, all fully visible and easy to count.
13. Exactly eight separate red apples, all fully visible and easy to count.
14. Exactly nine separate strawberries, all fully visible and easy to count.
15. Exactly ten separate small round counters in two rows of five.
16. One large pure red wooden color tile.
17. One large pure blue wooden color tile.
18. One large pure green wooden color tile.
19. One large pure yellow wooden color tile.
20. One large pure white wooden color tile with only a thin gray outline.
21. One large pure black wooden color tile.
22. One centered red tomato whose redness is visually dominant.
23. One centered blue shirt whose blueness is visually dominant.
24. One centered bowl of green salad whose greenness is visually dominant.
25. One centered yellow banana whose yellowness is visually dominant.

Critical checks: exact object counts are mandatory; no hidden or overlapping objects; no extra fruit, books, disks, digits, or labels.
```

## Prompt 2: Subject Pronouns and Roles, 4x4

Target file: `images/subject-pronouns-and-roles.webp`

```text
Create a 1200x1200 square educational Spanish-learning image sheet divided into a mathematically precise 4x4 grid. Every cell is exactly 300x300 pixels. Use equal clean gutters and obey the shared generation contract.

Purpose: show who a pronoun refers to without text. Use one consistent cast of friendly adults. In cells with several people, render the intended referent in normal saturated color and secondary people in softly desaturated color. Use clear gaze, pointing, and body orientation; never use arrows, letters, or labels.

Cells:
1. “I / yo”: one adult man, chest-up, clearly pointing to his own chest, no table or props.
2. “I / yo”: one adult woman, chest-up, clearly pointing to her own chest, no table or props.
3. “You / tú”: over-the-shoulder view of a speaker gently indicating one highlighted familiar listener directly in front of them.
4. “He / él”: one isolated adult man portrait, centered from chest up, completely plain background, no work desk or props.
5. “She / ella”: one isolated adult woman portrait, centered from chest up, completely plain background, no props.
6. “We / nosotros”: a foreground speaker touching their chest while standing inside a highlighted group of three that clearly includes the speaker.
7. “They / ellos”: a foreground observer at the edge indicating a separate highlighted group of three people across from them.
8. One person standing alone, full figure, neutral pose.
9. Two friends greeting each other face to face.
10. One male student holding a closed blank notebook, no desk.
11. One female student holding a closed blank notebook, no desk.
12. One male teacher standing beside a completely blank board.
13. One female teacher standing beside a completely blank board.
14. A close, centered family group with minimal background.
15. A centered group of four adults in conversation, no table, laptop, drinks, or room clutter.
16. One person visibly speaking to one attentive listener, both chest-up, no props.

Critical checks: cells 4 and 5 must be clean single-person portraits; cells 6 and 7 must make inclusion versus separation visually obvious; no office furniture.
```

## Prompt 3: Communication Repair and Politeness, 4x4

Target file: `images/communication-repair.webp`

```text
Create a 1200x1200 square educational Spanish-learning image sheet divided into a mathematically precise 4x4 grid. Every cell is exactly 300x300 pixels. Use equal clean gutters and obey the shared generation contract.

Purpose: practical beginner phrases for starting, repairing, and ending a conversation. Keep two recurring adult characters chest-up whenever possible. Facial expression and gesture must carry the meaning; use no speech bubbles, punctuation, letters, or text.

Cells:
1. Hello: two adults smiling and waving as they meet.
2. My name is: one adult introducing herself with an open friendly expression and a hand lightly on her chest.
3. I am from: traveler indicating themself beside a small unlabeled globe and suitcase, tightly framed.
4. Thank you: one person receiving a helpful item with visibly grateful expression and hands.
5. Please / polite request: one person making a calm respectful open-palm request to another.
6. Sorry / apology: one person apologizing sincerely with hand on chest while the other listens.
7. Excuse me: traveler politely getting a passerby’s attention with a small raised hand.
8. I do not understand: confused listener with furrowed brow and open empty hands while a speaker talks.
9. More slowly: listener making a clear gentle slowing-down gesture with both palms lowered while the speaker pauses.
10. Please repeat: listener leaning in with one hand cupped behind the ear while the speaker prepares to repeat.
11. I need help: worried traveler asking a calm local person for assistance.
12. How much does it cost: customer pointing to one simple item while holding an open wallet, no price tag or digits.
13. The bill, please: restaurant customer politely signaling a waiter beside a closed blank bill folder; no food clutter.
14. What do you recommend: customer choosing between two simple dishes while a waiter gestures helpfully.
15. Goodbye: two adults smiling and waving as they leave in opposite directions.
16. Successful conversation: the same two adults smiling with relaxed thumbs-up gestures after understanding each other.

Critical checks: cell 8 must look confused, not refusing food; cells 9 and 10 must be visibly different; restaurant cells must remain tightly framed.
```

## Prompt 4: Directions, Distance, and Question Intents, 5x5

Target file: `images/directions-and-question-intents.webp`

```text
Create a 1200x1200 square educational Spanish-learning image sheet divided into a mathematically precise 5x5 grid. Every cell is exactly 240x240 pixels. Use equal clean gutters and obey the shared generation contract.

Purpose: clear navigation instructions, near/far relationships, and visual intent for common question words. Use simple streets and isolated landmarks. Direction must be communicated by path shape, body movement, and gesture; signs must be blank and contain no arrows made from text.

Cells:
1. Go straight: rear view of a pedestrian continuing directly ahead on one straight uncluttered path.
2. Turn left: rear view of a pedestrian beginning a very clear left turn at an L-shaped corner.
3. Turn right: rear view of a pedestrian beginning a very clear right turn at an L-shaped corner.
4. Near: one person standing immediately beside a small store entrance.
5. Far: one person in foreground looking toward a clearly distant building across a long open path.
6. Address / destination: traveler comparing a blank card with a single marked building entrance; no writing.
7. Ask for directions: traveler with a blank folded map asking one local person.
8. Show directions: local person pointing along a route on a blank map held between two people.
9. Where is the hotel: traveler looking between a suitcase and a visible hotel reception entrance.
10. Where is the station: traveler pointing toward a clearly visible train platform.
11. Where is the museum: traveler looking toward a museum entrance with sculptures and no sign.
12. Where is the restaurant: traveler looking toward a restaurant entrance with one set table visible.
13. Street intersection viewed clearly from above at a gentle angle.
14. Simple street corner with a pedestrian choosing a direction.
15. Crosswalk with one pedestrian crossing safely.
16. Blank city map with one route and one destination marker, no labels.
17. Train platform search: traveler scanning two platform entrances with blank signs.
18. Local person giving a single clear straight-ahead hand gesture.
19. Local person giving a single clear left-turn hand gesture.
20. What: person choosing between two distinct objects held in open hands.
21. Who: one person indicating a specific highlighted person in a small group.
22. Where: traveler searching for one landmark while holding a blank map.
23. When: person comparing a blank calendar and a simple clock with no digits.
24. How: learner watching another person demonstrate a simple action step.
25. How much: customer holding an open wallet while indicating one store item with no price label.

Critical checks: left and right turns must not be mirrored or ambiguous; near and far must use the same basic scale relationship; no readable road signs.
```

## Prompt 5: Pharmacy and Medicine, 4x4

Target file: `images/pharmacy-and-medicine.webp`

```text
Create a 1200x1200 square educational Spanish-learning image sheet divided into a mathematically precise 4x4 grid. Every cell is exactly 300x300 pixels. Use equal clean gutters and obey the shared generation contract.

Purpose: specific pharmacy vocabulary, symptoms, allergy safety, and medicine-frequency questions. Use clean friendly medical illustrations. All medicine packaging must be completely blank and generic; no brand marks, letters, dosage numbers, or medical claims.

Cells:
1. One generic medicine bottle and one blister pack, tightly centered, blank packaging.
2. Pharmacist behind a clean counter with a few blank medicine packages, tightly framed.
3. Customer politely asking a pharmacist for medicine.
4. Person with a clear headache, both hands at temples.
5. Person with clear foot pain, seated and gently holding one foot; foot is prominent.
6. Person indicating general body pain with tense posture and hands at shoulders.
7. Medicine allergy: person with a visible mild red rash on forearm refusing a blister pack offered by another hand.
8. Allergy to a pill: close-up of one generic pill beside a clearly separate warning-style crossed circle symbol, no text.
9. Asking how often: patient holding a blank medicine bottle while looking between a simple no-digit clock and blank calendar.
10. Morning dose concept: medicine beside a glass of water in bright sunrise light, no clock digits.
11. Evening dose concept: medicine beside a glass of water in dark evening light, no clock digits.
12. Doctor listening attentively to a patient describing a symptom, tightly framed.
13. Pharmacist explaining medicine use with one bottle and a simple clock, no text or digits.
14. Customer showing an allergy-information card that is completely blank while refusing medicine.
15. Resting in bed with water and generic medicine on a nearby stand, subject centered.
16. Drinking water while taking one generic pill safely, close-up educational framing.

Critical checks: cell 7 must unmistakably show an allergy rather than ordinary pain; cell 9 must communicate frequency without digits; do not use a doctor portrait as the medicine image.
```

## Prompt 6: Exact Object Location Scenes, 5x5

Target file: `images/object-location-scenes.webp`

```text
Create a 1200x1200 square educational Spanish-learning image sheet divided into a mathematically precise 5x5 grid. Every cell is exactly 240x240 pixels. Use equal clean gutters and obey the shared generation contract.

Purpose: exact concrete scenes for estar and beginner prepositions. Keep rooms extremely simple. The named objects and their relationship must dominate each cell.

Cells:
1. One closed book centered on top of a simple table.
2. One backpack centered on the seat of a simple chair.
3. One set of keys clearly visible on a clean kitchen counter.
4. One pencil centered on top of a simple table.
5. One drinking glass centered on top of a simple table.
6. One ball directly under a chair.
7. One backpack directly beside a desk.
8. One lamp on top of a side table.
9. One book directly under a chair.
10. One key directly beside a book.
11. One cup on top of a table.
12. One cat sitting on a chair.
13. One small bird perched in a tree.
14. One tree standing inside a simple park.
15. One store immediately beside a café, both entrances distinct and with no signs.
16. One person inside a café, café setting clear but tightly framed.
17. One person inside a library between two book shelves.
18. One person inside a home doorway.
19. One person inside a train station beside a platform.
20. One person inside a museum beside one sculpture.
21. A store very near a person, with only a short gap.
22. A museum very far from a person, with a long open gap.
23. A train station very near a hotel, both buildings distinct.
24. A restaurant directly beside a plaza fountain.
25. A suitcase directly beside a hotel-room door.

Critical checks: never substitute a different object; relationships such as on, under, beside, inside, near, and far must be unmistakable at thumbnail size.
```

## Prompt 7: Wants, Needs, and Possession, 4x4

Target file: `images/wants-needs-and-possession.webp`

```text
Create a 1200x1200 square educational Spanish-learning image sheet divided into a mathematically precise 4x4 grid. Every cell is exactly 300x300 pixels. Use equal clean gutters and obey the shared generation contract.

Purpose: precise practical scenes for quiero, necesito, tengo, and no tengo. Use clear hands, gaze, and context. Do not use thought bubbles, words, checkmarks, or X marks.

Cells:
1. I have a map: traveler confidently holding an open blank map close to their chest.
2. I do not have a map: traveler searching an obviously empty open backpack with confused expression.
3. I need the keys: person at a locked door searching urgently for keys.
4. I have a key: person clearly holding up one key beside a door.
5. I have a backpack: person wearing and holding the straps of one backpack.
6. I need a passport: traveler at an airport counter searching an empty document pocket.
7. I have a passport: traveler clearly holding one blank passport booklet.
8. I want water: thirsty customer reaching toward one glass of water.
9. I want coffee: customer politely indicating one cup of coffee at a counter.
10. I want an orange: shopper selecting one orange from a small produce display.
11. We need a table: two restaurant customers waiting while indicating an empty table for two.
12. I need help: worried traveler asking one calm local person for help.
13. I need a taxi: traveler with suitcase hailing one clearly visible taxi.
14. I need a doctor: unwell person speaking to a doctor with stethoscope.
15. I am going to bring a bag: person arriving while carrying one bag prominently.
16. I give the book to Ana: one person clearly handing one book to a woman.

Critical checks: possession and absence must be conveyed by the physical situation, not by symbols or text; each requested object must be large and unmistakable.
```

## Integration order after generation

1. Generate and visually inspect each complete sheet before adding any key.
2. Reject a sheet if a cell has the wrong count, mirrored direction, extra prop, readable text, or a subject smaller than roughly 70% of the usable cell.
3. Save as WebP at the target path without changing grid order.
4. Register the sheet and grid size in `src/App.jsx`.
5. Add the sheet metadata to the seed asset catalog.
6. Replace the temporary `null` quantity mappings and best-fit fallback mappings with exact new cell keys.
7. Run the main seed and supplemental lesson-practice seed so existing database rows receive the corrected keys.
8. Run `npm run assets:audit`, `npm test`, and `npm run build`.
