# Asset Roadmap

This document defines which new visual assets are needed as the Spanish curriculum expands. It also sets the rule for quiz visuals: every image shown during a lesson, quiz, review, or challenge must support the actual question being asked.

## Visual Alignment Rule

Use an image only when it matches the learning task.

Good examples:

- A food-ordering question shows food, menu, waiter, bill, or cafe imagery.
- A location question shows a place, map, room, street, or object placement.
- A health question shows body parts, doctor, pharmacy, or symptoms.
- A grammar concept question uses a clean grammar scene only when the image reinforces the concept.

Avoid:

- Random reward icons during normal questions.
- Generic illustrations that do not match the prompt.
- Pictures that reveal the answer before the learner responds.
- Reusing the same image for unrelated grammar questions.
- Decorative images inside focused quiz cards.

Completion, profile, badges, and rewards may use reward imagery. Active quiz questions should use content imagery.

## Asset QA Checklist

Before shipping new lessons or quizzes:

- Confirm every `imageKey` exists.
- Confirm every `imageKey` visually matches the lesson, word, or exercise.
- Confirm review mode does not reveal answer images before submission.
- Confirm wrong-answer feedback can reveal an image only after the attempt.
- Confirm fallback icons are rare and not used for core questions.
- Confirm generated images are clear at small card sizes.

## Current Asset Coverage

Existing sheets cover:

- Classroom basics.
- Daily actions.
- Emotions and states.
- Food and ordering.
- Fruit and produce.
- Grammar scenes.
- Home objects.
- Places around town.
- Travel and survival.
- Clothing basics.
- City transport.
- Weather and time.
- People and family.
- Body and health.
- Numbers and colors.
- Nature and animals.
- Rewards and progress.
- Mini-game UI rewards.

This is enough for the current A1 base, but A2/B1 content will need more scenario, verb, and communication imagery.

## New Sheets Needed

### A2 Daily Routine

Purpose: routine, reflexive verbs, time, and frequency.

Suggested cells:

- Wake up.
- Get up.
- Shower.
- Brush teeth.
- Get dressed.
- Eat breakfast.
- Go to work.
- Study.
- Cook dinner.
- Clean room.
- Go to bed.
- Read at night.
- Clock morning.
- Clock afternoon.
- Calendar week.
- Person tired after work.

### A2 Irregular Verbs

Purpose: high-frequency verbs that need repeated practice.

Suggested cells:

- Go to a store.
- Come home.
- Leave a house.
- Put object on table.
- Bring a bag.
- Say something.
- Do homework.
- Make food.
- See a sign.
- Hear music.
- Know a fact.
- Meet a person.
- Can open a door.
- Want a ticket.
- Have to work.
- Give an item.

### A2 Preferences and Hobbies

Purpose: gustar, encantar, preferir, hobbies, and opinions.

Suggested cells:

- Likes music.
- Likes movies.
- Likes soccer.
- Likes reading.
- Likes cooking.
- Likes travel.
- Likes coffee.
- Dislikes rain.
- Prefers tea.
- Prefers the beach.
- Favorite restaurant.
- Favorite color.
- Hobby class.
- Weekend activity.
- Bored person.
- Excited person.

### A2 Object Pronouns and Shopping

Purpose: lo, la, los, las, me, te, le, nos with concrete actions.

Suggested cells:

- Buying bread.
- Buying apples.
- Giving a book.
- Giving keys.
- Showing a map.
- Seeing a movie.
- Reading a menu.
- Calling a friend.
- Writing a message.
- Paying a bill.
- Carrying bags.
- Returning an item.
- Asking for help.
- Offering water.
- Sending a photo.
- Receiving a package.

### A2 Past Events

Purpose: preterite and imperfect story scenes.

Suggested cells:

- Yesterday at cafe.
- Last week trip.
- Childhood home.
- Old school.
- Person was tired.
- Person went to station.
- Person bought food.
- Person met a friend.
- Rain during trip.
- Lost passport.
- Found keys.
- Called doctor.
- Took bus.
- Worked yesterday.
- Studied last night.
- Walked in park.

