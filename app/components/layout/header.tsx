"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/app/styles/header.scss";
import { Bell, Heart, Home, User, User2 } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  return (
    <header className="header">
      {/* LEFT SIDE */}
      <div className="header-left">
        <h2
          className="logo"
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          RealEstate
        </h2>

        <h3
          className="home-heading"
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          <Home size={18} className="nav-icon" style={{ marginRight: "5px" }} />
          Home
        </h3>
      </div>

      {/* RIGHT SIDE */}
      <div className="menu">
        <Link href="/" className="nav-link">
          <Heart style={{ marginRight: "5px" }} />
          Wishlist
        </Link>

        <Link href="/" className="nav-link">
          <Bell style={{ marginRight: "5px" }} />
          Notification
        </Link>

        <Link href="/" className="nav-link">
          <User2 style={{ marginRight: "5px" }} />
          Login/Signup
        </Link>
      </div>

      {/* Hamburger */}
      <div className="hamburger" onClick={() => setOpen(true)}>
        ☰
      </div>

      {/* Mobile Slide Menu */}
      <div
        className={`mobile-menu-overlay ${open ? "active" : ""}`}
        onClick={() => setOpen(false)}
      ></div>

      <div className={`mobile-menu ${open ? "active" : ""}`}>
        <div className="menu-header">
          <h3>Menu</h3>
          <button className="close-menu" onClick={() => setOpen(false)}>
            ×
          </button>
        </div>

        <Link href="/" className="nav-link" onClick={() => setOpen(false)}>
          <Home size={18} />
          Home
        </Link>
        <Link href="/" className="nav-link" onClick={() => setOpen(false)}>
          <Heart size={18} />
          Wishlist
        </Link>
        <Link href="/" className="nav-link" onClick={() => setOpen(false)}>
          <Bell size={18} />
          Notification
        </Link>
        <Link
          href="/"
          className="nav-link highlights"
          onClick={() => setOpen(false)}
        >
          <User2 />
          Login / Signup
        </Link>
      </div>
    </header>
  );
}
