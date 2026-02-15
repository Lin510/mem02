"use client";

import React, { useState, useCallback } from "react";
import ButonInapoi from "../components/ButonInapoi";
import TestFulgerOperatii from "../components/TestFulgerOperatii";
import TestMaratonOperatii from "../components/TestMaratonOperatii";

// Generator de operații random
function generateOperation(): { expression: string; result: number } {
  const ops = ["+", "-", "*"] as const;
  
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const num3 = Math.floor(Math.random() * 10) + 1;
  
  const op1 = ops[Math.floor(Math.random() * ops.length)];
  const op2 = ops[Math.floor(Math.random() * ops.length)];
  
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
  
  return { expression, result };
}

export default function OperatiiPage() {
  const [currentOp, setCurrentOp] = useState(() => generateOperation());
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showTests, setShowTests] = useState(false);

  const handleNewOperation = useCallback(() => {
    setCurrentOp(generateOperation());
    setUserAnswer("");
    setShowResult(false);
    setIsCorrect(null);
  }, []);

  const handleSubmit = useCallback(() => {
    const answer = parseInt(userAnswer, 10);
    if (Number.isFinite(answer)) {
      setIsCorrect(answer === currentOp.result);
      setShowResult(true);
    }
  }, [userAnswer, currentOp.result]);

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
          💡 Rezolvă operațiile respectând ordinea: înmulțire înainte de adunare și scădere.
        </p>

        <div className="mb-5 flex justify-center gap-3">
          <TestMaratonOperatii />
        </div>

        {!showTests ? (
          <div className="mx-auto max-w-[600px]">
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
                      <div className="text-lg font-bold text-red-600">
                        ✗ Greșit. Răspunsul corect: {currentOp.result}
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

            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
              <div className="mb-2 font-bold">Ordinea operațiilor:</div>
              <ol className="ml-4 list-decimal space-y-1">
                <li>Înmulțire (×)</li>
                <li>Adunare (+) și Scădere (−)</li>
              </ol>
              <div className="mt-3 text-xs text-slate-500">
                Exemplu: 2 + 3 × 4 = 2 + 12 = 14 (nu 20!)
              </div>
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
