"use client";

import React from "react";
import ButonInapoi from "../components/ButonInapoi";
import Calculator from "../components/Calculator";
export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-[980px] px-4 py-8 sm:px-6 lg:px-7">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <ButonInapoi />
            <h1 className="m-0 text-[28px] font-black tracking-tight">Calculator</h1>
          </div>
          {/* local back button removed; use BackButton before title */}
        </div>

        <Calculator />

        <div className="mt-5 text-slate-600">
          <small>Folosește tastatura sau tastele de mai sus. `Enter` = egal, `C` = curăță, `Backspace` = șterge.</small>
        </div>
      </div>
    </div>
  );
}
