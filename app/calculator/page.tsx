"use client";

import React from "react";
import ButonInapoi from "../components/ButonInapoi";
import Calculator from "../components/Calculator";
export default function CalculatorPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#000", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ButonInapoi />
            <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>Calculator</h1>
          </div>
          {/* local back button removed; use BackButton before title */}
        </div>

        <Calculator />

        <div style={{ marginTop: 18, color: "#666" }}>
          <small>Folosește tastatura sau tastele de mai sus. `Enter` = egal, `C` = curăță, `Backspace` = șterge.</small>
        </div>
      </div>
    </div>
  );
}
