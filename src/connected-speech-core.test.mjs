import assert from "node:assert/strict";
import test from "node:test";
import { connectedSpeechUtterancePlan, parseConnectedSpeechChunk, stableSpeakerVoiceIndex } from "./connected-speech-core.mjs";

test("speaker-labelled listening turns preserve speaker and spoken content separately", () => {
  assert.deepEqual(parseConnectedSpeechChunk("Marta: No es exactamente eso."), { speaker: "Marta", text: "No es exactamente eso." });
  assert.deepEqual(parseConnectedSpeechChunk("La reunión terminó tarde."), { speaker: "", text: "La reunión terminó tarde." });
});

test("speaker voice assignment is stable within a listening passage", () => {
  assert.equal(stableSpeakerVoiceIndex("Marta", 3), stableSpeakerVoiceIndex("Marta", 3));
  assert.ok(stableSpeakerVoiceIndex("Luis", 3) >= 0);
  assert.equal(stableSpeakerVoiceIndex("Marta", 0), -1);
});

test("multiple Spanish voices hide labels while a single-voice fallback speaks them", () => {
  const voices = [{ name: "ES 1", lang: "es-ES" }, { name: "ES 2", lang: "es-MX" }, { name: "DE", lang: "de-DE" }];
  const varied = connectedSpeechUtterancePlan(["Marta: Estoy de acuerdo.", "Luis: No del todo."], voices);
  assert.equal(varied[0].spokenText, "Estoy de acuerdo.");
  assert.equal(varied[1].spokenText, "No del todo.");
  assert.ok(varied.every((turn) => turn.voice?.lang.startsWith("es")));
  assert.notEqual(varied[0].voice, varied[1].voice);

  const repeated = connectedSpeechUtterancePlan(["Marta: Primero.", "Luis: Después.", "Marta: Finalmente."], voices);
  assert.equal(repeated[0].voice, repeated[2].voice);

  const fallback = connectedSpeechUtterancePlan(["Marta: Estoy de acuerdo."], [{ name: "ES", lang: "es-ES" }]);
  assert.equal(fallback[0].spokenText, "Marta. Estoy de acuerdo.");
});
