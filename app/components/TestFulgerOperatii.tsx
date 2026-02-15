"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AnswerPad from "./AnswerPad";

type QA = { expression: string; answer: number | null; correct: boolean | null; result: number; steps: string[] };

function generateOperation(): { expression: string; result: number; steps: string[] } {
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
  
  // Calculăm pașii și validăm că nu avem rezultate intermediare negative
  const steps: string[] = [];
  const priorityOps = ["*", "/"];
  
  if (priorityOps.includes(op2) && !priorityOps.includes(op1)) {
    // op2 are prioritate, se execută prima
    const intermediate = eval(`${num2} ${op2} ${num3}`);
    if (!Number.isInteger(intermediate) || intermediate < 0) {
      return generateOperation();
    }
    const displayOp1 = op1 === "+" ? "+" : "−";
    const displayOp2 = op2 === "*" ? "×" : "÷";
    steps.push(`Pasul 1: ${num2} ${displayOp2} ${num3} = ${intermediate}`);
    steps.push(`Pasul 2: ${num1} ${displayOp1} ${intermediate} = ${result}`);
  } else if (priorityOps.includes(op1) && !priorityOps.includes(op2)) {
    // op1 are prioritate, se execută prima
    const intermediate = eval(`${num1} ${op1} ${num2}`);
    if (!Number.isInteger(intermediate) || intermediate < 0) {
      return generateOperation();
    }
    const displayOp1 = op1 === "*" ? "×" : "÷";
    const displayOp2 = op2 === "+" ? "+" : "−";
    steps.push(`Pasul 1: ${num1} ${displayOp1} ${num2} = ${intermediate}`);
    steps.push(`Pasul 2: ${intermediate} ${displayOp2} ${num3} = ${result}`);
  } else {
    // Aceeași prioritate, de la stânga la dreapta
    const intermediate = eval(`${num1} ${op1} ${num2}`);
    if (!Number.isInteger(intermediate) || intermediate < 0) {
      return generateOperation();
    }
    const displayOp1 = op1 === "*" ? "×" : op1 === "/" ? "÷" : op1 === "+" ? "+" : "−";
    const displayOp2 = op2 === "*" ? "×" : op2 === "/" ? "÷" : op2 === "+" ? "+" : "−";
    steps.push(`Pasul 1: ${num1} ${displayOp1} ${num2} = ${intermediate}`);
    steps.push(`Pasul 2: ${intermediate} ${displayOp2} ${num3} = ${result}`);
  }
  
  // Înlocuim simbolurile pentru afișare
  const displayExpression = expression.replace(/\*/g, '×').replace(/\//g, '÷');
  
  return { expression: displayExpression, result, steps };
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
        steps: op.steps,
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
                className={`rounded-lg p-3 ${
                  q.correct 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className={`font-bold ${q.correct ? 'text-green-700' : 'text-red-700'}`}>
                      {q.expression} = {q.result}
                    </div>
                    <div className={`text-sm ${q.correct ? 'text-green-600' : 'text-red-600'}`}>
                      Răspunsul tău: {q.answer === null ? "—" : q.answer}
                    </div>
                    {!q.correct && q.steps && q.steps.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-red-200">
                        <div className="text-xs font-semibold text-red-700 mb-1">Rezolvare:</div>
                        {q.steps.map((step, idx) => (
                          <div key={idx} className="text-xs text-red-600">{step}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={`ml-3 text-2xl font-bold ${q.correct ? 'text-green-600' : 'text-red-600'}`}>
                    {q.correct ? '✓' : '✗'}
                  </div>
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
