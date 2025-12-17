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
      style={{
        display: "inline-block",
        padding: "6px 10px",
        borderRadius: 6,
        border: "1px solid #222",
        background: "#fff",
        color: "#000",
        textDecoration: "none",
        fontWeight: 700,
        marginRight: 12,
        cursor: "pointer",
      }}
    >
      ← Înapoi
    </button>
  );
}
