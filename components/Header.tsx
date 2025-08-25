"use client";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle"; // ✅ add this

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        padding: "12px 16px",
        borderBottom: "1px solid #ddd",
        background: "#f7f7f7",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <strong>Student No: 21459777 | Name: Kamalpreet Kaur</strong>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ThemeToggle /> {/* ✅ show the toggle next to the menu button */}
        <button
  onClick={() => setOpen(!open)}
  aria-expanded={open}
  aria-label="Toggle menu"
  style={{
    border: "1px solid var(--fg)",
    padding: "6px 10px",
    background: "transparent",
    cursor: "pointer",
    fontSize: 18,
    transition: "transform 200ms ease",
    transform: open ? "rotate(90deg) scale(1.05)" : "rotate(0deg) scale(1.0)"
  }}
>
  ☰
</button>

        </div>
      </div>

      {open && (
        <nav style={{ marginTop: 10, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/">Home</Link>
<Link href="/about">About</Link>
<Link href="/escape-room">Escape Room</Link>
<Link href="/coding-races">Coding Races</Link>
<Link href="/court-room">Court Room</Link>

        </nav>
      )}
    </header>
  );
}
