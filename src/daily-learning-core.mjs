export function dailyPlanExplanation({ german = true, targetType = "lesson", mistakeCount = 0, reviewTotal = 0, recurringMistakeCount = 0, maxMistakeOccurrences = 0, oldestOverdueDays = 0, freshConsolidation = false, reason = "", reasonCode = "", weakConcept = null } = {}) {
  if (!german) return reason || "Use the strongest next action, then continue with the remaining queue.";
  if (targetType === "review") {
    if (reasonCode === "recurring_mistake" || recurringMistakeCount) {
      const focus = weakConcept?.labelDe ? ` „${weakConcept.labelDe}“` : " das wiederkehrende Muster";
      return `Zuerst${focus} reparieren: Dieses Muster war bereits ${Math.max(2, maxMistakeOccurrences)}-mal unsicher. Danach geht der Lernweg mit ähnlichen Strukturen stabiler weiter.`;
    }
    if (reasonCode === "overdue_review" || oldestOverdueDays >= 3) return `Die älteste Erinnerung ist seit ${oldestOverdueDays} ${oldestOverdueDays === 1 ? "Tag" : "Tagen"} fällig. Rufe sie jetzt ab, bevor noch mehr neuer Stoff darüberliegt.`;
    if (mistakeCount >= 2) return "Zuerst mehrere unabhängige Unsicherheiten korrigieren, solange die richtigen Lösungen noch frisch sind. Danach geht der Lernweg weiter.";
    if (reviewTotal >= 8) return "Zuerst einen kurzen gemischten Wiederholungsblock abbauen. Danach kommt wieder neuer Stoff.";
    return "Zuerst fällige Wörter und Satzmuster stabilisieren; anschließend darf neuer Stoff dazukommen.";
  }
  if (freshConsolidation) return "Du hast heute bereits ein vollständiges Lernpaket bearbeitet. Neuer Stoff darf jetzt ruhen; eine optionale Kurzrunde greift ausschließlich auf Bekanntes zurück.";
  if (reviewTotal) return "Das aktuelle Lernpaket sinnvoll abschließen und danach die kurze fällige Wiederholung bearbeiten.";
  return "Heute reicht ein konzentriertes Lernpaket. Wiederholungen erscheinen erst nach einer echten Lernpause.";
}

export function dailyPlanDiagnosticChips({ german = true, diagnosis = {} } = {}) {
  const chips = [];
  const recurring = Math.max(0, Number(diagnosis.recurringMistakeCount || 0));
  const overdue = Math.max(0, Number(diagnosis.oldestOverdueDays || 0));
  const lessonProgress = Number(diagnosis.lessonProgress);
  const weakConceptLabel = german ? diagnosis.weakConcept?.labelDe : diagnosis.weakConcept?.labelEn;
  if (weakConceptLabel) chips.push(german ? `Schwerpunkt: ${weakConceptLabel}` : `Focus: ${weakConceptLabel}`);
  else if (recurring) chips.push(german ? `${recurring} ${recurring === 1 ? "wiederkehrendes Muster" : "wiederkehrende Muster"}` : `${recurring} recurring ${recurring === 1 ? "pattern" : "patterns"}`);
  if (overdue) chips.push(german ? `ältester Abruf ${overdue} ${overdue === 1 ? "Tag" : "Tage"} überfällig` : `oldest retrieval ${overdue} ${overdue === 1 ? "day" : "days"} overdue`);
  if (diagnosis.lessonDue) chips.push(german ? "Lektionsabruf fällig" : "lesson retrieval due");
  else if (Number.isFinite(lessonProgress) && lessonProgress > 0 && lessonProgress < 100) chips.push(german ? `Lernpaket zu ${lessonProgress} % begonnen` : `lesson ${lessonProgress}% in progress`);
  if (diagnosis.reasonCode === "fresh_consolidation") chips.push(german ? "heute bereits neues Fundament gelegt" : "new foundation completed today");
  return chips.slice(0, 3);
}

export function deferredListeningCopy({ german = true, count = 1, quiet = false, waiting = false, connected = false, sound = false } = {}) {
  const amount = Math.max(1, Number(count) || 1);
  if (!german) {
    return {
      panelTitle: "Queued real listening practice",
      eyebrow: "Intentionally deferred in quiet mode",
      title: "Complete listening at home",
      detail: `${amount} listening ${amount === 1 ? "target was" : "targets were"} reconstructed silently but not yet retrieved from sound.`,
      note: quiet
        ? "This stays saved. Switch to home mode when you can use audio; another silent task would not close the listening gap."
        : waiting
          ? "Your sound memory is taking a short break. The real listening version will unlock here afterward."
          : connected
            ? "Listen to the familiar passage without a visible transcript. Only successful comprehension from sound closes this item."
            : sound
              ? "Play the hidden sound example and distinguish it correctly. A visual rule check cannot close this listening item."
              : "Now retrieve the familiar sentence from sound. Only a correct listening answer closes this item.",
      action: connected ? "Complete listening passage now" : sound ? "Complete sound lab now" : "Complete real listening now",
      practiceTitle: connected ? "Complete connected listening" : sound ? "Complete sound discrimination" : "Complete real listening retrieval"
    };
  }
  return {
    panelTitle: "Vorgemerkte echte Hörpraxis",
    eyebrow: "Im Leisemodus bewusst aufgeschoben",
    title: "Hören zu Hause nachholen",
    detail: `${amount} ${amount === 1 ? "Hörziel wurde" : "Hörziele wurden"} leise über die Bedeutung rekonstruiert, aber noch nicht über den Klang sicher abgerufen.`,
    note: quiet
      ? "Der Auftrag bleibt gespeichert. Wechsle in den Zuhause-Modus, sobald du Ton verwenden kannst; eine weitere stille Aufgabe würde diese Hörlücke nicht schließen."
      : waiting
        ? "Das Klanggedächtnis bekommt gerade eine kurze Pause. Danach erscheint hier die echte Hörfassung; nur eine korrekte Hörantwort schließt den Auftrag."
        : connected
          ? "Höre den vertrauten Text ohne sichtbares Transkript. Nur erfolgreiches Verstehen aus dem Klang schließt diesen Auftrag."
          : sound
            ? "Spiele das verdeckte Hörbeispiel ab und unterscheide es richtig. Eine sichtbare Regelaufgabe kann diesen Hörauftrag nicht schließen."
            : "Jetzt hörst du die vertraute Aussage ohne sichtbares Modell. Nur eine korrekte Antwort aus dem Klang schließt diesen Auftrag.",
    action: connected ? "Hörtext jetzt nachholen" : sound ? "Klanglabor jetzt nachholen" : "Echtes Hören jetzt nachholen",
    practiceTitle: connected ? "Zusammenhängendes Hören nachholen" : sound ? "Klangunterscheidung nachholen" : "Echten Hörabruf nachholen"
  };
}

