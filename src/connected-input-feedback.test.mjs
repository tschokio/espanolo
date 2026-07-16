import assert from "node:assert/strict";
import test from "node:test";

import { connectedInputRetryMessage } from "./connected-input-feedback.mjs";

test("connected-input feedback targets the reasoning demanded by the question", () => {
  assert.match(connectedInputRetryMessage({ questionDe: "Wer liefert Pablo die Information?" }), /wer spricht, handelt oder als Quelle/);
  assert.match(connectedInputRetryMessage({ questionDe: "Warum ändert Julia ihre Entscheidung?" }), /Auslöser, Begründung und tatsächliche Folge/);
  assert.match(connectedInputRetryMessage({ questionDe: "Welche Einschränkung gilt?" }), /Bedingungen, Ausnahmen/);
  assert.match(connectedInputRetryMessage({ questionDe: "Welche Haltung impliziert die Sprecherin?" }), /Haltung, Absicht, Einschränkungen/);
  assert.match(connectedInputRetryMessage({ questionDe: "Was geschieht danach?" }), /Zeitangaben und Ereignisse/);
});

test("retry feedback follows listening and quiet-mode presentation without revealing an answer", () => {
  const listening = connectedInputRetryMessage({ questionDe: "Welche Aussage stimmt?" }, { listening: true, nativeLanguage: "de" });
  const quiet = connectedInputRetryMessage({ questionDe: "Welche Aussage stimmt?" }, { listening: true, quiet: true, nativeLanguage: "de" });
  const english = connectedInputRetryMessage({ questionEn: "Which claim is supported?" }, { listening: true, nativeLanguage: "en" });

  assert.match(listening, /Höre den relevanten Abschnitt/);
  assert.match(quiet, /Lies die relevante Textstelle/);
  assert.match(english, /Listen to the relevant section/);
  assert.doesNotMatch(listening, /Ursache und Folge direkt verbindet/);
});
