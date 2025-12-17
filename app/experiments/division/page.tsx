"use client";

import React, { useMemo, useState } from "react";
import BackButton from "../../components/BackButton";

export default function DivisionExperiment() {
  const [min, setMin] = useState(-10);
  const [max, setMax] = useState(10);
  const [limit, setLimit] = useState(200);

  const ranges = useMemo(() => {
    const mi = Math.min(min, max);
    const ma = Math.max(min, max);
    const rows: Array<{ a: number; b: number; q: number }> = [];
    for (let a = mi; a <= ma; a++) {
      for (let b = mi; b <= ma; b++) {
        if (b === 0) continue;
        if (a % b === 0) {
          rows.push({ a, b, q: a / b });
          if (rows.length >= limit) return rows;
        }
      }
    }
    return rows;
  }, [min, max, limit]);

  return (
    <div style={{ minHeight: "100vh", padding: 28, fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
          <BackButton />
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Împărțire (doar rezultate întregi)</h1>
        </div>

        <p style={{ color: "#444" }}>Generăm perechi (dividend ÷ divizor) care dau rezultat întreg — fără fracții. Implicit: intervalul {min}..{max}.</p>

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            Min:
            <input type="number" value={min} onChange={(e) => setMin(parseInt(e.target.value || "0", 10))} style={{ width: 80, padding: 6 }} />
          </label>

          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            Max:
            <input type="number" value={max} onChange={(e) => setMax(parseInt(e.target.value || "0", 10))} style={{ width: 80, padding: 6 }} />
          </label>

          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            Max rezultate:
            <input type="number" value={limit} onChange={(e) => setLimit(Math.max(10, parseInt(e.target.value || "0", 10)))} style={{ width: 90, padding: 6 }} />
          </label>

          <div style={{ color: "#666", marginLeft: 8 }}>Interval recomandat: -10 .. 10</div>
        </div>

        <div style={{ overflowX: "auto", border: "1px solid #eee", borderRadius: 8 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", background: "#fafafa" }}>
                <th style={{ padding: 10, borderBottom: "1px solid #eee" }}>Dividend (a)</th>
                <th style={{ padding: 10, borderBottom: "1px solid #eee" }}>Divizor (b)</th>
                <th style={{ padding: 10, borderBottom: "1px solid #eee" }}>Rezultat (a ÷ b)</th>
              </tr>
            </thead>
            <tbody>
              {ranges.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: 12 }}>Nicio pereche găsită în intervalul dat.</td>
                </tr>
              ) : (
                ranges.map((r, i) => (
                  <tr key={`${r.a}-${r.b}-${i}`}>
                    <td style={{ padding: 10, borderTop: "1px solid #f4f4f4" }}>{r.a}</td>
                    <td style={{ padding: 10, borderTop: "1px solid #f4f4f4" }}>{r.b}</td>
                    <td style={{ padding: 10, borderTop: "1px solid #f4f4f4" }}>{r.q}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p style={{ color: "#666", marginTop: 12 }}>Notă: afișăm doar perechi pentru care rezultatul e un număr întreg (fără fracții).</p>
      </div>
    </div>
  );
}
