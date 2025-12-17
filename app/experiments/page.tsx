"use client";

import React, { useMemo, useState } from "react";
import BackButton from "../components/BackButton";

const opSymbols: Record<string, string> = { add: "+", sub: "-", mul: "×", div: "÷" };

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

function DivisionGrid({ rows, cols, dotRadius = 6, maxWidth = 160, maxHeight = 160 }: { rows: number; cols: number; dotRadius?: number; maxWidth?: number; maxHeight?: number }) {
  const margin = 8;
  const r = Math.max(1, rows);
  const c = Math.max(1, cols);

  const availW = Math.max(40, maxWidth - margin * 2);
  const availH = Math.max(40, maxHeight - margin * 2);

  const spacingX = c === 1 ? 0 : availW / (c - 1);
  const spacingY = r === 1 ? 0 : availH / (r - 1);

  const width = maxWidth;
  const height = maxHeight;

  const xs = Array.from({ length: c }, (_, i) => margin + (c === 1 ? availW / 2 : i * spacingX));
  const ys = Array.from({ length: r }, (_, i) => margin + (r === 1 ? availH / 2 : i * spacingY));

  return (
    <svg width={width} height={height} style={{ borderRadius: 8, background: "#fff" }}>
      {xs.map((x, i) => (
        <line key={`v-${i}`} x1={x} y1={margin} x2={x} y2={height - margin} stroke="transparent" strokeWidth={0} />
      ))}
      {ys.map((y, i) => (
        <line key={`h-${i}`} x1={margin} y1={y} x2={width - margin} y2={y} stroke="transparent" strokeWidth={0} />
      ))}

      {xs.map((x, ci) =>
        ys.map((y, ri) => {
          const key = `dot-${ci}-${ri}`;
          return <circle key={key} cx={x} cy={y} r={dotRadius} fill="#222" />;
        })
      )}
    </svg>
  );
}
function DistributionColumns({ groups, perGroup, dotRadius = 8, maxWidth = 160, maxHeight = 160 }: { groups: number; perGroup: number; dotRadius?: number; maxWidth?: number; maxHeight?: number }) {
  // groups = b (columns), perGroup = q (items per column)
  const margin = 12;
  const g = Math.max(1, Math.floor(groups));
  const p = Math.max(0, Math.floor(perGroup));

  const width = maxWidth;
  const height = maxHeight;

  const availW = Math.max(40, width - margin * 2);
  const availH = Math.max(40, height - margin * 2);

  // column x positions evenly across available width
  const xs = Array.from({ length: g }, (_, i) => margin + (g === 1 ? availW / 2 : i * (availW / (g - 1))));

  // for each column produce p y positions from top->down, centered inside availH
  const colYs = (count: number) => {
    if (count <= 0) return [] as number[];
    if (count === 1) return [margin + availH / 2];
    const spacing = availH / (count - 1);
    return Array.from({ length: count }, (_, i) => margin + i * spacing);
  };

  return (
    <svg width={width} height={height} style={{ borderRadius: 8, background: "#fff" }}>
      {xs.map((x, ci) => (
        colYs(p).map((y, ri) => (
          <circle key={`c-${ci}-${ri}`} cx={x} cy={y} r={dotRadius} fill="#222" />
        ))
      ))}
    </svg>
  );
}