### B1 Conversation and Opinion

Purpose: longer conversation, explanation, and disagreement.

Suggested cells:

- Two people discussing plans.
- Person explaining a problem.
- Person giving opinion.
- Friendly disagreement.
- Work meeting.
- Phone call.
- Asking for clarification.
- Apologizing.
- Making a recommendation.
- Comparing two options.
- Reading news.
- Writing email.
- Presenting idea.
- Planning a trip.
- Interview conversation.
- Group discussion.

### Reading and Listening Lab

Purpose: comprehension screens, articles, audio, transcript reveal.

Suggested cells:

- Reading short article.
- Listening with headphones.
- Transcript document.
- Highlighted vocabulary.
- Comprehension question.
- Notebook summary.
- Audio waveform.
- Podcast scene.
- News article.
- Story page.
- Dictionary lookup.
- Saved word list.
- Corrected writing.
- Speaking practice.
- Shadowing audio.
- Review notes.

## Prompt Template for New Sheets

Use this template for each new sheet:

```text
Create a [4x4 or 5x5] educational Spanish learning image sheet.
Style: clean, bright, consistent app illustration, simple background, readable at small card size, no text labels inside cells.
Subject: [sheet theme].
Each cell should show one clear concept only.
Avoid surreal objects, decorative symbols, random reward icons, or ambiguous scenes.
Output as a square WebP-compatible image sheet.

Cells:
1. [concept]
2. [concept]
...
```

## Copy-Paste Prompt Pack

Use these prompts directly when generating the next asset sheets.

### Prompt: A2 Daily Routine

```text
Create a 4x4 educational Spanish learning image sheet.
Style: clean, bright, consistent app illustration, simple background, readable at small card size, no text labels inside cells.
Subject: A2 daily routine, reflexive verbs, time, and frequency.
Each cell should show one clear concept only.
Avoid surreal objects, decorative symbols, random reward icons, text labels, flags, or ambiguous scenes.
Output as a square WebP-compatible image sheet.

Cells:
1. Person waking up in bed
2. Person getting out of bed
3. Person showering
4. Person brushing teeth
5. Person getting dressed
6. Person eating breakfast
7. Person going to work
8. Person studying at a desk
9. Person cooking dinner
10. Person cleaning a room
11. Person going to bed
12. Person reading at night
13. Clock showing morning
14. Clock showing afternoon
15. Weekly calendar
16. Person tired after work
```

### Prompt: A2 Irregular Verbs

```text
Create a 4x4 educational Spanish learning image sheet.
Style: clean, bright, consistent app illustration, simple background, readable at small card size, no text labels inside cells.
Subject: A2 high-frequency irregular Spanish verbs shown as concrete actions.
Each cell should show one clear concept only.
Avoid surreal objects, decorative symbols, random reward icons, text labels, flags, or ambiguous scenes.
Output as a square WebP-compatible image sheet.

Cells:
1. Person going to a store
2. Person coming home
3. Person leaving a house
4. Person putting an object on a table
5. Person bringing a bag
6. Person saying something in conversation
7. Person doing homework
8. Person making food
9. Person seeing a street sign
10. Person hearing music with headphones
11. Person knowing a fact with a lightbulb-style thought
12. Person meeting another person
13. Person able to open a door
14. Person wanting a ticket
15. Person having to work
16. Person giving an item to someone
```

### Prompt: A2 Preferences and Hobbies

```text
Create a 4x4 educational Spanish learning image sheet.
Style: clean, bright, consistent app illustration, simple background, readable at small card size, no text labels inside cells.
Subject: A2 preferences, hobbies, likes, dislikes, and simple opinions.
Each cell should show one clear concept only.
Avoid surreal objects, decorative symbols, random reward icons, text labels, flags, or ambiguous scenes.
Output as a square WebP-compatible image sheet.

Cells:
1. Person enjoying music
2. Person watching a movie
3. Person playing soccer
4. Person reading a book
5. Person cooking happily
6. Person enjoying travel with suitcase
7. Person enjoying coffee
8. Person annoyed by rain
9. Person choosing tea over coffee
10. Person choosing the beach
11. Favorite restaurant table
12. Person choosing a favorite color
13. Hobby class with teacher and learner
14. Weekend activity outdoors
15. Bored person
16. Excited person
```

