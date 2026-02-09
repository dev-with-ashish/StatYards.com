"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="text-xl font-black italic tracking-tighter text-gray-900">
                        STAT<span className="text-blue-600">YARDS</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <NavLink href="/" label="Home" />
                        <NavLink href="/nfl/match-player-stats" label="NFL Stats" />
                        <NavLink href="/nfl/teams" label="Teams" />
                    </div>

                    {/* Mobile Menu Button (Placeholder) */}
                    <div className="md:hidden">
                        <span className="text-gray-500 text-sm">Menu</span>
                    </div>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, label }) {
    // We could use usePathname for active state if needed
    return (
        <Link
            href={href}
            className="text-sm font-bold uppercase tracking-wider text-gray-600 hover:text-blue-600 transition-colors"
        >
            {label}
        </Link>
    );
}
