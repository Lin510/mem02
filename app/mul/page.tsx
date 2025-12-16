"use client";

import React, { useState } from "react";
import BackButton from "../components/BackButton";
import Table from "../components/Table";
export default function MulPage() {
  const max = 10; // fixed max for multiplication (class 2)

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#000", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <BackButton />
            <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>Înmulțire</h1>
          </div>
          {/* local back button removed; use BackButton before title */}
        </div>

        <Table operation="mul" max={max} grade={2} title={`Înmulțire 1 — ${max}`} />
      </div>
    </div>
  );
}
