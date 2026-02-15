"use client";

import React, { useState, useCallback } from "react";
import ButonInapoi from "../components/ButonInapoi";
import TestFulgerOperatii from "../components/TestFulgerOperatii";
import TestMaratonOperatii from "../components/TestMaratonOperatii";

// Generator de operații random
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
  let result: number;
  
  try {
    result = eval(expression);
    
    if (!Number.isInteger(result) || result < 0 || result > 100) {
      return generateOperation();
    }
  } catch {
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

// Generator de exemple pentru explicații
function generateExample(): { display: string; steps: string; wrongSteps: string; result: number; wrong: number } {
  const ops = ["+", "-", "*", "/"] as const;
  const priorityOps = ["*", "/"] as const;
  const nonPriorityOps = ["+", "-"] as const;
  
  const num1 = Math.floor(Math.random() * 9) + 1;
  const num2 = Math.floor(Math.random() * 9) + 1;
  const num3 = Math.floor(Math.random() * 9) + 1;
  
  // Prima operație: prioritate (+, -)
  const op1 = nonPriorityOps[Math.floor(Math.random() * nonPriorityOps.length)];
  // A doua operație: prioritate înaltă (*, /)
  const op2 = priorityOps[Math.floor(Math.random() * priorityOps.length)];
  
  const expression = `${num1} ${op1} ${num2} ${op2} ${num3}`;
  
  let result: number;
  let intermediate: number;
  let wrongIntermediate: number;
  let wrong: number;
  
  try {
    result = eval(expression);
    
    // Calculăm valoarea intermediară (op2 se execută prima - CORECT)
    intermediate = eval(`${num2} ${op2} ${num3}`);
    
    // Calculăm valoarea intermediară greșită (op1 se execută prima - GREȘIT)
    wrongIntermediate = eval(`${num1} ${op1} ${num2}`);
    
    // Calculăm rezultatul greșit (dacă ar fi de la stânga la dreapta)
    wrong = eval(`${wrongIntermediate} ${op2} ${num3}`);
    
    if (!Number.isInteger(result) || result < 0 || result > 100 || 
        !Number.isInteger(intermediate) || !Number.isInteger(wrong) ||
        !Number.isInteger(wrongIntermediate) ||
        result === wrong) {
      return generateExample();
    }
  } catch {
    return generateExample();
  }
  
  const displayExpression = expression.replace(/\*/g, '×').replace(/\//g, '÷');
  
  // Pasul corect: facem întâi înmulțirea/împărțirea
  const displayOp2Symbol = op2 === '*' ? '×' : '÷';
  const displayOp1Symbol = op1 === '+' ? '+' : '−';
  const steps = `${num1} ${displayOp1Symbol} ${intermediate}`;
  
  // Pasul greșit: facem întâi adunarea/scăderea (de la stânga la dreapta)
  const wrongSteps = `${wrongIntermediate} ${displayOp2Symbol} ${num3}`;
  
  return { display: displayExpression, steps, wrongSteps, result, wrong };
}

export default function OperatiiPage() {
  const [currentOp, setCurrentOp] = useState<{ expression: string; result: number; steps: string[] } | null>(null);
  const [example, setExample] = useState<{ display: string; steps: string; wrongSteps: string; result: number; wrong: number } | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showTests, setShowTests] = useState(false);

  // Generăm operația și exemplul doar pe client după mount pentru a evita hydration mismatch
  React.useEffect(() => {
    setCurrentOp(generateOperation());
    setExample(generateExample());
  }, []);

  const handleNewOperation = useCallback(() => {
    setCurrentOp(generateOperation());
    setUserAnswer("");
    setShowResult(false);
    setIsCorrect(null);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!currentOp) return;
    const answer = parseInt(userAnswer, 10);
    if (Number.isFinite(answer)) {
      setIsCorrect(answer === currentOp.result);
      setShowResult(true);
    }
  }, [userAnswer, currentOp]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-[980px] px-4 py-8 sm:px-6 lg:px-7">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <ButonInapoi />
            <h1 className="m-0 text-[28px] font-black tracking-tight">Ordinea Operațiilor</h1>
          </div>
        </div>

        <p className="mb-6 text-center text-sm text-slate-600">
          💡 Rezolvă operațiile respectând ordinea: înmulțire și împărțire înainte de adunare și scădere.
        </p>

        <div className="mb-5 flex justify-center gap-3">
          <TestMaratonOperatii />
        </div>

        {!showTests ? (
          <div className="mx-auto max-w-[600px]">
            {!currentOp ? (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 text-center">
                <div className="text-slate-400">Se generează operația...</div>
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="mb-6 text-center">
                  <div className="mb-4 text-3xl font-black">{currentOp.expression} = ?</div>
                
                <div className="flex items-center justify-center gap-3">
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSubmit();
                    }}
                    placeholder="Răspuns"
                    className="w-32 rounded-lg border border-slate-300 px-4 py-2 text-center text-lg font-bold focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    disabled={showResult}
                  />
                  
                  {!showResult && (
                    <button
                      onClick={handleSubmit}
                      disabled={!userAnswer}
                      className="rounded-lg bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                      Verifică
                    </button>
                  )}
                </div>

                {showResult && (
                  <div className="mt-4">
                    {isCorrect ? (
                      <div className="text-lg font-bold text-green-600">✓ Corect!</div>
                    ) : (
                      <div>
                        <div className="text-lg font-bold text-red-600">
                          ✗ Greșit. Răspunsul corect: {currentOp.result}
                        </div>
                        {currentOp && currentOp.steps && currentOp.steps.length > 0 && (
                          <div className="mt-3 rounded-lg bg-red-50 border border-red-200 p-3">
                            <div className="text-sm font-semibold text-red-700 mb-2">Rezolvare:</div>
                            {currentOp.steps.map((step, idx) => (
                              <div key={idx} className="text-sm text-red-600">{step}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <button
                      onClick={handleNewOperation}
                      className="mt-4 rounded-lg bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-800"
                    >
                      Următoarea operație
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setShowTests(true)}
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm hover:bg-slate-800"
                >
                  Test fulger (5 întrebări)
                </button>
              </div>
            </div>
            )}

            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-center">
              <div className="mb-3 text-lg font-bold text-slate-900">Ordinea operațiilor:</div>
              <ol className="mb-4 inline-block text-left text-base text-slate-700 space-y-2">
                <li><span className="font-bold">1.</span> Înmulțire (×) și Împărțire (÷)</li>
                <li><span className="font-bold">2.</span> Adunare (+) și Scădere (−)</li>
              </ol>
              {example && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="text-sm font-semibold text-slate-600 mb-3">Exemplu:</div>
                  <div className="text-2xl font-black text-slate-900 mb-4">{example.display} = ?</div>
                  
                  <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-xs font-semibold text-green-700 mb-1">✓ CORECT:</div>
                    <div className="text-lg text-green-700">{example.steps} = <span className="font-bold">{example.result}</span></div>
                  </div>
                  
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-xs font-semibold text-red-700 mb-1">✗ GREȘIT:</div>
                    <div className="text-lg text-red-700">{example.wrongSteps} = <span className="font-bold">{example.wrong}</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <TestFulgerOperatii />
            <button
              onClick={() => setShowTests(false)}
              className="mt-4 w-full rounded-xl bg-slate-200 px-4 py-2.5 font-bold text-slate-900 hover:bg-slate-300"
            >
              Înapoi la exersare
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
