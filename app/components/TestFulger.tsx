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
  const [userSelected, setUserSelected] = useState<boolean>(false);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade, operation, maxFactor]);

  // keep local selector in sync if parent prop changes
  // don't preselect maxFactor — keep selector empty until user picks; reset on prop changes
  useEffect(() => {
    const maxAvailable = Math.max(1, Math.floor(maxFactor));
    setSelectedMax(randInt(1, maxAvailable));
    setUserSelected(false);
  }, [grade, maxFactor]);

  function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function buildQuestions(selectedOverride?: number) {
    const qs: QA[] = [];
    const count = 5;
    const seen = new Set<string>();
    let attempts = 0;

    // determine which selected value to use: override > explicit selected > maxFactor fallback
    const sel = typeof selectedOverride === "number" ? selectedOverride : (selectedMax ?? maxFactor);

    while (qs.length < count && attempts < 500) {
      attempts++;
      let a: number;
      let b: number;

      if (operation === "add") {
        // fix one addend to the selected value (sel) and vary the other.
        const pageMax = Math.max(1, Math.floor(maxFactor));
        const selVal = Math.max(1, Math.floor(sel));

        // For grade 2 prefer 4 additions where the other addend (a) is >10 and 1 where it's <=10
        if (grade === 2 && pageMax >= 11) {
          const highTarget = 4;
          const highCount = qs.filter((q) => q.a > 10).length;
          if (highCount < highTarget && qs.length < count - 1) {
            // pick a in the high range
            a = randInt(11, pageMax);
          } else if (qs.length === count - 1) {
            // final question: prefer low (<=10)
            const maxLow = Math.min(10, pageMax);
            a = maxLow >= 1 ? randInt(1, maxLow) : randInt(1, pageMax);
          } else {
            // fill remaining
            a = randInt(11, pageMax);
          }
          b = selVal;
        } else {
          // class 0 or general case: a random in 1..pageMax
          a = randInt(1, pageMax);
          b = selVal;
        }
      } else if (operation === "sub") {
        // subtraction: fix the subtrahend to the selected value (sel) and vary the minuend (a > b).
        // For grade 2 prefer 4 questions with minuend > 10 and 1 with minuend <= 10.
        const pageMax = Math.max(1, Math.floor(maxFactor));
        const selVal = Math.max(1, Math.floor(sel));

        const pickAinRange = (minR: number, maxR: number) => {
          if (minR > maxR) return null;
          return randInt(minR, maxR);
        };

        if (grade === 2 && pageMax >= 11) {
          const highTarget = 4;
          const highCount = qs.filter((q) => q.a > 10).length;

          // decide whether this slot should be high (>10) or low (<=10)
          const wantHigh = highCount < highTarget && qs.length < count - 1;

          if (wantHigh) {
            // pick a > 10 and a > selVal
            const minA = Math.max(11, selVal + 1);
            const aCandidate = pickAinRange(minA, pageMax);
            if (aCandidate === null) {
              // fallback: try any a > selVal
              const aAny = pickAinRange(selVal + 1, pageMax);
              a = aAny ?? selVal; // if null, fallback to selVal
            } else {
              a = aCandidate;
            }
            b = selVal;
          } else if (qs.length === count - 1) {
            // final slot: prefer low (<=10) but still a > selVal
            const maxLow = Math.min(10, pageMax);
            const minA = Math.max(2, selVal + 1);
            const aCandidate = pickAinRange(minA, maxLow);
            if (aCandidate === null) {
              const aAny = pickAinRange(selVal + 1, pageMax);
              a = aAny ?? selVal;
            } else {
              a = aCandidate;
            }
            b = selVal;
          } else {
            // fill remaining: try high first, else normal
            const minA = Math.max(11, selVal + 1);
            const aCandidate = pickAinRange(minA, pageMax) ?? pickAinRange(selVal + 1, pageMax) ?? selVal;
            a = aCandidate;
            b = selVal;
          }
        } else {
          // general case: choose a > selVal up to sel-based limit
          const aCandidate = pickAinRange(selVal + 1, Math.max(selVal + 1, pageMax));
          a = aCandidate ?? selVal;
          b = selVal;
        }
      } else {
        // multiplication - one factor equals selectedMax, the other is 1..10 (but not equal to selectedMax)
        let other = randInt(1, 10);
        if (other === sel) {
          // pick again (safe because range 1..10 has at least one other value)
          other = other === 10 ? randInt(1, 9) : randInt(2, 10);
          if (other === sel) other = (sel === 10 ? 9 : sel + 1);
        }
        if (Math.random() < 0.5) {
          a = sel;
          b = other;
        } else {
          a = other;
          b = sel;
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
    // do not pre-generate questions — only generate when user starts the test
    setQuestions([]);
    setIndex(0);
    setStartedAt(null);
    setFinishedAt(null);
    setInput("");
    setUserSelected(false);
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

              {/* grade 0: single row 1..10; grade 2: two rows 1..10 and 11..20 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                {/* first row: 1..10 or up to maxFactor if smaller */}
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "nowrap", overflowX: "auto", alignItems: "center", margin: "0 auto" }}>
                    {Array.from({ length: Math.min(10, Math.max(1, Math.floor(maxFactor))) }).map((_, i) => {
                      const v = i + 1;
                      const isSelected = selectedMax === v;
                      return (
                        <button
                          key={v}
                          onClick={() => {
                            setSelectedMax(v);
                            setUserSelected(true);
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
                            setUserSelected(true);
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
