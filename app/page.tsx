"use client";

import React from "react";
import Link from "next/link";
import ButonInapoi from "./components/ButonInapoi";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", color: "#000000", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: 28 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
            <ButonInapoi />
            <h1 style={{ fontSize: 40, fontWeight: 900, margin: 0 }}>Tabele Aritmetice</h1>
          </div>
          <p style={{ margin: "8px 0 6px", color: "#333", fontWeight: 600 }}>Gândită pentru utilizare la clasă și acasă.</p>
          <p style={{ marginTop: 2, color: "#333" }}>Alege operația pentru a deschide tabelul dedicat.</p>
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

        <div style={{ maxWidth: 980, margin: "28px auto 0", padding: 8 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, textAlign: "center" }}>Ce conține proiectul</h2>
          <p style={{ textAlign: "center", color: "#555", marginTop: 0, marginBottom: 18 }}>Fiecare pagină oferă un instrument diferit pentru exersarea și înțelegerea operațiilor aritmetice.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <div style={{ width: 300, boxSizing: "border-box", border: "1px solid #eee", borderRadius: 10, padding: 18, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 200 }}>
                <div>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>Adunare</div>
                  <div style={{ color: "#555", fontSize: 16, marginBottom: 12 }}>Tabele și exerciții pentru adunare — potrivite pentru Clasa 0 (1–10) și Clasa a 2-a (1–20).</div>
                </div>
                <div style={{ paddingTop: 8 }}>
                  <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 12, display: "flex", justifyContent: "flex-start" }}>
                    <Link href="/add"><button style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #222", background: "#222", color: "#fff", fontWeight: 700 }}>Deschide</button></Link>
                  </div>
                </div>
              </div>

              <div style={{ width: 300, boxSizing: "border-box", border: "1px solid #eee", borderRadius: 10, padding: 18, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 200 }}>
                <div>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>Scădere</div>
                  <div style={{ color: "#555", fontSize: 16, marginBottom: 12 }}>Exerciții de scădere cu logică care evită rezultate negative și oferă varietate.</div>
                </div>
                <div style={{ paddingTop: 8 }}>
                  <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 12, display: "flex", justifyContent: "flex-start" }}>
                    <Link href="/sub"><button style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #222", background: "#222", color: "#fff", fontWeight: 700 }}>Deschide</button></Link>
                  </div>
                </div>
              </div>

              <div style={{ width: 300, boxSizing: "border-box", border: "1px solid #eee", borderRadius: 10, padding: 18, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 200 }}>
                <div>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>Înmulțire</div>
                  <div style={{ color: "#555", fontSize: 16, marginBottom: 12 }}>Tabele pentru înmulțire și teste rapide (tablica 1–10).</div>
                </div>
                <div style={{ paddingTop: 8 }}>
                  <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 12, display: "flex", justifyContent: "flex-start" }}>
                    <Link href="/mul"><button style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #222", background: "#222", color: "#fff", fontWeight: 700 }}>Deschide</button></Link>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <div style={{ width: 300, boxSizing: "border-box", border: "1px solid #eee", borderRadius: 10, padding: 18, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 200 }}>
                <div>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>Experimente</div>
                  <div style={{ color: "#555", fontSize: 16, marginBottom: 12 }}>Zone pentru testare a unor idei și vizualizări.</div>
                </div>
                <div style={{ paddingTop: 8 }}>
                  <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 12, display: "flex", justifyContent: "flex-start" }}>
                    <Link href="/experiments"><button style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #222", background: "#222", color: "#fff", fontWeight: 700 }}>Deschide</button></Link>
                  </div>
                </div>
              </div>

              <div style={{ width: 300, boxSizing: "border-box", border: "1px solid #eee", borderRadius: 10, padding: 18, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 200 }}>
                <div>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>Calculator</div>
                  <div style={{ color: "#555", fontSize: 16, marginBottom: 12 }}>Instrument simplu pentru calcule rapide și verificarea rezultatelor.</div>
                </div>
                <div style={{ paddingTop: 8 }}>
                  <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 12, display: "flex", justifyContent: "flex-start" }}>
                    <Link href="/calculator"><button style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #222", background: "#222", color: "#fff", fontWeight: 700 }}>Deschide</button></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
