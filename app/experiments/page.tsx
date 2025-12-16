"use client";

import React, { useMemo, useState } from "react";
import BackButton from "../components/BackButton";

const opSymbols: Record<string, string> = { add: "+", sub: "-", mul: "×" };

function compute(op: string, a: number, b: number) {
  if (op === "add") return a + b;
  if (op === "mul") return a * b;
  return a - b;
}

function SmallGrid({ a, b }: { a: number; b: number }) {
  const width = 160;
  const height = 160;
  const margin = 12;

  const cols = Math.max(1, b);
  const rows = Math.max(1, a);

  const xs = useMemo(() => {
    const arr: number[] = [];
    const dx = (width - margin * 2) / Math.max(1, cols - 1);
    for (let i = 0; i < cols; i++) {
      arr.push(margin + (cols === 1 ? (width - margin * 2) / 2 : i * dx));
    }
    return arr;
  }, [cols]);

  const ys = useMemo(() => {
    const arr: number[] = [];
    const dy = (height - margin * 2) / Math.max(1, rows - 1);
    for (let i = 0; i < rows; i++) {
      arr.push(margin + (rows === 1 ? (height - margin * 2) / 2 : i * dy));
    }
    return arr;
  }, [rows]);

  return (
    <svg width={width} height={height} style={{ borderRadius: 8, background: "#fff" }}>
      {xs.map((x, i) => (
        <line key={`v-${i}`} x1={x} y1={margin} x2={x} y2={height - margin} stroke="#bbb" strokeWidth={1} />
      ))}
      {ys.map((y, i) => (
        <line key={`h-${i}`} x1={margin} y1={y} x2={width - margin} y2={y} stroke="#bbb" strokeWidth={1} />
      ))}
      {xs.map((x, i) =>
        ys.map((y, j) => <circle key={`p-${i}-${j}`} cx={x} cy={y} r={6} fill="#222" />)
      )}
    </svg>
  );
}

function TwoVerticalLines({ left, right, dotRadius = 6 }: { left: number; right: number; dotRadius?: number }) {
  const width = 160;
  const height = 160;
  const margin = 24;

  const ysLeft = useMemo(() => {
    const n = Math.max(1, left);
    const arr: number[] = [];
    const dy = (height - margin * 2) / Math.max(1, n - 1);
    for (let i = 0; i < n; i++) arr.push(margin + (n === 1 ? (height - margin * 2) / 2 : i * dy));
    return arr;
  }, [left]);

  const ysRight = useMemo(() => {
    const n = Math.max(1, right);
    const arr: number[] = [];
    const dy = (height - margin * 2) / Math.max(1, n - 1);
    for (let i = 0; i < n; i++) arr.push(margin + (n === 1 ? (height - margin * 2) / 2 : i * dy));
    return arr;
  }, [right]);

  return (
    <svg width={width} height={height} style={{ borderRadius: 8, background: "#fff" }}>
      <line x1={margin} y1={margin} x2={margin} y2={height - margin} stroke="#bbb" strokeWidth={2} />
      <line x1={width - margin} y1={margin} x2={width - margin} y2={height - margin} stroke="#bbb" strokeWidth={2} />

      {ysLeft.map((y, i) => (
        <circle key={`L-${i}`} cx={margin} cy={y} r={dotRadius} fill="#222" />
      ))}

      {ysRight.map((y, i) => (
        <circle key={`R-${i}`} cx={width - margin} cy={y} r={dotRadius} fill="#222" />
      ))}
    </svg>
  );
}

/**
 * 20 sloturi fixe (10 stânga + 10 dreapta) pe AXĂ:
 * - dacă available >= need:  [removed(gri)] | [remain(verde)]
 * - dacă available <  need:  [deficit(roșu)] | [removed(gri)]
 *
 * IMPORTANT:
 * - spațiile (empty) stau la margini, NU lângă axă
 * - stânga se umple dinspre axă spre exterior (index 9 -> 0)
 * - dreapta se umple dinspre axă spre exterior (index 0 -> 9)
 */
