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
    <div style={{ marginTop: 16, textAlign: "center" }}>
      <div style={{ display: "inline-block", padding: 12, borderRadius: 8, border: "1px solid #eee", minWidth: 240 }}>
        <div style={{ textAlign: "right", minHeight: 36, fontSize: 20, fontWeight: 800 }}>{expr || "0"}</div>
        <div style={{ textAlign: "right", color: result ? "#111" : "#999", minHeight: 56, fontSize: 40, fontWeight: 900 }}>{result === null ? "" : result}</div>

        <div style={{ marginTop: 8 }}>
          {keypad.map((row, i) => (
            <div key={i} style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
              {row.map((k) => (
                <button key={k} onClick={() => press(k)} style={{ width: 56, height: 44, borderRadius: 6, border: "1px solid #ccc", background: k === "=" ? "#222" : "#fff", color: k === "=" ? "#fff" : "#000", fontWeight: 700 }}>
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
