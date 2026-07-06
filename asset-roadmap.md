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

## Implementation Requirement

Whenever new assets are imported:

- Add the image file to `images/`.
- Register the sheet in `imageSheets` in `src/App.jsx`.
- Add or update asset prompt metadata in seed data if needed.
- Map lesson, word, and exercise `imageKey` values intentionally.
- Run a visual audit of affected lessons/quizzes before committing.

