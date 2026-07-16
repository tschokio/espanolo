import { useEffect, useRef, useState } from "react";
import { Plus, XCircle } from "lucide-react";

const classes = (...values) => values.filter(Boolean).join(" ");

export default function MobileNavigation({ nav, activeNav, onNavigate, german, reviewDue = 0 }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreButtonRef = useRef(null);
  const firstMoreItemRef = useRef(null);
  const primaryOrder = ["learn", "review", "talk", "words"];
  const primaryItems = primaryOrder.map((key) => nav.find((item) => item.key === key)).filter(Boolean);
  const moreItems = nav.filter((item) => !primaryOrder.includes(item.key));
  const moreActive = moreItems.some((item) => item.key === activeNav);

  useEffect(() => {
    if (!moreOpen) return undefined;
    firstMoreItemRef.current?.focus();
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      setMoreOpen(false);
      moreButtonRef.current?.focus();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [moreOpen]);

  const navigate = (key) => {
    setMoreOpen(false);
    onNavigate(key);
  };

  return (
    <>
      {moreOpen && (
        <>
          <button
            type="button"
            aria-label={german ? "Weitere Navigation schließen" : "Close additional navigation"}
            className="fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-[1px] lg:hidden"
            onClick={() => setMoreOpen(false)}
          />
          <section
            id="mobile-more-navigation"
            role="dialog"
            aria-modal="true"
            aria-label={german ? "Weitere Bereiche" : "More sections"}
            className="fixed inset-x-3 bottom-[5.6rem] z-40 rounded-xl border border-stone-200 bg-white p-4 shadow-card lg:hidden"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-coral-600">{german ? "Weitere Bereiche" : "More sections"}</p>
                <p className="mt-1 text-sm font-semibold text-slate-600">{german ? "Zusatzübung, Lernstand und Einstellungen" : "Extra practice, progress, and settings"}</p>
              </div>
              <button
                type="button"
                onClick={() => { setMoreOpen(false); moreButtonRef.current?.focus(); }}
                aria-label={german ? "Schließen" : "Close"}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-stone-200 text-slate-600 hover:bg-stone-100"
              >
                <XCircle size={20} />
              </button>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {moreItems.map((item, index) => (
                <button
                  ref={index === 0 ? firstMoreItemRef : undefined}
                  key={item.key}
                  type="button"
                  onClick={() => navigate(item.key)}
                  aria-current={activeNav === item.key ? "page" : undefined}
                  className={classes(
                    "flex min-h-14 items-center gap-3 rounded-lg border px-4 py-3 text-left font-black",
                    activeNav === item.key ? "border-coral-200 bg-coral-50 text-coral-700" : "border-stone-200 bg-stone-50 text-slate-700 hover:bg-stone-100"
                  )}
                >
                  <span className={classes("grid h-9 w-9 place-items-center rounded-md", activeNav === item.key ? "bg-white" : "bg-lagoon-50 text-lagoon-700")}><item.icon size={19} /></span>
                  {item.label}
                </button>
              ))}
            </div>
          </section>
        </>
      )}
      <nav aria-label={german ? "Mobile Hauptnavigation" : "Mobile main navigation"} className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 gap-1 border-t border-stone-200/80 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md lg:hidden">
        {primaryItems.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => navigate(item.key)}
            aria-current={activeNav === item.key ? "page" : undefined}
            className={classes(
              "relative flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-black transition",
              activeNav === item.key ? "bg-coral-50 text-coral-700" : "text-slate-500 hover:bg-stone-100"
            )}
          >
            <span className="relative">
              <item.icon size={20} />
              {item.key === "review" && reviewDue > 0 && <span aria-hidden="true" className="absolute -right-3 -top-2 grid min-h-4 min-w-4 place-items-center rounded-full bg-coral-600 px-1 text-[9px] leading-none text-white">{Math.min(99, reviewDue)}</span>}
            </span>
            <span className="truncate">{item.label.split(" ")[0]}</span>
            {item.key === "review" && reviewDue > 0 && <span className="sr-only">{german ? `${reviewDue} Wiederholungen fällig` : `${reviewDue} reviews due`}</span>}
          </button>
        ))}
        <button
          ref={moreButtonRef}
          type="button"
          onClick={() => setMoreOpen((open) => !open)}
          aria-expanded={moreOpen}
          aria-controls="mobile-more-navigation"
          className={classes(
            "flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-black transition",
            moreActive || moreOpen ? "bg-coral-50 text-coral-700" : "text-slate-500 hover:bg-stone-100"
          )}
        >
          {moreOpen ? <XCircle size={20} /> : <Plus size={20} />}
          <span>{german ? "Mehr" : "More"}</span>
        </button>
      </nav>
    </>
  );
}
