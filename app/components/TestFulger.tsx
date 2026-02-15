"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AnswerPad from "./AnswerPad";

type Operation = "add" | "sub" | "mul" | "div";

type Props = {
  grade: 0 | 2;
  operation: Operation;
  maxFactor?: number; // for multiplication tests in grade 2
  embedded?: boolean;
};

type QA = { a: number; b: number; answer: number | null; correct: boolean | null };

export default function TestFulger({ grade, operation, maxFactor = 10, embedded = false }: Props) {
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  const [questions, setQuestions] = useState<QA[]>([]);
  const [idx, setIdx] = useState(0);

  // pseudo-input value (string, digits only)
  const [answerStr, setAnswerStr] = useState<string>("");

  // lock to prevent double-submit spam
  const submittingRef = useRef(false);

  // selector for user-chosen factor
  const [selectedMax, setSelectedMax] = useState<number>(maxFactor);

  // timer
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);

  const total = 5;

  // Sync selectedMax with maxFactor when props change
  useEffect(() => {
    setSelectedMax(maxFactor);
  }, [maxFactor]);

  const maxLen = useMemo(() => {
    // Grade 0: 1..10 add/sub (results <= 10), Grade 2 add/sub up to 20, mul up to 10*20 etc.
    // 3 digits is safe for your current ranges.
    if (operation === "mul" || operation === "div") return 3;
    return grade === 0 ? 2 : 2;
  }, [grade, operation]);

  const computeAnswer = useCallback((a: number, b: number) => {
    if (operation === "add") return a + b;
    if (operation === "sub") return a - b;
    if (operation === "div") return Math.floor(a / b);
    return a * b;
  }, [operation]);

  function randomInt(min: number, max: number) {
    // inclusive
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateQuestions(): QA[] {
    const selVal = selectedMax;
    const pageMax = selectedMax;

    if (operation === "sub") {
      // Complex pool-based algorithm for subtraction
      const leftPool: number[] = selVal > 1 ? Array.from({ length: selVal - 1 }, (_, i) => i + 1) : [];
      let rightPool: number[] = pageMax > selVal ? Array.from({ length: pageMax - selVal }, (_, i) => selVal + 1 + i) : [];

      // Adjust rightPool: if selVal <= 10, shift rightPool to start from 10 (or selVal+1 if bigger)
      if (selVal <= 10) {
        const start = Math.max(10, selVal + 1);
        if (pageMax >= start) {
          rightPool = Array.from({ length: pageMax - start + 1 }, (_, i) => start + i);
        }
      }
      // If selVal >= 16, avoid large "x - selVal" operations
      if (selVal >= 16) {
        rightPool = [];
      }

      // Helper: pick n random elements from array without replacement
      const pickRandomFromArray = (arr: number[], n: number): number[] => {
        const copy = [...arr];
        const result: number[] = [];
        for (let i = 0; i < n && copy.length > 0; i++) {
          const idx = Math.floor(Math.random() * copy.length);
          result.push(copy[idx]);
          copy.splice(idx, 1);
        }
        return result;
      };

      // Determine desired distribution
      let wantLeft = 3, wantRight = 2;
      if (selVal <= 10) { wantLeft = 1; wantRight = 4; }
      else if (selVal >= 16) { wantLeft = 4; wantRight = 1; }

      const leftAvailable = [...leftPool];
      const rightAvailable = [...rightPool];
      const chosenLeft = pickRandomFromArray(leftAvailable, wantLeft);
      const chosenRight = pickRandomFromArray(rightAvailable, wantRight);

      const leftQs: QA[] = chosenLeft.map(y => ({ a: selVal, b: y, answer: null, correct: null }));
      const rightQs: QA[] = chosenRight.map(x => ({ a: x, b: selVal, answer: null, correct: null }));

      const qs = [...leftQs, ...rightQs];

      // Deterministic fill if not enough
      while (qs.length < 5) {
        if (leftAvailable.length > 0 && (rightAvailable.length === 0 || Math.random() < 0.5)) {
          const idx = Math.floor(Math.random() * leftAvailable.length);
          const y = leftAvailable[idx];
          leftAvailable.splice(idx, 1);
          qs.push({ a: selVal, b: y, answer: null, correct: null });
        } else if (rightAvailable.length > 0) {
          const idx = Math.floor(Math.random() * rightAvailable.length);
          const x = rightAvailable[idx];
          rightAvailable.splice(idx, 1);
          qs.push({ a: x, b: selVal, answer: null, correct: null });
        } else {
          // Fallback if pools exhausted
          const a = randomInt(1, pageMax);
          const b = randomInt(1, a);
          qs.push({ a, b, answer: null, correct: null });
        }
      }

      // Shuffle
      for (let i = qs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [qs[i], qs[j]] = [qs[j], qs[i]];
      }

      return qs.slice(0, 5);
    }

    // Addition and multiplication use simpler approach
    const qs: QA[] = [];
    const count = 5;
    const seen = new Set<string>();
    let attempts = 0;

    while (qs.length < count && attempts < 500) {
      attempts++;
      let a: number = 1;
      let b: number = 1;

      if (operation === "add") {
        a = randomInt(1, selectedMax);
        b = randomInt(1, selectedMax);
      } else if (operation === "mul" || operation === "div") {
        // multiplication and division
        let other = randomInt(1, 10);
        if (other === selectedMax) {
          other = other === 10 ? randomInt(1, 9) : randomInt(2, 10);
          if (other === selectedMax) other = (selectedMax === 10 ? 9 : selectedMax + 1);
        }
        if (operation === "div") {
          // For division: generate (a * b) / a = b
          // So we store the product as 'a' and divisor as 'b'
          if (Math.random() < 0.5) {
            a = selectedMax * other;  // product
            b = selectedMax;          // divisor
          } else {
            a = other * selectedMax;  // product
            b = other;                // divisor
          }
        } else {
          // multiplication
          if (Math.random() < 0.5) {
            a = selectedMax;
            b = other;
          } else {
            a = other;
            b = selectedMax;
          }
        }
      } else {
        // subtraction - should not reach here in normal flow
        // but initialize for safety
        a = randomInt(1, selectedMax);
        b = randomInt(1, a);
      }

      const key = operation === "add" || operation === "mul" ? `${Math.min(a, b)},${Math.max(a, b)}` : `${a},${b}`;
      if (seen.has(key)) continue;
      seen.add(key);
      qs.push({ a, b, answer: null, correct: null });
    }

    return qs;
  }

  function reset() {
    setStarted(false);
    setDone(false);
    setQuestions([]);
    setIdx(0);
    setAnswerStr("");
    setStartedAt(null);
    setFinishedAt(null);
    submittingRef.current = false;
  }

  function start() {
    setQuestions(generateQuestions());
    setIdx(0);
    setAnswerStr("");
    setStarted(true);
    setDone(false);
    setStartedAt(Date.now());
    setFinishedAt(null);
    submittingRef.current = false;
  }

  // Regenerate questions when selectedMax changes (before test starts)
  useEffect(() => {
    if (!started) {
      setQuestions(generateQuestions());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMax]);

  const appendDigit = useCallback((d: number) => {
    setAnswerStr((prev) => {
      if (prev.length >= maxLen) return prev;
      // avoid leading zeros like "00" (still allow single "0")
      if (prev === "0") return String(d);
      return prev + String(d);
    });
  }, [maxLen]);

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
        const expected = computeAnswer(current.a, current.b);
        const given = Number.parseInt(currentAnswer, 10);

        const updated = [...currentQuestions];
        updated[idx] = {
          ...current,
          answer: Number.isFinite(given) ? given : null,
          correct: Number.isFinite(given) ? given === expected : false,
        };
        return updated;
      });

      // next
      const nextIdx = idx + 1;

      if (nextIdx >= total) {
        setDone(true);
        setIdx(idx);
        submittingRef.current = false;
      } else {
        setIdx(nextIdx);
        queueMicrotask(() => {
          submittingRef.current = false;
        });
      }

      return ""; // clear answer
    });
  }, [started, done, idx, total, computeAnswer]);

  // Keyboard support (digits / backspace / enter) WITHOUT focusing a real input
  useEffect(() => {
    if (!started || done) return;

    function onKeyDown(e: KeyboardEvent) {
      // digits
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

  const current = started && questions.length ? questions[idx] : null;

  const symbol = operation === "add" ? "+" : operation === "sub" ? "-" : operation === "div" ? "÷" : "×";

  const correctCount = useMemo(() => questions.filter((q) => q.correct === true).length, [questions]);
  const totalTime = startedAt && finishedAt ? Math.round((finishedAt - startedAt) / 1000) : null;

  return (
    <div className={embedded ? "w-full" : "mx-auto w-full max-w-[980px] p-4"}>
      <div className={embedded ? "flex items-center justify-start gap-2" : "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"}>
        {!embedded && <h2 className="m-0 text-[1.4rem] font-extrabold">Test Fulger</h2>}

        <div className={embedded ? "flex gap-2" : "flex gap-2"}>
          {!started && (
            <button
              onClick={start}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm ring-1 ring-black/5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              type="button"
            >
              Start
            </button>
          )}

          {started && !done && (
            <button
              onClick={reset}
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              type="button"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {!started && (
        <div className="mt-2.5">
          <div className="mb-3 text-left">
            <div className="mb-2 text-sm font-bold">
              {operation === "mul" ? "Alege tabelul de înmulțire:" : operation === "div" ? "Alege tabelul de împărțire:" : operation === "add" ? "Alege limita termenilor:" : "Alege limita numerelor:"}
            </div>
            {(operation === "add" && grade === 2) || operation === "sub" ? (
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const v = i + 1;
                    const isSelected = selectedMax === v;
                    return (
                      <button
                        key={v}
                        onClick={() => setSelectedMax(v)}
                        className={`h-9 w-9 rounded-xl text-sm font-extrabold shadow-sm ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                          isSelected ? "bg-slate-900 text-white ring-black/10" : "bg-white text-slate-900 ring-slate-200 hover:bg-slate-50"
                        }`}
                        type="button"
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const v = i + 11;
                    const isSelected = selectedMax === v;
                    return (
                      <button
                        key={v}
                        onClick={() => setSelectedMax(v)}
                        className={`h-9 w-9 rounded-xl text-sm font-extrabold shadow-sm ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                          isSelected ? "bg-slate-900 text-white ring-black/10" : "bg-white text-slate-900 ring-slate-200 hover:bg-slate-50"
                        }`}
                        type="button"
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: operation === "add" && grade === 0 ? 10 : Math.min(10, Math.max(1, Math.floor(maxFactor))) }).map((_, i) => {
                  const v = i + 1;
                  const isSelected = selectedMax === v;
                  return (
                    <button
                      key={v}
                      onClick={() => setSelectedMax(v)}
                      className={`h-9 w-9 rounded-xl text-sm font-extrabold shadow-sm ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                        isSelected ? "bg-slate-900 text-white ring-black/10" : "bg-white text-slate-900 ring-slate-200 hover:bg-slate-50"
                      }`}
                      type="button"
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Răspunde rapid folosind keypad-ul de pe ecran.
          </p>
        </div>
      )}

      {started && current && !done && (
        <div className="mt-[18px] flex justify-center">
          {/* Question */}
          <div
            className="w-full max-w-[460px] rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <div className="break-words text-[1.8rem] font-extrabold leading-tight tracking-[0.5px] sm:text-[2.2rem]">
                {current.a} {symbol} {current.b} =
              </div>

              <div className="text-right text-[0.95rem] font-semibold text-slate-500">
                {Math.min(idx + 1, total)}/{total}
              </div>
            </div>

            <div className="mt-3.5">
              <AnswerPad
                answerStr={answerStr}
                onDigit={appendDigit}
                onBackspace={backspace}
                onSubmit={submitAnswer}
                disabled={!answerStr.length || done}
              />
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {done && (
        <div className="mt-[18px] flex justify-center">
          <div className="w-full max-w-[640px] rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[1.1rem] font-black">
                  Rezultat: {correctCount}/{total}
                </div>
                {totalTime !== null && (
                  <div className="mt-1 text-sm text-slate-600">
                    Timp: {totalTime}s
                  </div>
                )}
              </div>
              <button
                onClick={start}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm ring-1 ring-black/5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                type="button"
              >
                Reia
              </button>
            </div>

            <div className="mt-3 grid gap-2">
              {questions.map((q, i) => {
                const expected = computeAnswer(q.a, q.b);
                const ok = q.correct === true;
                const userAnswerDisplay = q.answer === null || Number.isNaN(q.answer) ? "—" : String(q.answer);
                return (
                  <div key={i} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                    <div>
                      <div className="font-bold text-slate-900">
                        {q.a} {symbol} {q.b} = {expected}
                      </div>
                      <div className="text-sm text-slate-600">răspuns: {userAnswerDisplay}</div>
                    </div>

                    <div className="shrink-0">
                      {ok ? (
                        <div className="inline-flex h-7 w-9 items-center justify-center rounded-lg bg-emerald-500 text-sm font-extrabold text-white">✓</div>
                      ) : (
                        <div className="inline-flex h-7 w-9 items-center justify-center rounded-lg bg-rose-500 text-sm font-extrabold text-white">✕</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