function TwentyBulletsAxis({
  available,
  need,
  size = 16,
  gap = 6,
  axisGap = 10,
  showAxis = true,
  remainColor = "#b7e4c7",
  removedColor = "#f0f0f0",
  deficitColor = "#f7c6c6",
}: {
  available: number;
  need: number;
  size?: number;
  gap?: number;
  axisGap?: number;
  showAxis?: boolean;
  remainColor?: string;
  removedColor?: string;
  deficitColor?: string;
}) {
  const HALF = 10;

  const isNegative = need > available;

  // CÂTE punem pe fiecare parte (max 10)
  const leftCount = Math.min(isNegative ? (need - available) : need, HALF);
  const rightCount = Math.min(isNegative ? available : (available - need), HALF);

  const leftKind: "removed" | "deficit" = isNegative ? "deficit" : "removed";
  const rightKind: "removed" | "remain" = isNegative ? "removed" : "remain";

  // sloturi fixe
  const left: Array<"removed" | "deficit" | "empty"> = Array(HALF).fill("empty");
  const right: Array<"removed" | "remain" | "empty"> = Array(HALF).fill("empty");

  // STÂNGA: din centru spre exterior (9 -> 0)
  let li = HALF - 1;
  for (let i = 0; i < leftCount && li >= 0; i++) left[li--] = leftKind;

  // DREAPTA: din centru spre exterior (0 -> 9)
  for (let i = 0; i < rightCount; i++) right[i] = rightKind;

  const halfWidth = HALF * size + (HALF - 1) * gap;
  const totalWidth = halfWidth * 2 + axisGap * 2 + (showAxis ? 1 : 0);

  const base: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: size / 2,
    flex: "0 0 auto",
  };

  const dot = (kind: string, key: string) => {
    if (kind === "empty") return <div key={key} style={{ ...base, opacity: 0 }} />;

    if (kind === "removed") {
      return <div key={key} style={{ ...base, background: removedColor, border: "1px solid #ddd" }} />;
    }

    if (kind === "remain") {
      return <div key={key} style={{ ...base, background: remainColor, border: "1px solid #222" }} />;
    }

    // deficit
    return <div key={key} style={{ ...base, background: "transparent", border: `2px dashed ${deficitColor}` }} />;
  };

  return (
    <div style={{ width: totalWidth, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* STÂNGA: lipit de axă (umplere spre exterior) */}
      <div style={{ width: halfWidth, display: "flex", gap, justifyContent: "flex-end", alignItems: "center" }}>
        {left.map((k, i) => dot(k, `L-${i}`))}
      </div>

      <div style={{ width: axisGap }} />
      {showAxis ? <div style={{ width: 1, height: size + 8, background: "#ddd" }} /> : null}
      <div style={{ width: axisGap }} />

      {/* DREAPTA: lipit de axă (umplere spre exterior) */}
      <div style={{ width: halfWidth, display: "flex", gap, justifyContent: "flex-start", alignItems: "center" }}>
        {right.map((k, i) => dot(k, `R-${i}`))}
      </div>
    </div>
  );
}


