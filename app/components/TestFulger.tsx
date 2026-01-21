"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AnswerPad from "./AnswerPad";

type Operation = "add" | "sub" | "mul";

type Props = {
  grade: 0 | 2;
  operation: Operation;
  maxFactor?: number; // for multiplication tests in grade 2
};

type QA = { a: number; b: number; answer: number | null; correct: boolean | null };

export default function TestFulger({ grade, operation, maxFactor = 10 }: Props) {
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
    if (operation === "mul") return 3;
    return grade === 0 ? 2 : 2;
  }, [grade, operation]);

  const computeAnswer = useCallback((a: number, b: number) => {
    if (operation === "add") return a + b;
    if (operation === "sub") return a - b;
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
      let a: number;
      let b: number;

      if (operation === "add") {
        a = randomInt(1, selectedMax);
        b = randomInt(1, selectedMax);
      } else {
        // multiplication
        let other = randomInt(1, 10);
        if (other === selectedMax) {
          other = other === 10 ? randomInt(1, 9) : randomInt(2, 10);
          if (other === selectedMax) other = (selectedMax === 10 ? 9 : selectedMax + 1);
        }
        if (Math.random() < 0.5) {
          a = selectedMax;
          b = other;
        } else {
          a = other;
          b = selectedMax;
        }
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

  const symbol = operation === "add" ? "+" : operation === "sub" ? "-" : "×";

  const correctCount = useMemo(() => questions.filter((q) => q.correct === true).length, [questions]);
  const totalTime = startedAt && finishedAt ? Math.round((finishedAt - startedAt) / 1000) : null;

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: "1.4rem" }}>Test Fulger</h2>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {!started && (
            <button
              onClick={start}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #111",
                background: "#111",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Start
            </button>
          )}
          {started && !done && (
            <button
              onClick={reset}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #111",
                background: "#fff",
                color: "#111",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {!started && (
        <div style={{ marginTop: 10 }}>
          <div style={{ marginBottom: 12, textAlign: "left" }}>
            <div style={{ marginBottom: 8, fontWeight: 700, fontSize: 14 }}>
              {operation === "mul" ? "Alege tabelul de înmulțire:" : operation === "add" ? "Alege limita termenilor:" : "Alege limita numerelor:"}
            </div>
            {(operation === "add" && grade === 2) || operation === "sub" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {Array.from({ length: 10 }).map((_, i) => {
                    const v = i + 1;
                    const isSelected = selectedMax === v;
                    return (
                      <button
                        key={v}
                        onClick={() => setSelectedMax(v)}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          border: isSelected ? "2px solid #222" : "1px solid #bbb",
                          background: isSelected ? "#222" : "#fff",
                          color: isSelected ? "#fff" : "#000",
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {Array.from({ length: 10 }).map((_, i) => {
                    const v = i + 11;
                    const isSelected = selectedMax === v;
                    return (
                      <button
                        key={v}
                        onClick={() => setSelectedMax(v)}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          border: isSelected ? "2px solid #222" : "1px solid #bbb",
                          background: isSelected ? "#222" : "#fff",
                          color: isSelected ? "#fff" : "#000",
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {Array.from({ length: operation === "add" && grade === 0 ? 10 : Math.min(10, Math.max(1, Math.floor(maxFactor))) }).map((_, i) => {
                  const v = i + 1;
                  const isSelected = selectedMax === v;
                  return (
                    <button
                      key={v}
                      onClick={() => setSelectedMax(v)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        border: isSelected ? "2px solid #222" : "1px solid #bbb",
                        background: isSelected ? "#222" : "#fff",
                        color: isSelected ? "#fff" : "#000",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <p style={{ opacity: 0.75, marginTop: 8 }}>
            Răspunde rapid folosind keypad-ul de pe ecran.
          </p>
        </div>
      )}

      {started && current && !done && (
        <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}>
          {/* Question */}
          <div
            style={{
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 14,
              padding: 20,
              background: "#fff",
              maxWidth: 420,
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
              <div style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: 0.5 }}>
                {current.a} {symbol} {current.b} =
              </div>

              <div style={{ fontSize: "0.95rem", opacity: 0.65, fontWeight: 600 }}>
                {Math.min(idx + 1, total)}/{total}
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
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
        <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 14,
              padding: 16,
              background: "#fff",
              maxWidth: 560,
              width: "100%",
            }}
          >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: "1.1rem" }}>
                    Rezultat: {correctCount}/{total}
                  </div>
                  {totalTime !== null && (
                    <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
                      Timp: {totalTime}s
                    </div>
                  )}
                </div>
                <button
                  onClick={start}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #111",
                    background: "#111",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Reia
                </button>
              </div>

              <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                {questions.map((q, i) => {
                  const expected = computeAnswer(q.a, q.b);
                  const ok = q.correct === true;
                  const userAnswerDisplay = q.answer === null || Number.isNaN(q.answer) ? "—" : String(q.answer);
                  const markStyle: React.CSSProperties = {
                    width: 36,
                    height: 28,
                    borderRadius: 6,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    color: "#fff",
                  };
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "#fbfbfb",
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid #eee",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700 }}>
                          {q.a} {symbol} {q.b} = {expected}
                        </div>
                        <div style={{ fontSize: 14, color: "#333" }}>răspuns: {userAnswerDisplay}</div>
                      </div>

                      <div style={{ marginLeft: 12 }}>
                        {ok ? (
                          <div style={{ ...markStyle, background: "#2ecc71" }}>✓</div>
                        ) : (
                          <div style={{ ...markStyle, background: "#e74c3c" }}>✕</div>
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
