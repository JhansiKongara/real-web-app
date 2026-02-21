"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Heart, Home, User2 } from "lucide-react";
import { ThemeToggle } from "@/app/components/ui/ThemeToggle";

export default function Header() {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full h-12 md:h-[55px] z-[4000] flex justify-between items-center px-5 md:px-10 bg-[var(--card)] shadow-[0_4px_10px_rgba(0,0,0,0.15)] border-b-2"
        style={{
          borderImage:
            "linear-gradient(to right, var(--primary), var(--secondary), var(--accent)) 1",
          borderTop: 0,
          borderLeft: 0,
          borderRight: 0,
        }}
      >
        {/* LEFT SIDE */}
        <div className="flex items-center gap-10">
          <h2
            className="text-xl md:text-[1.8rem] font-extrabold uppercase tracking-wider cursor-pointer m-0 bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)] bg-clip-text text-transparent whitespace-nowrap"
            onClick={() => router.push("/")}
          >
            RealEstate
          </h2>

          <h3
            className="hidden md:flex items-center gap-2 text-base font-semibold text-[var(--foreground)] uppercase tracking-wider cursor-pointer transition-all duration-300 hover:text-[var(--primary)]"
            onClick={() => router.push("/")}
          >
            <Home size={18} className="text-[var(--primary)]" />
            Home
          </h3>
        </div>

        {/* RIGHT SIDE - Desktop Menu */}
        <div className="hidden md:flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 mr-8 no-underline text-[var(--foreground)] font-semibold text-[0.95rem] uppercase tracking-wider transition-all duration-300 hover:text-[var(--primary)] group"
          >
            <Heart
              size={18}
              className="text-[var(--primary)] group-hover:drop-shadow-[0_0_5px_var(--primary)]"
            />
            Wishlist
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 mr-8 no-underline text-[var(--foreground)] font-semibold text-[0.95rem] uppercase tracking-wider transition-all duration-300 hover:text-[var(--primary)] group"
          >
            <Bell
              size={18}
              className="text-[var(--primary)] group-hover:drop-shadow-[0_0_5px_var(--primary)]"
            />
            Notification
          </Link>

          <div className="mr-4">
            <ThemeToggle />
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 no-underline text-[var(--foreground)] font-semibold text-[0.95rem] uppercase tracking-wider transition-all duration-300 hover:text-[var(--primary)] group"
          >
            <User2
              size={18}
              className="text-[var(--primary)] group-hover:drop-shadow-[0_0_5px_var(--primary)]"
            />
            Login/Signup
          </Link>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <div
            className="text-3xl text-[var(--primary)] cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
          >
            ☰
          </div>
        </div>
      </header>

      {/* Mobile Slide Menu Overlay */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-black/80 backdrop-blur-sm z-[4001] transition-all duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      ></div>

      {/* Mobile Slide Menu Content */}
      <div
        className={`fixed top-0 right-0 w-4/5 max-w-[300px] h-screen bg-[var(--background)] border-l border-[var(--primary)]/30 p-6 z-[4002] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] shadow-[-10px_0_30px_rgba(0,0,0,0.5)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-[var(--primary)]/20">
          <h3 className="text-xl font-bold tracking-[0.1em] uppercase text-[var(--foreground)] m-0">
            Menu
          </h3>
          <button
            className="bg-transparent border-none text-[var(--primary)] text-3xl cursor-pointer transition-transform duration-300 hover:text-[var(--primary)] hover:rotate-90"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </div>

        <Link
          href="/"
          className="flex items-center gap-4 p-4 text-[var(--muted)] no-underline font-semibold uppercase rounded-xl transition-all duration-300 border border-transparent hover:bg-[var(--primary)]/5 hover:border-[var(--primary)]/30 hover:text-[var(--foreground)] group"
          onClick={() => setOpen(false)}
        >
          <Home
            size={20}
            className="text-[var(--primary)] group-hover:drop-shadow-[0_0_4px_var(--primary)]"
          />
          Home
        </Link>
        <Link
          href="/"
          className="flex items-center gap-4 p-4 text-[var(--muted)] no-underline font-semibold uppercase rounded-xl transition-all duration-300 border border-transparent hover:bg-[var(--primary)]/5 hover:border-[var(--primary)]/30 hover:text-[var(--foreground)] group"
          onClick={() => setOpen(false)}
        >
          <Heart
            size={20}
            className="text-[var(--primary)] group-hover:drop-shadow-[0_0_4px_var(--primary)]"
          />
          Wishlist
        </Link>
        <Link
          href="/"
          className="flex items-center gap-4 p-4 text-[var(--muted)] no-underline font-semibold uppercase rounded-xl transition-all duration-300 border border-transparent hover:bg-[var(--primary)]/5 hover:border-[var(--primary)]/30 hover:text-[var(--foreground)] group"
          onClick={() => setOpen(false)}
        >
          <Bell
            size={20}
            className="text-[var(--primary)] group-hover:drop-shadow-[0_0_4px_var(--primary)]"
          />
          Notification
        </Link>
        <div className="mt-4 p-4 border-t border-[var(--primary)]/20 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="text-[0.65rem] font-black text-[var(--muted)] uppercase tracking-[2px] mb-3">
            System Appearance
          </div>
          <ThemeToggle />
        </div>

        <Link
          href="/"
          className="mt-auto flex items-center justify-center gap-4 p-4 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white no-underline font-semibold uppercase rounded-xl transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(var(--primary),0.4)]"
          onClick={() => setOpen(false)}
        >
          <User2 size={20} />
          Login / Signup
        </Link>
      </div>
    </>
  );
}
