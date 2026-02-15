"use client";

import React from "react";
import Link from "next/link";
import ButonInapoi from "./components/ButonInapoi";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-[980px] px-4 py-7 sm:px-6 lg:px-7">
        <div className="mb-8 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <ButonInapoi />
            <h1 className="m-0 text-3xl font-black tracking-tight sm:text-4xl">Tabele Aritmetice</h1>
          </div>
          <p className="mb-1 mt-3 font-semibold text-[#333]">Gândită pentru utilizare la clasă și acasă.</p>
          <p className="mt-0 text-[#333]">Alege operația pentru a deschide tabelul dedicat.</p>
        </div>

        <div className="mx-auto mb-6 grid w-full max-w-[720px] grid-cols-2 gap-3 min-[420px]:grid-cols-3 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center">
          <Link
            href="/add"
            className="inline-flex items-center justify-center rounded-lg border border-[#222] bg-white px-4 py-2.5 text-sm font-extrabold text-black no-underline hover:bg-[#f7f7f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
          >
            Adunare
          </Link>

          <Link
            href="/sub"
            className="inline-flex items-center justify-center rounded-lg border border-[#222] bg-white px-4 py-2.5 text-sm font-extrabold text-black no-underline hover:bg-[#f7f7f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
          >
            Scădere
          </Link>

          <Link
            href="/mul"
            className="inline-flex items-center justify-center rounded-lg border border-[#222] bg-white px-4 py-2.5 text-sm font-extrabold text-black no-underline hover:bg-[#f7f7f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
          >
            Înmulțire
          </Link>

          <Link
            href="/div"
            className="inline-flex items-center justify-center rounded-lg border border-[#222] bg-white px-4 py-2.5 text-sm font-extrabold text-black no-underline hover:bg-[#f7f7f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
          >
            Împărțire
          </Link>

          <Link
            href="/calculator"
            className="inline-flex items-center justify-center rounded-lg border border-[#222] bg-white px-4 py-2.5 text-sm font-extrabold text-black no-underline hover:bg-[#f7f7f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
          >
            Calculator
          </Link>

          <Link
            href="/experiments"
            className="col-span-2 inline-flex items-center justify-center rounded-lg border border-[#222] bg-white px-4 py-2.5 text-sm font-extrabold text-black no-underline hover:bg-[#f7f7f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 min-[420px]:col-span-3 sm:col-auto"
          >
            Experimente
          </Link>
        </div>

        <div className="mx-auto max-w-[720px] rounded-xl border border-[#eee] bg-white p-4 text-center text-sm text-[#666] shadow-[0_2px_6px_rgba(0,0,0,0.03)]">
          <p className="m-0">- Clasa 0: doar Adunare 1–10</p>
          <p className="m-0">- Clasa 2: Adunare 1–20, Scădere 1–20, Înmulțire 1–10, Împărțire 1–10</p>
        </div>

        <div className="mx-auto mt-10 max-w-[980px]">
          <h2 className="mb-2 text-center text-xl font-extrabold">Ce conține proiectul</h2>
          <p className="mb-6 mt-0 text-center text-sm text-[#555]">Fiecare pagină oferă un instrument diferit pentru exersarea și înțelegerea operațiilor aritmetice.</p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Adunare",
                desc: "Tabele și exerciții pentru adunare — potrivite pentru Clasa 0 (1–10) și Clasa a 2-a (1–20).",
                href: "/add",
              },
              {
                title: "Scădere",
                desc: "Exerciții de scădere cu logică care evită rezultate negative și oferă varietate.",
                href: "/sub",
              },
              {
                title: "Înmulțire",
                desc: "Tabele pentru înmulțire și teste rapide (tablica 1–10).",
                href: "/mul",
              },
              {
                title: "Împărțire",
                desc: "Tabele pentru împărțire și exerciții de împărțire exactă (1–10).",
                href: "/div",
              },
              {
                title: "Calculator",
                desc: "Instrument simplu pentru calcule rapide și verificarea rezultatelor.",
                href: "/calculator",
              },
              {
                title: "Experimente",
                desc: "Zone pentru testare a unor idei și vizualizări.",
                href: "/experiments",
              },
            ].map((card) => (
              <div key={card.href} className="flex min-h-[200px] flex-col justify-between rounded-[10px] border border-[#eee] bg-white p-[18px] shadow-[0_2px_6px_rgba(0,0,0,0.03)]">
                <div>
                  <div className="mb-1 text-base font-extrabold">{card.title}</div>
                  <div className="text-sm leading-relaxed text-[#555]">{card.desc}</div>
                </div>
                <div className="mt-4 flex justify-start border-t border-slate-100 pt-4">
                  <Link
                    href={card.href}
                    className="inline-flex items-center justify-center rounded-lg border border-[#222] bg-[#222] px-3 py-2 text-sm font-extrabold text-white no-underline hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
                  >
                    Deschide
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