export function naturalLearningHomeCopy({ german = true, primaryTargetType = "lesson", freshConsolidation = false, quiet = false, hasPlannedLesson = false, lessonProgress = 0, nextLessonTitle = "", mistakeCount = 0, recurringMistakeCount = 0 } = {}) {
  if (!german) {
    return {
      eyebrow: primaryTargetType === "review" ? "Your memory plan today" : primaryTargetType === "challenge" ? "Short reinforcement today" : "Your learning path today",
      title: primaryTargetType === "review" ? "Strengthen what is due today" : primaryTargetType === "challenge" ? "Use familiar Spanish flexibly" : hasPlannedLesson ? `Understand and use Spanish: ${nextLessonTitle}` : "Build Spanish naturally",
      intro: primaryTargetType === "review" ? "Retrieve older material without visible answers and correct only what is uncertain." : primaryTargetType === "challenge" ? "Connect familiar sentence patterns in a short mixed round." : quiet ? "Understand meaning, prepare the sound pattern in writing, retrieve with graduated support, and apply it by typing. Listening and speaking return at home." : "First understand meaning, hear the sound, retrieve with support, and then use it yourself.",
      start: lessonProgress ? "Continue lesson" : "Start guided lesson",
      path: primaryTargetType === "review" ? "How today's review works" : primaryTargetType === "challenge" ? "How reinforcement works" : "The natural learning cycle",
      native: "Your native language is a bridge",
      nativeText: "Explanations and meanings can use your native language. The goal is to translate less over time and connect Spanish patterns directly to situations.",
      today: "One meaningful cycle is enough today",
      review: "Review due",
      noReview: "Nothing is due today. New material is allowed to rest.",
      abilities: "What you are actually learning to do"
    };
  }

  return {
    eyebrow: primaryTargetType === "review" ? "Dein Gedächtnisplan heute" : freshConsolidation ? "Dein neuer Stoff darf jetzt ruhen" : primaryTargetType === "challenge" ? "Kurze Festigung heute" : "Dein Lernweg heute",
    title: primaryTargetType === "review"
      ? recurringMistakeCount ? "Heute reparieren: ein wiederkehrendes Muster" : mistakeCount ? "Heute festigen: unsichere Muster" : "Heute festigen: fällige Wörter und Satzmuster"
      : freshConsolidation ? "Ein gutes Lernpaket ist für heute genug"
        : primaryTargetType === "challenge" ? "Bekanntes flexibel anwenden"
          : hasPlannedLesson ? `Spanisch verstehen und benutzen: ${nextLessonTitle}` : "Spanisch natürlich aufbauen",
    intro: primaryTargetType === "review"
      ? "Heute kommt kein unnötiger neuer Stoff dazu. Du rufst ältere Inhalte ohne sichtbare Lösung ab, korrigierst nur Unsicheres und stärkst damit das Langzeitgedächtnis."
      : freshConsolidation
        ? "Das Gehirn braucht Abstand, damit aus einem gerade gelösten Satz ein später abrufbarer Satz wird. Wenn du weitermachen möchtest, festigst du jetzt nur bereits eingeführtes Spanisch."
        : primaryTargetType === "challenge"
          ? "Eine kurze gemischte Runde verbindet bekannte Satzmuster, statt dass du dieselbe Lektion einfach noch einmal liest."
          : quiet
            ? "Du verstehst zuerst die Bedeutung, bereitest das Klangbild schriftlich vor, rufst den Satz mit abgestufter Hilfe ab und wendest ihn tippend an. Hören und Sprechen kehren zu Hause zurück."
            : "Du verstehst zuerst die Bedeutung, hörst den Klang, rufst den Satz mit abgestufter Hilfe ab und benutzt ihn anschließend selbst.",
    start: lessonProgress ? "Lektion fortsetzen" : "Geführte Lektion starten",
    path: primaryTargetType === "review" ? "So läuft deine Wiederholung" : primaryTargetType === "challenge" ? "So läuft die kurze Festigung" : "Der natürliche Lernkreislauf",
    native: "Deutsch ist deine Brücke",
    nativeText: "Erklärungen und Bedeutungen dürfen auf Deutsch sein. Das Ziel bleibt aber, immer weniger zu übersetzen und spanische Satzmuster direkt mit Situationen zu verbinden.",
    today: "Heute reicht ein sinnvoller Durchgang",
    review: "Fällige Wiederholung",
    noReview: "Heute ist nichts fällig. Neues Material darf erst einmal ruhen.",
    abilities: "Was du wirklich können sollst"
  };
}
