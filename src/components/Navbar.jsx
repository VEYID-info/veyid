import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-lg shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Brand */}
        <Link
          to="/"
          className="group flex flex-col leading-none"
        >
<span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-4xl font-black tracking-[0.25em] text-transparent transition duration-300 group-hover:scale-105">
  VEYID
</span>
          <span className="mt-1 text-[10px] uppercase tracking-[0.45em] text-slate-400">
            Digital Trust Platform
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-7 lg:flex">

          <Link
            to="/"
            className="font-medium text-slate-200 transition hover:text-blue-400"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="font-medium text-slate-200 transition hover:text-blue-400"
          >
            About
          </Link>

          <Link
            to="/contact"
            className="font-medium text-slate-200 transition hover:text-blue-400"
          >
            Contact
          </Link>

          <Link
            to="/business"
            className="font-medium text-slate-200 transition hover:text-blue-400"
          >
            For Business
          </Link>

          <Link
            to="/api"
            className="font-medium text-slate-200 transition hover:text-blue-400"
          >
            API
          </Link>
          <Link
            to="/login"
            className="font-medium text-slate-200 transition hover:text-blue-400"
          >
            Login
          </Link>


        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-3xl text-white transition hover:bg-slate-800 lg:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-slate-800 bg-slate-900/95 backdrop-blur-lg lg:hidden">

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 text-white hover:bg-slate-800"
          >
            Home
          </Link>

          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 text-white hover:bg-slate-800"
          >
            About
          </Link>

          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 text-white hover:bg-slate-800"
          >
            Contact
          </Link>

          <Link
            to="/business"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 text-white hover:bg-slate-800"
          >
            For Business
          </Link>
          <Link
            to="/api"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 text-white hover:bg-slate-800"
          >
            API
          </Link>

          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 text-white hover:bg-slate-800"
          >
            Login
          </Link>



          <Link
            to="/privacy"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 text-white hover:bg-slate-800"
          >
            Privacy Policy
          </Link>

          <Link
            to="/terms"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 text-white hover:bg-slate-800"
          >
            Terms of Service
          </Link>

          <div className="border-t border-slate-800 px-6 py-5">
            <p className="text-sm text-slate-400">
              VEYID • Digital Trust Platform
            </p>
          </div>

        </div>
      )}
    </nav>
  );
}
