"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AnswerPad from "./AnswerPad";

type QA = { a: number; b: number; answer: number | null; correct: boolean | null };

export default function TestMaratonDiv() {
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  const total = 100;
  const timeLimitSec = 10 * 60; // 10 minutes

  const [questions, setQuestions] = useState<QA[]>([]);
  const [idx, setIdx] = useState(0);
  const [answerStr, setAnswerStr] = useState("");

  const submittingRef = useRef(false);

  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [timeExpired, setTimeExpired] = useState(false);
  const [resultPage, setResultPage] = useState(0);

  const maxLen = 3;

  function shuffle<T>(arr: T[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function generateQuestions(): QA[] {
    // generate all exact divisions: dividend ÷ divisor with no remainder
    // dividend: 1..100, divisor: 1..10
    // Only include divisions where dividend % divisor === 0
    const pool: QA[] = [];
    for (let dividend = 1; dividend <= 100; dividend++) {
      for (let divisor = 1; divisor <= 10; divisor++) {
        if (dividend % divisor === 0) {
          pool.push({ a: dividend, b: divisor, answer: null, correct: null });
        }
      }
    }
    // Shuffle and pick 100 random questions
    return shuffle(pool).slice(0, 100);
  }

  function resetAll() {
    setOpen(false);
    setStarted(false);
    setDone(false);
    setQuestions([]);
    setIdx(0);
    setAnswerStr("");
    setStartedAt(null);
    setRemaining(timeLimitSec);
    setResultPage(0);
    submittingRef.current = false;
  }

  function start() {
    const qs = generateQuestions();
    setQuestions(qs);
    setIdx(0);
    setAnswerStr("");
    setStarted(true);
    setDone(false);
    // calling Date.now here is fine (event handler) — disable purity rule
    // eslint-disable-next-line react-hooks/purity
    setStartedAt(Date.now());
    setRemaining(timeLimitSec);
    setResultPage(0);
    submittingRef.current = false;
  }

  const appendDigit = useCallback((d: number) => {
    setAnswerStr((prev) => {
      if (prev.length >= maxLen) return prev;
      if (prev === "0") return String(d);
      return prev + String(d);
    });
  }, []);

  const backspace = useCallback(() => {
    setAnswerStr((prev) => (prev.length ? prev.slice(0, -1) : prev));
  }, []);

  const submitAnswer = useCallback(() => {
    if (!started || done) return;
    if (submittingRef.current) return;

    setAnswerStr((currentAnswer) => {
      if (!currentAnswer.length) return currentAnswer;

      submittingRef.current = true;

      setQuestions((currentQuestions) => {
        const current = currentQuestions[idx];
        const expected = Math.floor(current.a / current.b);
        const given = Number.parseInt(currentAnswer, 10);

        const updated = [...currentQuestions];
        updated[idx] = {
          ...current,
          answer: Number.isFinite(given) ? given : null,
          correct: Number.isFinite(given) ? given === expected : false,
        };
        return updated;
      });

      const nextIdx = idx + 1;
      if (nextIdx >= total) {
        setDone(true);
        setIdx(idx);
        // finishedAt removed — mark done and keep timeExpired if timer hit
        submittingRef.current = false;
      } else {
        setIdx(nextIdx);
        queueMicrotask(() => {
          submittingRef.current = false;
        });
      }

      return "";
    });
  }, [started, done, idx]);

  // keyboard support
  useEffect(() => {
    if (!started || done) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        appendDigit(Number(e.key));
        return;
      }
      if (e.key === "Backspace") {
        e.preventDefault();
        backspace();
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        submitAnswer();
        return;
      }
    }
    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [started, done, appendDigit, backspace, submitAnswer]);

  // timer
  const [remaining, setRemaining] = useState<number>(timeLimitSec);
  useEffect(() => {
    if (!started || done || startedAt === null) return;
    const interval = setInterval(() => {
      const elapsed = Math.floor(((Date.now() - startedAt) || 0) / 1000);
      const rem = Math.max(0, timeLimitSec - elapsed);
      setRemaining(rem);
      if (rem <= 0) {
        setDone(true);
        setTimeExpired(true);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [started, done, startedAt, timeLimitSec]);

  const current = started && questions.length ? questions[idx] : null;

  const correctCount = useMemo(() => questions.filter((q) => q.correct === true).length, [questions]);

  const padMinutes = (s: number) => {
    const mm = Math.floor(s / 60);
    const ss = s % 60;
    return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button onClick={() => setOpen(true)} className="rounded-xl border border-slate-900 bg-slate-900 px-3 py-2 text-sm font-extrabold text-white shadow-sm hover:bg-slate-800">
          Test 100 ÷ (10 minute)
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-[920px] max-h-[90vh] overflow-auto rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="m-0 text-[1.2rem] font-extrabold">Test 100: Împărțiri 1–10</h2>
              <div className="flex flex-wrap gap-2">
                {!started && (
                  <button onClick={start} className="rounded-xl border border-slate-900 bg-slate-900 px-3 py-2 text-sm font-extrabold text-white shadow-sm hover:bg-slate-800">Start</button>
                )}
                {started && !done && (
                  <button
                    onClick={() => {
                      resetAll();
                      setOpen(false);
                    }}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-extrabold text-slate-900 shadow-sm hover:bg-slate-50"
                  >
                    Închide
                  </button>
                )}
                {(done || !started) && (
                  <button
                    onClick={() => {
                      resetAll();
                    }}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-extrabold text-slate-900 shadow-sm hover:bg-slate-50"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            <div className="mt-3">
              {!started && (
                <p className="text-sm text-slate-600">Ai 10 minute pentru a rezolva 100 de împărțiri (toate combinațiile de împărțiri 1÷1 … 100÷10). Folosește tastatura sau keypad-ul de pe ecran.</p>
              )}

              {started && !done && current && (
                <div className="flex items-center justify-between gap-4">
                  <div className="text-[2.0rem] font-black sm:text-[2.2rem]">
                    {current.a} ÷ {current.b} =
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">{idx + 1}/{total}</div>
                    <div className="mt-1.5 text-base font-extrabold text-slate-900">{padMinutes(remaining)}</div>
                  </div>
                </div>
              )}

              {started && !done && current && (
                <div className="mt-3.5">
                  <AnswerPad answerStr={answerStr} onDigit={appendDigit} onBackspace={backspace} onSubmit={submitAnswer} disabled={!answerStr.length || done} />
                </div>
              )}

              {done && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 900 }}>Rezultat: {correctCount}/{total}</div>

                  {/* grading */}
                  {(() => {
                    const percent = Math.round((correctCount / total) * 100);
                    let desc = "I";
                    if (timeExpired) {
                      desc = "I";
                    } else if (percent < 70) {
                      desc = "I";
                    } else if (percent < 80) {
                      desc = "S";
                    } else if (percent < 90) {
                      desc = "B";
                    } else {
                      desc = "FB";
                    }

                    return (
                      <div style={{ marginTop: 8 }}>
                        {timeExpired && <div className="mb-1.5 font-extrabold text-red-600">Timpul a expirat — test picat.</div>}
                        <div style={{ fontSize: 14, color: "#333" }}>Procent: {percent}%</div>
                        <div style={{ fontSize: 14, color: "#333", fontWeight: 800 }}>Calificativ: {desc}</div>
                      </div>
                    );
                  })()}

                  {
                    (() => {
                      const pageSize = 10;
                      const totalPages = Math.max(1, Math.ceil(questions.length / pageSize));
                      const start = resultPage * pageSize;
                      const visible = questions.slice(start, start + pageSize);

                      return (
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                            <div style={{ display: "flex", gap: 8 }}>
                              <button onClick={() => setResultPage((p) => Math.max(0, p - 1))} disabled={resultPage <= 0} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ccc", background: "#fff", cursor: resultPage <= 0 ? "not-allowed" : "pointer" }}>Prev</button>
                              <button onClick={() => setResultPage((p) => Math.min(totalPages - 1, p + 1))} disabled={resultPage >= totalPages - 1} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ccc", background: "#fff", cursor: resultPage >= totalPages - 1 ? "not-allowed" : "pointer" }}>Next</button>
                            </div>
                            <div style={{ color: "#444", fontSize: 13 }}>Pagina {resultPage + 1}/{totalPages}</div>
                          </div>

                          <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
                            {visible.map((q, i) => {
                              const exp = Math.floor(q.a / q.b);
                              const user = q.answer === null ? "—" : String(q.answer);
                              const ok = q.correct === true;
                              const globalIndex = start + i;
                              return (
                                <div key={globalIndex} style={{ display: "flex", justifyContent: "space-between", padding: 8, borderRadius: 8, background: "#fbfbfb", border: "1px solid #eee" }}>
                                  <div>
                                    <div style={{ fontWeight: 700 }}>{q.a} ÷ {q.b} = {exp}</div>
                                    <div style={{ fontSize: 13, color: "#333" }}>răspuns: {user}</div>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center" }}>{ok ? <div style={{ width: 36, height: 28, borderRadius: 6, background: "#2ecc71", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>✓</div> : <div style={{ width: 36, height: 28, borderRadius: 6, background: "#e74c3c", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>✕</div>}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
