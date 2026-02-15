"use client";

import React from "react";
import ButonInapoi from "../components/ButonInapoi";
import Tabel from "../components/Tabel";
import TestMaratonDiv from "../components/TestMaratonDiv";

export default function DivPage() {
  const max = 10; // fixed max for division (class 2)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-[980px] px-4 py-8 sm:px-6 lg:px-7">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <ButonInapoi />
            <h1 className="m-0 text-[28px] font-black tracking-tight">Împărțire</h1>
          </div>
        </div>

        <p className="mb-6 text-center text-sm text-slate-600">💡 Poți da click pe orice cifră de pe primul rând pentru a face operația de împărțire.</p>

        <div className="mb-5 flex justify-center">
          <TestMaratonDiv />
        </div>

        <Tabel operation="div" max={max} grade={2} title={`Împărțire 1 — ${max}`} />
      </div>
    </div>
  );
}
