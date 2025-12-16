"use client";

import React from "react";
import BackButton from "../components/BackButton";
import Table from "../components/Table";
export default function SubPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#000", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <BackButton />
            <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>Scădere</h1>
          </div>
          {/* local back button removed; use BackButton before title */}
        </div>

        <Table operation="sub" max={20} grade={2} title={`Scădere 1 — 20`} />
      </div>
    </div>
  );
}
