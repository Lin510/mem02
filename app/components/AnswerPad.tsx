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
          style={{
            minHeight: 56,
            width: "100%",
            boxSizing: "border-box",
            borderRadius: 12,
            border: "2px solid rgba(0,0,0,0.12)",
            background: "rgba(0,0,0,0.02)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 14px",
            fontSize: "1.8rem",
            fontWeight: 800,
            letterSpacing: "0.12em",
          }}
        >
          {answerStr.length ? (
            <span>{answerStr}</span>
          ) : (
            <span style={{ opacity: 0.25, letterSpacing: 0.06, fontWeight: 700 }}>—</span>
          )}
        </div>
      </div>

      {/* Keypad */}
      <div style={{ marginTop: 14 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
            width: "100%",
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              onClick={() => onDigit(n)}
              style={keyBtnStyle}
              aria-label={`Cifra ${n}`}
            >
              {n}
            </button>
          ))}

          {/* bottom row: back, 0, enter */}
          <button onClick={onBackspace} style={keyBtnStyle} aria-label="Șterge" title="Șterge (Backspace)">
            ⌫
          </button>
          <button onClick={() => onDigit(0)} style={keyBtnStyle} aria-label="Cifra 0">
            0
          </button>
          <button
            onClick={onSubmit}
            disabled={disabled}
            style={{
              ...keyBtnStyle,
              background: disabled ? "rgba(0,0,0,0.06)" : "#111",
              color: disabled ? "rgba(0,0,0,0.35)" : "#fff",
              borderColor: "rgba(0,0,0,0.18)",
              cursor: disabled ? "not-allowed" : "pointer",
            }}
            aria-label="Verifică"
            title="Verifică (Enter)"
          >
            ✓
          </button>
        </div>

        {showHint && (
          <div style={{ marginTop: 10, fontSize: "0.9rem", opacity: 0.65 }}>
            💡 Poți folosi și tastatura: cifre, Backspace, Enter.
          </div>
        )}
      </div>
    </div>
  );
}

const keyBtnStyle: React.CSSProperties = {
  height: 62,
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.16)",
  background: "#fff",
  fontSize: "1.5rem",
  fontWeight: 900,
  cursor: "pointer",
  userSelect: "none",
};
