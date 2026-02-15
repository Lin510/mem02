"use client";

import React, { useEffect, useRef, useState } from "react";

// Simple keypad calculator that listens to key presses.
export default function Calculator() {
  const [expr, setExpr] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const mounted = useRef(true);

  // Evaluate function moved above useEffect so it is defined before use
  function evaluate() {
    try {
      // normalize common unicode symbols to ASCII and remove whitespace/invisible chars
      let normalized = expr
        .replace(/\u2212/g, "-") // minus sign
        .replace(/\uFF0B/g, "+") // fullwidth plus
        .replace(/\u00D7/g, "*") // multiply ×
        .replace(/\u00F7/g, "/") // divide ÷
        .replace(/,/g, ".")
        // remove common invisible/unusual spaces and marks
        .replace(/[\u00A0\u200B-\u200F\uFEFF]/g, "")
        .replace(/\s+/g, "");

      // normalized preview intentionally not shown in UI

      // if empty after normalization, error
      if (normalized === "") {
        setResult("Err");
        return;
      }

      // drop trailing operators so expressions like "123-" become "123"
      while (/[+\-*/()]$/.test(normalized)) {
        normalized = normalized.slice(0, -1);
      }

      const isValid = /^[0-9+\-*/()\.]+$/.test(normalized);
      if (!isValid) {
        setResult("Err");
        return;
      }

      const val = Function(`return (${normalized})`)();
      if (typeof val === "number" && Number.isFinite(val)) setResult(String(val));
      else setResult("Err");
    } catch (err) {
      void err;
      setResult("Err");
    }
  }

  function clearAll() {
    setExpr("");
    setResult(null);
  }

  function press(s: string) {
    if (s === "=") return evaluate();
    if (s === "C") return clearAll();
    setExpr((p) => p + s);
  }
  // keep stable refs to functions so the keyboard listener can safely call them
  const evaluateRef = useRef<(() => void) | undefined>(undefined);
  const clearAllRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    evaluateRef.current = evaluate;
    clearAllRef.current = clearAll;
  });

  useEffect(() => {
    mounted.current = true;
    function onKey(e: KeyboardEvent) {
      const k = e.key;
      if ((/^[0-9]$/).test(k)) {
        setExpr((s) => s + k);
      } else if (k === "+" || k === "-" || k === "*" || k === "/") {
        setExpr((s) => (s === "" ? s : s + k));
      } else if (k === "Enter") {
        e.preventDefault();
        if (evaluateRef.current) evaluateRef.current();
      } else if (k === "Backspace") {
        setExpr((s) => s.slice(0, -1));
      } else if (k === "Escape" || k === "c" || k === "C") {
        if (clearAllRef.current) clearAllRef.current();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      mounted.current = false;
      window.removeEventListener("keydown", onKey);
    };
    // intentionally empty deps: handlers call current refs which are updated each render
  }, []);

  const keypad = [
    ["7", "8", "9", "/"],
    ["4", "5", "6", "*"],
    ["1", "2", "3", "-"],
    ["0", "C", "=", "+"],
  ];

  return (
    <div className="mt-4 flex justify-center">
      <div className="w-full max-w-[360px] rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="min-h-[36px] break-words text-right text-[20px] font-extrabold text-slate-700">{expr || "0"}</div>
        <div className={`min-h-[56px] break-words text-right text-[40px] font-black tracking-tight ${result ? "text-slate-900" : "text-slate-300"}`}>{result === null ? "" : result}</div>

        <div className="mt-2">
          {keypad.map((row, i) => (
            <div key={i} className="mt-2 flex justify-center gap-2">
              {row.map((k) => (
                <button
                  key={k}
                  onClick={() => press(k)}
                  className={`h-11 w-16 rounded-xl text-sm font-extrabold shadow-sm ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                    k === "="
                      ? "bg-slate-900 text-white ring-black/10 hover:bg-slate-800"
                      : "bg-white text-slate-900 ring-slate-200 hover:bg-slate-50"
                  }`}
                  type="button"
                >
                  {k}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