function DistributionCircles({ groups, perGroup, dotRadius = 6, size = 96 }: { groups: number; perGroup: number; dotRadius?: number; size?: number }) {
  // Render `groups` circles horizontally, and draw `perGroup` dots stacked inside each circle (row by row)
  const g = Math.max(1, groups);
  const p = Math.max(0, perGroup);
  const cols = Math.ceil(Math.sqrt(Math.max(1, p)));
  const rows = Math.ceil(p / cols);

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      {Array.from({ length: g }).map((_, gi) => (
        <div key={gi} style={{ width: size, height: size, borderRadius: size / 2, border: "2px solid #ddd", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", background: "#fff" }}>
          <div style={{ width: size - 10, height: size - 10, display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 6 }}>
            {Array.from({ length: p }).map((_, i) => (
              <div key={i} style={{ width: dotRadius * 2, height: dotRadius * 2, borderRadius: dotRadius, background: "#222", margin: "0 auto" }} />
            ))}
          </div>
        </div>
      ))}
    </div>
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

function BlocksVisualization({ first, second, size = 18, gap = 6 }: { first: number; second: number; size?: number; gap?: number }) {
  const rowStyle: React.CSSProperties = { display: "flex", gap, alignItems: "center" };
  const square = (color: string) => ({ background: color, width: size, height: size, borderRadius: 4 });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={rowStyle}>
        {Array.from({ length: Math.max(0, first) }).map((_, i) => (
          <div key={`f-${i}`} style={square("#e9ecef")} />
        ))}
      </div>

      <div style={rowStyle}>
        {Array.from({ length: Math.max(0, second) }).map((_, i) => (
          <div key={`s-${i}`} style={square("#6c757d")} />
        ))}
      </div>
    </div>
  );
}

function GroupsVisualization({ groups, perGroup, dotRadius = 6, groupGap = 18 }: { groups: number; perGroup: number; dotRadius?: number; groupGap?: number }) {
  // Arată `groups` linii orizontale, fiecare cu `perGroup` puncte
  const g = Math.max(0, groups);
  const p = Math.max(0, perGroup);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: groupGap, alignItems: "flex-start" }}>
      {Array.from({ length: g }).map((_, gi) => (
        <div key={gi} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {Array.from({ length: p }).map((_, pi) => (
            <div
              key={pi}
              style={{
                width: dotRadius * 2,
                height: dotRadius * 2,
                borderRadius: dotRadius,
                background: "#222",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function NumberLineJumps({ step, jumps }: { step: number; jumps: number }) {
  // step = cât sărim, jumps = de câte ori sărim
  // Ex: 3 × 4 = sărituri de 3, de 4 ori: 0 → 3 → 6 → 9 → 12
  const s = Math.max(1, step);
  const j = Math.max(0, jumps);
  
  const points = Array.from({ length: j + 1 }, (_, i) => i * s);
  const max = points[points.length - 1] || 0;
  
  const width = 450;
  const margin = 40;
  const availWidth = width - margin * 2;
  const scaleX = max > 0 ? availWidth / max : 1;
  
  return (
    <svg width={width} height={80} style={{ borderRadius: 8, background: "#fff" }}>
      {/* Axa */}
      <line x1={margin} y1={50} x2={width - margin} y2={50} stroke="#333" strokeWidth={2} />
      
      {/* Săgeți între puncte */}
      {points.slice(0, -1).map((val, i) => {
        const x1 = margin + val * scaleX;
        const x2 = margin + points[i + 1] * scaleX;
        const midY = 35;
        return (
          <g key={`arrow-${i}`}>
            <path
              d={`M ${x1 + 8} ${midY} Q ${(x1 + x2) / 2} ${midY - 8} ${x2 - 8} ${midY}`}
              stroke="#3b82f6"
              strokeWidth={2}
              fill="none"
              markerEnd="url(#arrowhead)"
            />
          </g>
        );
      })}
      
      {/* Puncte și etichete */}
      {points.map((val, i) => {
        const x = margin + val * scaleX;
        return (
          <g key={`point-${i}`}>
            <circle cx={x} cy={50} r={6} fill={i === 0 ? "#999" : "#3b82f6"} />
            <text x={x} y={70} textAnchor="middle" fontSize={13} fontWeight={600} fill="#333">
              {val}
            </text>
          </g>
        );
      })}
      
      {/* Săgeată marker */}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
        </marker>
      </defs>
    </svg>
  );
}

function RectangleVisualization({ rows, cols, cellSize = 14, gap = 2 }: { rows: number; cols: number; cellSize?: number; gap?: number }) {
  // Arată `cols` dreptunghiuri gri deschis, fiecare cu `rows` blocuri gri închis
  const r = Math.max(0, rows);
  const c = Math.max(0, cols);

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      {Array.from({ length: c }).map((_, ci) => (
        <div
          key={ci}
          style={{
            display: "grid",
            gridTemplateRows: `repeat(${r}, ${cellSize}px)`,
            gap,
            padding: 8,
            background: "#e9ecef",
            borderRadius: 6,
            border: "1px solid #ced4da",
          }}
        >
          {Array.from({ length: r }).map((_, ri) => (
            <div
              key={ri}
              style={{
                width: cellSize,
                height: cellSize,
                background: "#495057",
                borderRadius: 2,
              }}
            />
          ))}
        </div>
      ))}
    </div>
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
  const [operation, setOperation] = useState<"add" | "sub" | "mul" | "div">("add");
  const variantOptionsByOp: Record<string, string[]> = {
    add: ["two-lines", "blocks"],
    sub: ["20-sloturi"],
    mul: ["grupuri", "axa", "grila"],
    div: ["columns", "circles"],
  };

  const variantLabel: Record<string, string> = {
    "two-lines": "Două linii",
    "20-sloturi": "20 sloturi (axă)",
    grila: "Grilă",
    grupuri: "Grupe egale",
    axa: "Sărituri pe axă",
    columns: "Coloane",
    circles: "Cercuri",
    blocks: "Blocuri",
  };

  const [viewVariantByOp, setViewVariantByOp] = useState<Record<"add" | "sub" | "mul" | "div", string>>({
    add: "two-lines",
    sub: "20-sloturi",
    mul: "grupuri",
    div: "columns",
  });
  const [animate, setAnimate] = useState(false);
  const [max, setMax] = useState<number>(10);
  const [a, setA] = useState<number>(1);
  const [swapFactors, setSwapFactors] = useState(false);

  const rows = useMemo(() => Array.from({ length: max }, (_, i) => i + 1), [max]);
  const displayRows = useMemo(() => {
    if (operation !== "div") return rows;
    return rows.filter((x) => a % x === 0);
  }, [rows, operation, a]);
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
            <button onClick={() => setOperation("div")} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #222", background: operation === "div" ? "#222" : "#fff", color: operation === "div" ? "#fff" : "#000", fontWeight: 700 }}>÷</button>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <div aria-label="A choices" style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(rows.length, 10)}, auto)`, gap: 6 }}>
              {rows.map((v) => {
                const isDisabled = operation === "div" && v === 1;
                return (
                  <button
                    key={v}
                    onClick={() => { if (!isDisabled) setA(v); }}
                    disabled={isDisabled}
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
                      ...(isDisabled ? { opacity: 0.45, cursor: "not-allowed" } : {}),
                  }}
                  >
                    {v}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontWeight: 700 }}>{(() => {
            const map: Record<string, string> = { add: "adunare", sub: "scădere", mul: "înmulțire", div: "împărțire" };
            return `Vizualizare ${map[operation] || "vizualizare"}:`;
          })()}</div>

          {variantOptionsByOp[operation].map((variantKey) => (
            <button
              key={variantKey}
              onClick={() => setViewVariantByOp({ ...viewVariantByOp, [operation]: variantKey })}
              style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #222", background: viewVariantByOp[operation] === variantKey ? "#222" : "#fff", color: viewVariantByOp[operation] === variantKey ? "#fff" : "#000", fontWeight: 700 }}
            >
              {variantLabel[variantKey] ?? variantKey}
            </button>
          ))}
        </div>

        {/* Header */}
        <div className="experiments-grid-header" style={{ display: "grid", gridTemplateColumns: `minmax(320px, 1fr) ${operation === "sub" ? rightColWidth : 380}px`, columnGap: 18, alignItems: "center" }}>
          <div />
          {null}
        </div>

        {/* Rows */}
        <div className="experiments-grid-rows" style={{ display: "grid", gridTemplateColumns: `minmax(320px, 1fr) ${operation === "sub" ? rightColWidth : 380}px`, columnGap: 18 }}>
          {displayRows.map((x) => {
            // stânga: explică
            let leftNode: React.ReactNode;
            let rightNode: React.ReactNode;

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
            } else if (operation === "div") {
              const divisible = a % x === 0;
              const q = divisible ? a / x : null;

              leftNode = (
                <div style={{ fontWeight: 700, fontSize: "1.5em" }}>
                  {a} ÷ {x} = {divisible ? q : <span style={{ color: "#bbb" }}>—</span>}
                </div>
              );

              rightNode = (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {divisible ? (
                    viewVariantByOp[operation] === "columns" ? (
                      <DistributionColumns groups={x} perGroup={q ?? 0} />
                    ) : (
                      <DistributionCircles groups={x} perGroup={q ?? 0} />
                    )
                  ) : (
                    <div style={{ color: "#999", fontStyle: "italic" }}>Nu e divizibil fără remainder</div>
                  )}
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
              // addition: render according to selected variant
              const v = viewVariantByOp[operation];
              if (v === "two-lines") {
                rightNode = (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <TwoVerticalLines left={a} right={x} dotRadius={6} />
                  </div>
                );
              } else if (v === "blocks") {
                rightNode = (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <BlocksVisualization first={a} second={x} />
                  </div>
                );
              } else {
                // fallback to grid
                rightNode = (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <SmallGrid a={a} b={x} />
                  </div>
                );
              }
            } else if (operation === "mul") {
              const v = viewVariantByOp[operation];
              if (v === "grupuri") {
                const r = swapFactors ? x : a;
                const c = swapFactors ? a : x;
                const repetitions = c;
                const items = r;
                const displayText = repetitions === 1 ? `${items} o dată` : `${items} de ${repetitions} ori`;
                rightNode = (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <button
                      onClick={() => setSwapFactors(!swapFactors)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid #ddd",
                        background: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#495057",
                      }}
                      title="Inversează factorii"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <polyline points="1 20 1 14 7 14"></polyline>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                      </svg>
                      {displayText}
                    </button>
                    <RectangleVisualization rows={r} cols={c} />
                  </div>
                );
              } else if (v === "axa") {
                rightNode = (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <NumberLineJumps step={a} jumps={x} />
                  </div>
                );
              } else if (v === "grila") {
                rightNode = (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <SmallGrid a={a} b={x} />
                  </div>
                );
              } else {
                rightNode = (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <SmallGrid a={a} b={x} />
                  </div>
                );
              }
            } else if (operation === "div") {
              // division case handled earlier; keep the `rightNode` already set
            } else if (operation === "sub") {
              const v = viewVariantByOp[operation];
              if (v === "20-sloturi") {
                rightNode = (
                  <div style={{ display: "flex", gap: pairGap, alignItems: "center", justifyContent: "flex-start" }}>
                    {/* x - a */}
                    <TwentyBulletsAxis available={x} need={a} size={bulletSize} gap={bulletGap} axisGap={axisGap} showAxis />
                    {/* a - x */}
                    <TwentyBulletsAxis available={a} need={x} size={bulletSize} gap={bulletGap} axisGap={axisGap} showAxis />
                  </div>
                );
              } else {
                // fallback to grid
                rightNode = (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <SmallGrid a={a} b={x} />
                  </div>
                );
              }
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
