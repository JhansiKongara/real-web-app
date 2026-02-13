"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./styles/header.scss";
import { Bell, Heart, Home } from "lucide-react";


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
          <Home size={18} className="nav-icon" />
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
          Login/Signup
        </Link>
      </div>

      {/* Hamburger */}
      <div className="hamburger" onClick={() => setOpen(!open)}>
        ☰
      </div>

      {open && (
        <div className="mobile-menu">
          <Link href="/" className="nav-link">
            <Home className="home-icon" />
          Home</Link>
          <Link href="/" className="nav-link">
              <Heart style={{ marginRight: "5px" }} />
          Wishlist</Link>
          <Link href="/" className="nav-link">
          <Bell style={{ marginRight: "5px" }} />
          Notification</Link>
          <Link href="/" className="nav-link">Login/Signup</Link>
        </div>
      )}
    </header>
  );
}
