"use client";

import React, { useEffect, useState } from "react";

type Operation = "add" | "sub" | "mul";

type Props = {
  grade: 0 | 2;
  operation: Operation;
  maxFactor?: number; // for multiplication tests in grade 2
};

type QA = { a: number; b: number; answer: number | null; correct: boolean | null };

export default function TestFulger({ grade, operation, maxFactor = 10 }: Props) {
  const [questions, setQuestions] = useState<QA[]>([]);
  const [index, setIndex] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [input, setInput] = useState<string>("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [selectedMax, setSelectedMax] = useState<number | null>(null);
  

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade, operation, maxFactor]);

  // Helpers and core logic
  function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function buildQuestions(sel: number) {
    const count = 5;
    const qs: QA[] = [];
    const seen = new Set<string>();
    const pageMax = Math.max(1, Math.floor(maxFactor));
    const selVal = Math.max(1, Math.floor(sel));

    if (operation === "sub") {
      // Pools
      const leftPool: number[] = selVal > 1 ? Array.from({ length: selVal - 1 }, (_, i) => i + 1) : [];
      let rightPool: number[] = pageMax > selVal ? Array.from({ length: pageMax - selVal }, (_, i) => selVal + 1 + i) : [];

      // For small sel prefer larger right values
      if (selVal <= 10) {
        const start = Math.max(10, selVal + 1);
        if (pageMax >= start) rightPool = Array.from({ length: pageMax - start + 1 }, (_, i) => start + i);
      }

      // For large sel avoid right-side questions
      if (selVal >= 16) rightPool = [];

      const pickRandomFromArray = (arr: number[], n: number) => {
        const copy = arr.slice();
        const res: number[] = [];
        for (let i = 0; i < n && copy.length > 0; i++) {
          const idx = randInt(0, copy.length - 1);
          res.push(copy.splice(idx, 1)[0]);
        }
        return res;
      };

      let wantLeft = 3;
      let wantRight = 2;
      if (selVal <= 10) {
        wantLeft = 1;
        wantRight = 4;
      } else if (selVal >= 16) {
        wantLeft = 4;
        wantRight = 1;
      }

      const leftAvailable = leftPool.filter((y) => !seen.has(`${selVal},${y}`));
      const rightAvailable = rightPool.filter((x) => !seen.has(`${x},${selVal}`));

      const chosenLeft = pickRandomFromArray(leftAvailable, wantLeft);
      const chosenRight = pickRandomFromArray(rightAvailable, wantRight);

      // Add chosen
      for (const y of chosenLeft) {
        if (qs.length >= count) break;
        const key = `${selVal},${y}`;
        if (!seen.has(key)) {
          seen.add(key);
          qs.push({ a: selVal, b: y, answer: null, correct: null });
        }
      }
      for (const x of chosenRight) {
        if (qs.length >= count) break;
        const key = `${x},${selVal}`;
        if (!seen.has(key)) {
          seen.add(key);
          qs.push({ a: x, b: selVal, answer: null, correct: null });
        }
      }

      // Fill deterministically from left (sel - y)
      let yFill = 1;
      while (qs.length < count && yFill < selVal) {
        const key = `${selVal},${yFill}`;
        if (!seen.has(key)) {
          seen.add(key);
          qs.push({ a: selVal, b: yFill, answer: null, correct: null });
        }
        yFill++;
      }

      // If still short, use larger minuends (x - sel)
      let xFill = selVal + 1;
      while (qs.length < count && xFill <= pageMax) {
        const key = `${xFill},${selVal}`;
        if (!seen.has(key)) {
          seen.add(key);
          qs.push({ a: xFill, b: selVal, answer: null, correct: null });
        }
        xFill++;
      }

      // slight shuffle
      for (let i = qs.length - 1; i > 0; i--) {
        const j = randInt(0, i);
        const tmp = qs[i];
        qs[i] = qs[j];
        qs[j] = tmp;
      }

      return qs.slice(0, count);
    }

    // addition and multiplication: include selected number as one operand
    if (operation === "add" || operation === "mul") {
      const maxOther = operation === "mul" ? Math.min(10, Math.max(1, Math.floor(maxFactor))) : Math.max(1, Math.floor(maxFactor));
      let attempts = 0;
      while (qs.length < 5 && attempts < 500) {
        attempts++;
        let other = randInt(1, maxOther);
        if (operation === "mul" && other === selVal) {
          // avoid identical factor repeated; pick another
          other = other === maxOther ? Math.max(1, other - 1) : other + 1;
        }
        let a: number, b: number;
        if (operation === "add") {
          // store unordered pair to avoid duplicates
          a = Math.min(selVal, other);
          b = Math.max(selVal, other);
        } else {
          // multiplication - keep order arbitrary
          if (Math.random() < 0.5) {
            a = selVal;
            b = other;
          } else {
            a = other;
            b = selVal;
          }
        }
        const key = operation === "add" || operation === "mul" ? `${a},${b}` : `${a},${b}`;
        if (seen.has(key)) continue;
        seen.add(key);
        qs.push({ a, b, answer: null, correct: null });
      }

      // deterministic fill if needed
      let otherFill = 1;
      while (qs.length < 5 && otherFill <= maxOther) {
        const a = operation === "add" ? Math.min(selVal, otherFill) : (Math.random() < 0.5 ? selVal : otherFill);
        const b = operation === "add" ? Math.max(selVal, otherFill) : (a === selVal ? otherFill : selVal);
        const key = `${a},${b}`;
        if (!seen.has(key)) {
          seen.add(key);
          qs.push({ a, b, answer: null, correct: null });
        }
        otherFill++;
      }

      return qs.slice(0, 5);
    }

    return qs;
  }

  function reset() {
    setQuestions([]);
    setIndex(0);
    setStartedAt(null);
    setFinishedAt(null);
    setInput("");
    const maxAvailable = Math.max(1, Math.floor(maxFactor));
    setSelectedMax(randInt(1, maxAvailable));
  }

  function startIfNeeded() {
    if (!startedAt) setStartedAt(Date.now());
  }

  function submitAnswer() {
    if (index >= questions.length) return;
    const q = questions[index];
    const user = input === "" ? NaN : Number(input);
    let correct = false;
    if (operation === "add") correct = user === q.a + q.b;
    if (operation === "sub") correct = user === q.a - q.b;
    if (operation === "mul") correct = user === q.a * q.b;

    const updated = [...questions];
    updated[index] = { ...q, answer: user, correct };
    setQuestions(updated);
    setInput("");
    if (index + 1 >= questions.length) {
      setFinishedAt(Date.now());
      setIndex(index + 1);
    } else {
      setIndex(index + 1);
    }
  }

  // autofocus input when a question is shown
  useEffect(() => {
    if (startedAt && index < questions.length) {
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [startedAt, index, questions.length]);

  const totalTime = startedAt && finishedAt ? Math.round((finishedAt - startedAt) / 1000) : null;
  const correctCount = questions.filter((q) => q.correct).length;

  return (
    <div style={{ marginTop: 18, textAlign: "center" }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Test fulger — 5 întrebări</h3>

      {!startedAt && (
        <div style={{ marginBottom: 10 }}>
          {(operation === "mul" || operation === "add" || operation === "sub") && (
            <div style={{ marginBottom: 12, textAlign: "center" }}>
              <div style={{ marginBottom: 6, fontWeight: 700 }}>{operation === "mul" ? "Limita multiplicatorilor" : operation === "add" ? "Limita termenilor" : "Limita numerelor"}</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "nowrap", overflowX: "auto", alignItems: "center", margin: "0 auto" }}>
                  {Array.from({ length: Math.min(10, Math.max(1, Math.floor(maxFactor))) }).map((_, i) => {
                    const v = i + 1;
                    const isSelected = selectedMax === v;
                    return (
                      <button
                        key={v}
                        onClick={() => {
                              setSelectedMax(v);
                            }}
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

                {grade === 2 && maxFactor > 10 && (
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "nowrap", overflowX: "auto", alignItems: "center", margin: "0 auto" }}>
                    {Array.from({ length: Math.max(0, Math.min(10, Math.floor(maxFactor) - 10)) }).map((_, i) => {
                      const v = 11 + i;
                      const isSelected = selectedMax === v;
                      return (
                        <button
                          key={v}
                          onClick={() => {
                            setSelectedMax(v);
                          }}
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
            </div>
          )}

          <button
            onClick={() => {
              if (selectedMax == null) return;
              setQuestions(buildQuestions(selectedMax));
              setStartedAt(Date.now());
              setFinishedAt(null);
              setIndex(0);
            }}
            style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #222", background: "#222", color: "#fff", fontWeight: 700 }}
          >
            Începe testul
          </button>
          <button onClick={reset} style={{ marginLeft: 8, padding: "8px 12px", borderRadius: 6 }}>Resetează</button>
        </div>
      )}

      {startedAt && index < questions.length && (
        <div>
          <div style={{ marginBottom: 8, fontWeight: 700 }}>
            Întrebarea {index + 1} din {questions.length}
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>
            {questions[index].a} {operation === "mul" ? "×" : operation === "sub" ? "-" : "+"} {questions[index].b} = ?
          </div>
          <div>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              inputMode="numeric"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  startIfNeeded();
                  submitAnswer();
                }
              }}
              style={{ width: 120, padding: 8, marginRight: 8 }}
            />
            <button
              onClick={() => {
                startIfNeeded();
                submitAnswer();
              }}
              style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #222", background: "#222", color: "#fff", fontWeight: 700 }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {startedAt && index >= questions.length && (
        <div style={{ marginTop: 12 }}>
          <div style={{ marginBottom: 8, fontWeight: 800 }}>Ai terminat testul!</div>
          <div style={{ marginBottom: 6 }}>Scor: {correctCount} / {questions.length}</div>
          <div style={{ marginBottom: 6 }}>Timp: {totalTime === null ? "—" : `${totalTime}s`}</div>

          <div style={{ marginTop: 8 }}>
            <button onClick={reset} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #222" }}>Reîncepe</button>
          </div>

          <div style={{ marginTop: 18, textAlign: "left", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Istoric rezultate</div>
            <div style={{ display: "grid", gap: 8 }}>
              {questions.map((q, i) => {
                const op = operation === "mul" ? "×" : operation === "sub" ? "-" : "+";
                const correctAnswer = operation === "add" ? q.a + q.b : operation === "sub" ? q.a - q.b : q.a * q.b;
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
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fbfbfb", padding: "8px 10px", borderRadius: 8, border: "1px solid #eee" }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{q.a} {op} {q.b} = {correctAnswer}</div>
                      <div style={{ fontSize: 14, color: "#333" }}>Răspuns: {userAnswerDisplay}</div>
                    </div>

                    <div style={{ marginLeft: 12 }}>
                      {q.correct ? (
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
