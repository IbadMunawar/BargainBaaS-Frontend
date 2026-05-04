import Link from 'next/link';
import { Menu, X, Zap } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const navLinks = [
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(9, 9, 26, 0.85)'
          : 'rgba(9, 9, 26, 0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled
          ? '1px solid rgba(99, 102, 241, 0.2)'
          : '1px solid rgba(255,255,255,0.04)',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* ── Logo ─────────────────────────────────────────── */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
              >
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Bargain
                <span
                  className="font-extrabold"
                  style={{
                    background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  BaaS
                </span>
              </span>
            </Link>
          </div>

          {/* ── Desktop Links ─────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
              >
                {link.name}
              </Link>
            ))}

            <div className="w-px h-5 bg-white/10 mx-3" />

            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="ml-1 px-5 py-2 text-sm font-bold rounded-xl text-white transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                boxShadow: '0 0 18px rgba(99,102,241,0.4)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  '0 0 30px rgba(99,102,241,0.65)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  '0 0 18px rgba(99,102,241,0.4)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              Get API Key →
            </Link>
          </div>

          {/* ── Mobile Menu Button ────────────────────────────── */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu Panel ──────────────────────────────────── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ borderTop: isOpen ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
      >
        <div className="px-4 py-4 space-y-1" style={{ background: 'rgba(9,9,26,0.95)' }}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
              onClick={toggleMenu}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/auth/login"
            className="block px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
            onClick={toggleMenu}
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="block w-full text-center px-4 py-3 mt-2 text-sm font-bold rounded-xl text-white"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
            onClick={toggleMenu}
          >
            Get API Key →
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
