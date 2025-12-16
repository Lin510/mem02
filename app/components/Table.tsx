"use client";

import React, { useState } from "react";
import TestFulger from "./TestFulger";

function Grid({ rows, cols, cell, operation, selectedHeader, setSelectedHeader }: { rows: number[]; cols: number[]; cell: (r: number, c: number) => React.ReactNode; operation: string; selectedHeader: number | null; setSelectedHeader: (n: number | null) => void }) {
  const gap = 8;
  // calculate a cell size so the full table fits within the typical content width (980px)
  const contentWidth = 980;
  const colsCount = cols.length + 1; // include header column
  let size = Math.floor((contentWidth - gap * cols.length) / colsCount);
  // clamp size to reasonable bounds
  size = Math.min(size, 56);
  size = Math.max(size, 28);

  const containerStyle: React.CSSProperties = {
    // avoid scrollbars by sizing cells dynamically so grid fits the page
    overflowX: "visible",
    padding: 8,
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols.length + 1}, ${size}px)`,
    gap,
    justifyContent: "center",
    alignItems: "center",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: size,
    width: size,
    background: "#efefef",
    borderRadius: 6,
    fontSize: 18,
    fontWeight: 700,
    cursor: "pointer",
    border: "1px solid #ddd",
  };

  const cellStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: size,
    height: size,
    border: "1px solid #ddd",
    borderRadius: 6,
    fontSize: 18,
    fontWeight: 800,
    background: "#fff",
  };

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <div style={{ ...headerStyle, cursor: "default" }}>
          {operation === "mul" ? "x" : operation === "sub" ? "-" : "+"}
        </div>

        {cols.map((c) => (
          <div
            key={`h-${c}`}
            onClick={() => setSelectedHeader(c)}
            style={{ ...headerStyle, background: selectedHeader === c ? "#fff2cc" : headerStyle.background }}
          >
            {c}
          </div>
        ))}

        {rows.map((r) => (
          <React.Fragment key={`row-${r}`}>
            <div
              onClick={() => setSelectedHeader(r)}
              style={{ ...headerStyle, background: selectedHeader === r ? "#fff2cc" : headerStyle.background }}
            >
              {r}
            </div>

            {cols.map((c) => {
              const value = cell(r, c);
              const isHeaderHighlight = selectedHeader !== null && (selectedHeader === r || selectedHeader === c);
              const isValueEqual = selectedHeader !== null && value === selectedHeader;

              let bg = cellStyle.background as string;
              if (isHeaderHighlight) bg = "#fff2cc";
              else if (isValueEqual) bg = "#f5f5f5";

              const textColor = typeof value === "number" && value < 0 ? "#d0d0d0" : "#000";

              return (
                <div key={`cell-${r}-${c}`} style={{ ...cellStyle, background: bg, color: textColor }}>
                  {value}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

type Props = {
  operation: "add" | "sub" | "mul";
  max: number;
  grade?: 0 | 2;
  title?: string;
};

export default function Table({ operation, max, grade = 2, title }: Props) {
  const [selectedHeader, setSelectedHeader] = useState<number | null>(null);
  const [showQuickTest, setShowQuickTest] = useState(false);

  

  const rows = Array.from({ length: max }, (_, i) => i + 1);
  const cols = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        {title ? (
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{title}</h2>
        ) : (
          <div />
        )}

        <div>
          <button
            onClick={() => {
              setShowQuickTest(true);
            }}
            style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #222", background: "#222", color: "#fff", fontWeight: 700 }}
          >
            Test fulger
          </button>
        </div>
      </div>

      <Grid
        rows={rows}
        cols={cols}
        cell={(r, c) => {
          if (operation === "add") return r + c;
          if (operation === "mul") return r * c;
          // subtraction: first factor horizontal => c - r
          return c - r;
        }}
        operation={operation}
        selectedHeader={selectedHeader}
        setSelectedHeader={setSelectedHeader}
      />

      {showQuickTest && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }} onClick={() => setShowQuickTest(false)}>
          <div style={{ background: "#fff", color: "#000", borderRadius: 10, padding: 20, minWidth: 520, maxWidth: 920 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontWeight: 800 }}>Test fulger</div>
              <button onClick={() => setShowQuickTest(false)} style={{ border: "none", background: "transparent", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>
            <div>
              <TestFulger grade={grade} operation={operation === "add" ? "add" : operation === "mul" ? "mul" : "sub"} maxFactor={operation === "mul" ? Math.min(10, max) : max} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
