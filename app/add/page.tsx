"use client";

import React, { useState } from "react";
import ButonInapoi from "../components/ButonInapoi";
import Tabel from "../components/Tabel";
// Link removed; BackButton used instead

export default function AddPage() {
  const [cls, setCls] = useState<0 | 2>(2);

  const max = cls === 0 ? 10 : 20;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-[980px] px-4 py-8 sm:px-6 lg:px-7">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <ButonInapoi />
            <h1 className="m-0 text-[28px] font-black tracking-tight">Adunare</h1>
          </div>
          {/* local back button removed; use BackButton before title */}
        </div>

        <div className="mb-5 flex justify-center">
          <div className="inline-flex w-full max-w-[520px] rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
            <button
              onClick={() => setCls(0)}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-extrabold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${cls === 0 ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"}`}
            >
              Clasa 0 (1–10)
            </button>
            <button
              onClick={() => setCls(2)}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-extrabold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${cls === 2 ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"}`}
            >
              Clasa 2 (1–20)
            </button>
          </div>
        </div>

        <p className="mb-6 text-center text-sm text-slate-600">💡 Poți da click pe orice cifră de pe primul rând pentru a face operația de adunare.</p>

        <Tabel operation="add" max={max} grade={cls} title={`Adunare 1 — ${max}`} />
      </div>
    </div>
  );
}
