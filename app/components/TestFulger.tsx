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

  const total = 5;

  const maxLen = useMemo(() => {
    // Grade 0: 1..10 add/sub (results <= 10), Grade 2 add/sub up to 20, mul up to 10*20 etc.
    // 3 digits is safe for your current ranges.
    if (operation === "mul") return 3;
    return grade === 0 ? 2 : 2;
  }, [grade, operation]);

  function computeAnswer(a: number, b: number) {
    if (operation === "add") return a + b;
    if (operation === "sub") return a - b;
    return a * b;
  }

  function randomInt(min: number, max: number) {
    // inclusive
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateQuestions(): QA[] {
    const q: QA[] = [];
    for (let i = 0; i < total; i++) {
      if (operation === "add") {
        const max = grade === 0 ? 10 : 20;
        const a = randomInt(1, max);
        const b = randomInt(1, max);
        q.push({ a, b, answer: null, correct: null });
        continue;
      }

      if (operation === "sub") {
        const max = grade === 0 ? 10 : 20;
        // avoid negative results (your rule)
        const a = randomInt(1, max);
        const b = randomInt(1, a);
        q.push({ a, b, answer: null, correct: null });
        continue;
      }

      // mul
      // You already have selector logic elsewhere; keep it simple here
      const maxA = grade === 0 ? 10 : maxFactor;
      const a = randomInt(1, maxA);
      const b = randomInt(1, 10);
      q.push({ a, b, answer: null, correct: null });
    }
    return q;
  }

  function reset() {
    setStarted(false);
    setDone(false);
    setQuestions([]);
    setIdx(0);
    setAnswerStr("");
    submittingRef.current = false;
  }

  function start() {
    setQuestions(generateQuestions());
    setIdx(0);
    setAnswerStr("");
    setStarted(true);
    setDone(false);
    submittingRef.current = false;
  }

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
  }, [started, done, idx, total]);

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
    return () => window.removeEventListener("keydown", onKeyDown as any);
  }, [started, done, appendDigit, backspace, submitAnswer]);

  const current = started && questions.length ? questions[idx] : null;

  const symbol = operation === "add" ? "+" : operation === "sub" ? "-" : "×";

  const correctCount = useMemo(() => questions.filter((q) => q.correct === true).length, [questions]);

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
        <p style={{ marginTop: 10, opacity: 0.75, textAlign: "left" }}>
          Răspunde rapid folosind keypad-ul de pe ecran.
        </p>
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
                <div style={{ fontWeight: 900, fontSize: "1.1rem" }}>
                  Rezultat: {correctCount}/{total}
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
