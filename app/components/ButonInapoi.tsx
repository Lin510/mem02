"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

export default function ButonInapoi({ href = "/" }: { href?: string }) {
  const router = useRouter();
  const pathname = usePathname();

  // Hide on the home path (no meaningful back target)
  if (!href || pathname === href) return null;

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(href);
    }
  };

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-md border border-[#222] bg-white px-2.5 py-1.5 font-bold text-black hover:bg-[#f7f7f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
    >
      ← Înapoi
    </button>
  );
}
