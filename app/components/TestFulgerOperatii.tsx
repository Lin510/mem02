"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AnswerPad from "./AnswerPad";

type QA = { expression: string; answer: number | null; correct: boolean | null; result: number };

function generateOperation(): { expression: string; result: number } {
  const ops = ["+", "-", "*", "/"] as const;
  
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const num3 = Math.floor(Math.random() * 10) + 1;
  
  // Selectăm două operații DIFERITE
  const op1 = ops[Math.floor(Math.random() * ops.length)];
  let op2 = ops[Math.floor(Math.random() * ops.length)];
  while (op2 === op1) {
    op2 = ops[Math.floor(Math.random() * ops.length)];
  }
  
  const expression = `${num1} ${op1} ${num2} ${op2} ${num3}`;
  
  // Evaluăm corect
  const result = eval(expression);
  
  // Dacă e negativ sau prea mare, regenerăm
  if (result < 0 || result > 100 || !Number.isInteger(result)) {
    return generateOperation();
  }
  
  // Înlocuim simbolurile pentru afișare
  const displayExpression = expression.replace(/\*/g, '×').replace(/\//g, '÷');
  
  return { expression: displayExpression, result };
}

export default function TestFulgerOperatii() {
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [questions, setQuestions] = useState<QA[]>([]);
  const [idx, setIdx] = useState(0);
  const [answerStr, setAnswerStr] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);

  const submittingRef = useRef(false);
  const total = 5;
  const maxLen = 3;

  function generateQuestions(): QA[] {
    const qs: QA[] = [];
    for (let i = 0; i < total; i++) {
      const op = generateOperation();
      qs.push({ 
        expression: op.expression, 
        result: op.result,
        answer: null, 
        correct: null 
      });
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
        const expected = current.result;
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
        setFinishedAt(Date.now());
        setIdx(idx);
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

  const current = started && questions.length ? questions[idx] : null;
  const correctCount = useMemo(() => questions.filter((q) => q.correct === true).length, [questions]);
  const totalTime = startedAt && finishedAt ? Math.round((finishedAt - startedAt) / 1000) : null;

  return (
    <div className="mx-auto w-full max-w-[980px] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="m-0 text-[1.4rem] font-extrabold">Test Fulger - Ordinea Operațiilor</h2>

        <div className="flex gap-2">
          {!started && (
            <button
              onClick={start}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm ring-1 ring-black/5 hover:bg-slate-800"
              type="button"
            >
              Start
            </button>
          )}

          {started && !done && (
            <button
              onClick={reset}
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
              type="button"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {!started && (
        <p className="mt-3 text-sm text-slate-600">
          Rezolvă 5 operații cu mai mulți termeni. Respectă ordinea operațiilor!
        </p>
      )}

      {started && !done && current && (
        <div className="mt-4">
          <div className="mb-3 text-center text-[2rem] font-black">
            {current.expression} = ?
          </div>
          <div className="mb-2 text-center text-sm text-slate-500">
            Întrebarea {idx + 1} din {total}
          </div>
          <AnswerPad
            answerStr={answerStr}
            onDigit={appendDigit}
            onBackspace={backspace}
            onSubmit={submitAnswer}
            disabled={!answerStr.length || done}
          />
        </div>
      )}

      {done && (
        <div className="mt-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="mb-3 text-xl font-extrabold">
            Rezultat: {correctCount}/{total}
          </div>
          {totalTime !== null && (
            <div className="mb-3 text-sm text-slate-600">Timp: {totalTime} secunde</div>
          )}

          <div className="mt-4 space-y-2">
            {questions.map((q, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <div>
                  <div className="font-bold">{q.expression} = {q.result}</div>
                  <div className="text-sm text-slate-600">
                    Răspunsul tău: {q.answer === null ? "—" : q.answer}
                  </div>
                </div>
                <div>
                  {q.correct ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500 text-white font-bold">✓</div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500 text-white font-bold">✗</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={reset}
            className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2.5 font-bold text-white hover:bg-slate-800"
          >
            Încearcă din nou
          </button>
        </div>
      )}
    </div>
  );
}
