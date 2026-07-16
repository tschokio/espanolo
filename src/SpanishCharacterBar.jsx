import { useState } from "react";
import { SPANISH_CHARACTERS, SPANISH_CHARACTERS_UPPER, insertSpanishCharacter } from "./spanish-input-core.mjs";

export default function SpanishCharacterBar({ value, onChange, inputRef, disabled = false, nativeLanguage = "de", className = "" }) {
  const [uppercase, setUppercase] = useState(false);
  const characters = uppercase ? SPANISH_CHARACTERS_UPPER : SPANISH_CHARACTERS;
  const german = nativeLanguage === "de";

  const insertCharacter = (character) => {
    if (disabled) return;
    const input = inputRef?.current;
    const result = insertSpanishCharacter(value, character, input?.selectionStart, input?.selectionEnd);
    onChange(result.value);
    window.requestAnimationFrame(() => {
      const activeInput = inputRef?.current;
      activeInput?.focus();
      activeInput?.setSelectionRange?.(result.caret, result.caret);
    });
  };

  return (
    <div className={`mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 ${className}`.trim()} role="toolbar" aria-label={german ? "Spanische Sonderzeichen" : "Spanish characters"}>
      <span className="mr-1 hidden shrink-0 text-[11px] font-black uppercase tracking-wide text-slate-500 sm:inline">{german ? "Spanische Zeichen" : "Spanish characters"}</span>
      {characters.map((character) => (
        <button
          key={character}
          type="button"
          disabled={disabled}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => insertCharacter(character)}
          aria-label={german ? `${character} einfügen` : `Insert ${character}`}
          className="grid h-9 min-w-9 shrink-0 place-items-center rounded-md border border-stone-200 bg-white px-2 text-sm font-black text-slate-800 shadow-sm hover:border-lagoon-400 hover:bg-lagoon-50 disabled:opacity-40"
        >
          {character}
        </button>
      ))}
      <button
        type="button"
        disabled={disabled}
        aria-pressed={uppercase}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setUppercase((value) => !value)}
        className="h-9 shrink-0 rounded-md border border-stone-200 bg-stone-50 px-2.5 text-xs font-black text-slate-700 hover:border-lagoon-400 disabled:opacity-40"
      >
        {uppercase ? "A → a" : "a → A"}
      </button>
    </div>
  );
}
