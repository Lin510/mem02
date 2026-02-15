"use client";

import React from "react";
import ButonInapoi from "../components/ButonInapoi";
import Tabel from "../components/Tabel";
export default function SubPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-[980px] px-4 py-8 sm:px-6 lg:px-7">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <ButonInapoi />
            <h1 className="m-0 text-[28px] font-black tracking-tight">Scădere</h1>
          </div>
          {/* local back button removed; use BackButton before title */}
        </div>

        <p className="mb-6 text-center text-sm text-slate-600">💡 Poți da click pe orice cifră de pe primul rând pentru a face operația de scădere.</p>

        <Tabel operation="sub" max={20} grade={2} title={`Scădere 1 — 20`} />
      </div>
    </div>
  );
}
