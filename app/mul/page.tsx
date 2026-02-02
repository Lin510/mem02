"use client";

import React, { useState } from "react";
import ButonInapoi from "../components/ButonInapoi";
import Tabel from "../components/Tabel";
import TestMaratonMul from "../components/TestMaratonMul";
export default function MulPage() {
  const max = 10; // fixed max for multiplication (class 2)

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#000", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ButonInapoi />
            <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>Înmulțire</h1>
          </div>
          {/* local back button removed; use BackButton before title */}
        </div>

        <p style={{ textAlign: "center", marginBottom: 20, fontSize: 15, color: "#555" }}>💡 Poți da click pe orice cifră de pe primul rând pentru a face operația de înmulțire.</p>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <TestMaratonMul />
        </div>

        <Tabel operation="mul" max={max} grade={2} title={`Înmulțire 1 — ${max}`} />
      </div>
    </div>
  );
}