export default function ExperimentsPage() {
  const [operation, setOperation] = useState<"add" | "sub" | "mul">("add");
  const [max, setMax] = useState<number>(10);
  const [a, setA] = useState<number>(10);

  const rows = useMemo(() => Array.from({ length: max }, (_, i) => i + 1), [max]);
  const symbol = opSymbols[operation];

  // pentru - : două vizuale pe rând
  const bulletSize = 16;
  const bulletGap = 6;
  const axisGap = 10;
  const pairGap = 16;

  const halfWidth = 10 * bulletSize + 9 * bulletGap;
  const singleWidth = halfWidth * 2 + axisGap * 2 + 1; // + ax line
  const rightColWidth = singleWidth * 2 + pairGap + 24; // + padding safety

  return (
    <div className="experiments" style={{ minHeight: "100vh", background: "#fff", color: "#000", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <BackButton />
            <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>Experimente — operații simple</h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setMax(10)} style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #222", background: max === 10 ? "#222" : "#fff", color: max === 10 ? "#fff" : "#000", fontWeight: 700 }}>
              1–10
            </button>
            <button onClick={() => setMax(20)} style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #222", background: max === 20 ? "#222" : "#fff", color: max === 20 ? "#fff" : "#000", fontWeight: 700 }}>
              1–20
            </button>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setOperation("add")} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #222", background: operation === "add" ? "#222" : "#fff", color: operation === "add" ? "#fff" : "#000", fontWeight: 700 }}>+</button>
            <button onClick={() => setOperation("sub")} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #222", background: operation === "sub" ? "#222" : "#fff", color: operation === "sub" ? "#fff" : "#000", fontWeight: 700 }}>-</button>
            <button onClick={() => setOperation("mul")} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #222", background: operation === "mul" ? "#222" : "#fff", color: operation === "mul" ? "#fff" : "#000", fontWeight: 700 }}>×</button>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <div aria-label="A choices" style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(rows.length, 10)}, auto)`, gap: 6 }}>
              {rows.map((v) => (
                <button
                  key={v}
                  onClick={() => setA(v)}
                  style={{
                    padding: "6px 8px",
                    borderRadius: 6,
                    border: "1px solid #222",
                    background: a === v ? "#222" : "#fff",
                    color: a === v ? "#fff" : "#000",
                    fontWeight: 700,
                    cursor: "pointer",
                    minWidth: 36,
                    textAlign: "center",
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="experiments-grid-header" style={{ display: "grid", gridTemplateColumns: `minmax(320px, 1fr) ${operation === "sub" ? rightColWidth : 380}px`, columnGap: 18, alignItems: "center" }}>
          <div />
          {operation !== "sub" ? <div style={{ fontWeight: 800, marginBottom: 6 }}>Vizualizare linii & intersecții</div> : null}
        </div>

        {/* Rows */}
        <div className="experiments-grid-rows" style={{ display: "grid", gridTemplateColumns: `minmax(320px, 1fr) ${operation === "sub" ? rightColWidth : 380}px`, columnGap: 18 }}>
          {rows.map((x) => {
            // stânga: explică
            let leftNode: React.ReactNode;

            if (operation === "sub") {
              const leftVal = compute("sub", x, a); // x - a
              const swapped = compute("sub", a, x); // a - x

              leftNode = (
                <div style={{ display: "flex", alignItems: "center", gap: 24, fontWeight: 700, fontSize: "1.5em" }}>
                  <div>
                    <span>{x} - {a} = </span>
                    <span style={{ color: leftVal < 0 ? "#bbb" : "#000", fontWeight: 800 }}>{leftVal}</span>
                  </div>
                  <div style={{ color: swapped < 0 ? "#bbb" : "#000" }}>
                    <span>{a} - {x} = </span>
                    <span style={{ fontWeight: 800 }}>{swapped}</span>
                  </div>
                </div>
              );
            } else {
              const left = compute(operation, a, x);
              if (operation === "mul") {
                leftNode = (
                  <div style={{ fontWeight: 700, fontSize: "1.5em" }}>
                    {a} {symbol} {x} = {left} = {x} {symbol} {a}
                  </div>
                );
              } else {
                leftNode = <div style={{ fontWeight: 700, fontSize: "1.5em" }}>{a} {symbol} {x} = {left} = {x} {symbol} {a}</div>;
              }
            }

            // dreapta: vizual
            let rightNode: React.ReactNode;

            if (operation === "sub") {
              rightNode = (
                <div style={{ display: "flex", gap: pairGap, alignItems: "center", justifyContent: "flex-start" }}>
                  {/* x - a */}
                  <TwentyBulletsAxis available={x} need={a} size={bulletSize} gap={bulletGap} axisGap={axisGap} showAxis />
                  {/* a - x */}
                  <TwentyBulletsAxis available={a} need={x} size={bulletSize} gap={bulletGap} axisGap={axisGap} showAxis />
                </div>
              );
            } else if (operation === "add") {
              // For addition, show two vertical lines with counts `a` and `x` respectively
              rightNode = (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TwoVerticalLines left={a} right={x} dotRadius={6} />
                </div>
              );
            } else {
              rightNode = (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <SmallGrid a={a} b={x} />
                </div>
              );
            }

            return (
              <React.Fragment key={x}>
                <div className="left-node" style={{ padding: "6px 8px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", minHeight: 72 }}>
                  {leftNode}
                </div>

                <div className="right-node" style={{ padding: "6px 8px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "flex-start", minHeight: 72, overflow: "visible" }}>
                  {rightNode}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <div style={{ marginTop: 12, color: "#666", fontSize: 13 }}>
          Aici arătăm vizual cu 20 sloturi (10 + 10) pe axă. Dacă îți place, continuă pe foaie 😊
        </div>
      </div>
    </div>
  );
}
