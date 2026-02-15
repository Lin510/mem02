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
    WebkitOverflowScrolling: "touch",
  };

  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: `repeat(${cols.length + 1}, ${size}px)`,
    gap,
  };

  const sizeStyle: React.CSSProperties = { width: size, height: size };
  const fontStyle: React.CSSProperties = { fontSize: Math.max(14, Math.min(18, Math.floor(size * 0.38))) };

  return (
    <div className="overflow-x-auto overflow-y-hidden p-2" style={containerStyle}>
      <div className="grid items-center justify-center" style={gridStyle}>
        <div
          className="flex select-none items-center justify-center rounded-lg bg-slate-100 font-extrabold text-slate-700 ring-1 ring-slate-200"
          style={{ ...sizeStyle, ...fontStyle, cursor: "default" }}
        >
          {operation === "mul" ? "×" : operation === "sub" ? "-" : operation === "div" ? "÷" : "+"}
        </div>

        {cols.map((c) => {
          const isSelected = selectedHeader === c;
          return (
            <button
              key={`h-${c}`}
              type="button"
              onClick={() => setSelectedHeader(c)}
              className={`flex select-none items-center justify-center rounded-lg font-extrabold ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                isSelected ? "bg-amber-100 text-slate-900 ring-amber-200" : "bg-slate-100 text-slate-800 ring-slate-200 hover:bg-slate-50"
              }`}
              style={{ ...sizeStyle, ...fontStyle }}
            >
              {c}
            </button>
          );
        })}

        {rows.map((r) => (
          <React.Fragment key={`row-${r}`}>
            {(() => {
              const isSelected = selectedHeader === r;
              return (
                <button
                  type="button"
                  onClick={() => setSelectedHeader(r)}
                  className={`flex select-none items-center justify-center rounded-lg font-extrabold ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                    isSelected ? "bg-amber-100 text-slate-900 ring-amber-200" : "bg-slate-100 text-slate-800 ring-slate-200 hover:bg-slate-50"
                  }`}
                  style={{ ...sizeStyle, ...fontStyle }}
                >
                  {r}
                </button>
              );
            })()}

            {cols.map((c) => {
              const value = cell(r, c);
              const isHeaderHighlight = selectedHeader !== null && (selectedHeader === r || selectedHeader === c);
              const isValueEqual = selectedHeader !== null && value === selectedHeader;
              const isNegative = typeof value === "number" && value < 0;

              const classes = isHeaderHighlight
                ? "bg-amber-100 ring-amber-200"
                : isValueEqual
                  ? "bg-slate-50 ring-slate-200"
                  : "bg-white ring-slate-200";

              return (
                <div
                  key={`cell-${r}-${c}`}
                  className={`flex items-center justify-center rounded-lg font-black ring-1 ${classes} ${isNegative ? "text-slate-300" : "text-slate-900"}`}
                  style={{ ...sizeStyle, ...fontStyle }}
                >
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
  operation: "add" | "sub" | "mul" | "div";
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
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
      <div className="mb-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        {title ? (
          <h2 className="m-0 text-xl font-extrabold tracking-tight">{title}</h2>
        ) : (
          <div />
        )}

        <div>
          <button
            onClick={() => {
              setShowQuickTest(true);
            }}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-extrabold text-white shadow-sm ring-1 ring-black/5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
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
          if (operation === "div") {
            // division: row ÷ column (e.g., 6÷2=3)
            const result = r / c;
            return Number.isInteger(result) ? result : "—";
          }
          // subtraction: first factor horizontal => c - r
          return c - r;
        }}
        operation={operation}
        selectedHeader={selectedHeader}
        setSelectedHeader={setSelectedHeader}
      />

      {showQuickTest && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-3 sm:items-center sm:p-4" onClick={() => setShowQuickTest(false)}>
          <div className="max-h-[85vh] w-full max-w-[920px] overflow-auto rounded-t-2xl bg-white text-black shadow-lg ring-1 ring-black/10 sm:max-h-[92vh] sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[#f0f0f0] bg-white px-4 py-3 sm:px-5">
              <div className="text-sm font-extrabold text-[#333]">Test fulger</div>
              <button
                onClick={() => setShowQuickTest(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-lg text-[#333] hover:bg-[#f7f7f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
                aria-label="Închide"
                type="button"
              >
                ✕
              </button>
            </div>
            <div className="px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
              <TestFulger
                embedded
                grade={grade}
                operation={operation === "add" ? "add" : operation === "mul" ? "mul" : operation === "div" ? "div" : "sub"}
                maxFactor={operation === "mul" || operation === "div" ? Math.min(10, max) : max}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
