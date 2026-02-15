"use client";

import React from "react";

type Props = {
  answerStr: string;
  onDigit: (digit: number) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  disabled?: boolean;
  showHint?: boolean;
};

export default function AnswerPad({ answerStr, onDigit, onBackspace, onSubmit, disabled = false, showHint = true }: Props) {
  return (
    <div>
      {/* Pseudo input */}
      <div>
        <div
          aria-label="Răspuns"
          className="flex min-h-[56px] w-full items-center justify-center rounded-2xl bg-slate-50 px-[14px] py-[10px] text-[1.8rem] font-extrabold tracking-[0.12em] ring-1 ring-slate-200"
        >
          {answerStr.length ? (
            <span>{answerStr}</span>
          ) : (
            <span className="font-bold tracking-[0.06em] opacity-25">—</span>
          )}
        </div>
      </div>

      {/* Keypad */}
      <div className="mt-3.5">
        <div className="grid w-full grid-cols-3 gap-2.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              onClick={() => onDigit(n)}
              className="h-[62px] select-none rounded-2xl bg-white text-[1.5rem] font-black shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              aria-label={`Cifra ${n}`}
              type="button"
            >
              {n}
            </button>
          ))}

          {/* bottom row: back, 0, enter */}
          <button
            onClick={onBackspace}
            className="h-[62px] select-none rounded-2xl bg-white text-[1.5rem] font-black shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            aria-label="Șterge"
            title="Șterge (Backspace)"
            type="button"
          >
            ⌫
          </button>
          <button
            onClick={() => onDigit(0)}
            className="h-[62px] select-none rounded-2xl bg-white text-[1.5rem] font-black shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            aria-label="Cifra 0"
            type="button"
          >
            0
          </button>
          <button
            onClick={onSubmit}
            disabled={disabled}
            className={`h-[62px] select-none rounded-2xl text-[1.5rem] font-black shadow-sm ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
              disabled ? "cursor-not-allowed bg-slate-100 text-slate-400 ring-slate-200" : "cursor-pointer bg-slate-900 text-white ring-black/10 hover:bg-slate-800"
            }`}
            aria-label="Verifică"
            title="Verifică (Enter)"
            type="button"
          >
            ✓
          </button>
        </div>

        {showHint && (
          <div className="mt-2.5 text-[0.9rem] text-slate-600">
            💡 Poți folosi și tastatura: cifre, Backspace, Enter.
          </div>
        )}
      </div>
    </div>
  );
}
