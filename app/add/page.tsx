"use client";

import React, { useState } from "react";
import BackButton from "../components/BackButton";
import Table from "../components/Table";
// Link removed; BackButton used instead

export default function AddPage() {
  const [cls, setCls] = useState<0 | 2>(2);

  const max = cls === 0 ? 10 : 20;

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#000", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <BackButton />
            <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>Adunare</h1>
          </div>
          {/* local back button removed; use BackButton before title */}
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
          <button onClick={() => setCls(0)} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #222", background: cls === 0 ? "#222" : "#fff", color: cls === 0 ? "#fff" : "#000", fontWeight: 700 }}>Clasa 0 (1–10)</button>
          <button onClick={() => setCls(2)} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #222", background: cls === 2 ? "#222" : "#fff", color: cls === 2 ? "#fff" : "#000", fontWeight: 700 }}>Clasa 2 (1–20)</button>
        </div>

        <Table operation="add" max={max} grade={cls} title={`Adunare 1 — ${max}`} />
      </div>
    </div>
  );
}
