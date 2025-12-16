"use client";

import React from "react";
import Link from "next/link";
import BackButton from "./components/BackButton";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", color: "#000000", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: 28 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <BackButton />
            <h1 style={{ fontSize: 40, fontWeight: 900, margin: 0 }}>Tabele Aritmetice</h1>
          </div>
          <p style={{ marginTop: 8, color: "#333" }}>Alege operația pentru a deschide tabelul dedicat.</p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 20 }}>
          <Link href="/add" style={{ textDecoration: "none" }}>
            <button style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #222", background: "#fff", color: "#000", fontWeight: 800 }}>Adunare</button>
          </Link>

          <Link href="/sub" style={{ textDecoration: "none" }}>
            <button style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #222", background: "#fff", color: "#000", fontWeight: 800 }}>Scădere</button>
          </Link>

          <Link href="/mul" style={{ textDecoration: "none" }}>
            <button style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #222", background: "#fff", color: "#000", fontWeight: 800 }}>Înmulțire</button>
          </Link>

          <Link href="/experiments" style={{ textDecoration: "none" }}>
            <button style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #222", background: "#fff", color: "#000", fontWeight: 800 }}>Experimente</button>
          </Link>

          <Link href="/calculator" style={{ textDecoration: "none" }}>
            <button style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #222", background: "#fff", color: "#000", fontWeight: 800 }}>Calculator</button>
          </Link>
        </div>

        <div style={{ textAlign: "center", color: "#666" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <p style={{ margin: 0 }}>- Clasa 0: doar Adunare 1–10</p>
            <p style={{ margin: 0 }}>- Clasa 2: Adunare 1–20, Scădere 1–20, Înmulțire 1–10</p>
          </div>
        </div>
      </div>
    </div>
  );
}
