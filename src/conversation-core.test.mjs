import assert from "node:assert/strict";
import test from "node:test";

import { conversationScenarios, greetingConversation, matchConversationReply, normalizeConversationText } from "./conversation-core.mjs";

test("normalizes accents and Spanish punctuation", () => {
  assert.equal(normalizeConversationText("¡Más o menos! ¿Y tú?"), "mas o menos y tu");
});

test("branches greeting replies by conversational intent", () => {
  const start = greetingConversation.nodes[greetingConversation.start];
  assert.equal(matchConversationReply(start, "Muy bien, gracias. ¿Y tú?")?.next, "positive");
  assert.equal(matchConversationReply(start, "Estoy cansada hoy")?.next, "neutral");
  assert.equal(matchConversationReply(start, "No muy bien")?.next, "negative");
});

test("does not accept an unrelated sentence", () => {
  const start = greetingConversation.nodes[greetingConversation.start];
  assert.equal(matchConversationReply(start, "La biblioteca es grande"), null);
});

test("all conversation scenarios have valid branches and learning supports", () => {
  assert.equal(conversationScenarios.length, 4);
  assert.equal(new Set(conversationScenarios.map((scenario) => scenario.id)).size, 4);

  for (const scenario of conversationScenarios) {
    assert.ok(scenario.nodes[scenario.start], `${scenario.id} has a start node`);
    for (const node of Object.values(scenario.nodes)) {
      if (node.complete) continue;
      assert.ok(node.starter, `${scenario.id} node has a sentence starter`);
      assert.ok(node.words.length, `${scenario.id} node has useful words`);
      assert.ok(node.replies.length, `${scenario.id} node has replies`);
      for (const reply of node.replies) {
        assert.ok(reply.meaning, `${reply.id} has an English meaning`);
        assert.ok(scenario.nodes[reply.next], `${reply.id} points to an existing node`);
      }
    }
  }
});