### Prompt: A2 Object Pronouns and Shopping

```text
Create a 4x4 educational Spanish learning image sheet.
Style: clean, bright, consistent app illustration, simple background, readable at small card size, no text labels inside cells.
Subject: A2 object pronouns, shopping, giving, receiving, seeing, and asking.
Each cell should show one clear concept only.
Avoid surreal objects, decorative symbols, random reward icons, text labels, flags, or ambiguous scenes.
Output as a square WebP-compatible image sheet.

Cells:
1. Buying bread
2. Buying apples
3. Giving a book to someone
4. Giving keys to someone
5. Showing a map
6. Seeing a movie
7. Reading a menu
8. Calling a friend
9. Writing a message
10. Paying a bill
11. Carrying shopping bags
12. Returning an item at a store
13. Asking for help
14. Offering water
15. Sending a photo
16. Receiving a package
```

### Prompt: A2 Past Events

```text
Create a 4x4 educational Spanish learning image sheet.
Style: clean, bright, consistent app illustration, simple background, readable at small card size, no text labels inside cells.
Subject: A2 preterite and imperfect story scenes, past events, and background situations.
Each cell should show one clear concept only.
Avoid surreal objects, decorative symbols, random reward icons, text labels, flags, or ambiguous scenes.
Output as a square WebP-compatible image sheet.

Cells:
1. Yesterday at a cafe
2. Last week trip with suitcase
3. Childhood home memory
4. Old school memory
5. Person was tired
6. Person went to a train station
7. Person bought food
8. Person met a friend
9. Rain during a trip
10. Lost passport
11. Found keys
12. Called a doctor
13. Took a bus
14. Worked yesterday
15. Studied last night
16. Walked in a park
```

### Prompt: B1 Conversation and Opinion

```text
Create a 4x4 educational Spanish learning image sheet.
Style: clean, bright, consistent app illustration, simple background, readable at small card size, no text labels inside cells.
Subject: B1 Spanish conversation, opinions, explanations, disagreement, and planning.
Each cell should show one clear concept only.
Avoid surreal objects, decorative symbols, random reward icons, text labels, flags, or ambiguous scenes.
Output as a square WebP-compatible image sheet.

Cells:
1. Two people discussing plans
2. Person explaining a problem
3. Person giving an opinion
4. Friendly disagreement
5. Work meeting
6. Phone call
7. Asking for clarification
8. Apologizing
9. Making a recommendation
10. Comparing two options
11. Reading news
12. Writing an email
13. Presenting an idea
14. Planning a trip
15. Interview conversation
16. Group discussion
```

### Prompt: Reading and Listening Lab

```text
Create a 4x4 educational Spanish learning image sheet.
Style: clean, bright, consistent app illustration, simple background, readable at small card size, no text labels inside cells.
Subject: Spanish reading practice, listening practice, transcripts, vocabulary extraction, and writing correction.
Each cell should show one clear concept only.
Avoid surreal objects, decorative symbols, random reward icons, text labels, flags, or ambiguous scenes.
Output as a square WebP-compatible image sheet.

Cells:
1. Reading a short article
2. Listening with headphones
3. Transcript document
4. Highlighted vocabulary
5. Comprehension question
6. Notebook summary
7. Audio waveform interface
8. Podcast scene
9. News article
10. Story page
11. Dictionary lookup
12. Saved word list
13. Corrected writing
14. Speaking practice
15. Shadowing audio
16. Review notes
```

## Implementation Requirement

Whenever new assets are imported:

- Add the image file to `images/`.
- Register the sheet in `imageSheets` in `src/App.jsx`.
- Add or update asset prompt metadata in seed data if needed.
- Map lesson, word, and exercise `imageKey` values intentionally.
- Run `npm run assets:audit` before committing.
