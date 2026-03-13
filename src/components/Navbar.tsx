"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string, buttonId?: string) => {
        setIsMobileMenuOpen(false); // Close menu on click
        const element = document.getElementById(id);
        if (element) {
            // Ajuste por el alto del navbar
            const y = element.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }

        if (buttonId) {
            trackClick(buttonId);
        }
    };

    const trackClick = async (buttonId: string) => {
        try {
            await supabase.rpc('increment_click', { button_id: buttonId });
        } catch (error) {
            console.error("Error tracking click:", error);
        }
    };

    const navLinks = [
        { name: "Alojamientos", id: "alojamientos" },
        { name: "Ubicaciones", id: "ubicaciones" },
        { name: "Huéspedes", id: "huespedes" },
    ];

    return (
        <nav
            className={`fixed top-0 w-full z-[100] transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                >
                    <div className="relative w-10 h-10 overflow-hidden rounded-full border border-gray-200/50 shadow-sm bg-white">
                        <Image
                            src="/images/bedbook-logo.jpg"
                            alt="Bedbook Logo"
                            fill
                            className="object-cover"
                        />
                    </div>

                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => scrollToSection(link.id)}
                            className={`text-sm font-medium transition-colors hover:text-accent ${isScrolled ? "text-slate-600" : "text-white/90 dip-shadow-sm hover:text-white"
                                }`}
                        >
                            {link.name}
                        </button>
                    ))}
                    <button
                        onClick={() => scrollToSection("contacto", "nav_reserva")}
                        className={`text-sm font-bold uppercase tracking-wider px-6 py-2.5 rounded-full transition-all ${isScrolled
                            ? "bg-accent text-white hover:bg-accent/90 shadow-md shadow-accent/20"
                            : "bg-white text-primary hover:bg-gray-100 shadow-lg"
                            }`}
                    >
                        Reserva Ahora
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? (
                        <X className={`w-6 h-6 ${isScrolled ? "text-primary" : "text-white"}`} />
                    ) : (
                        <Menu className={`w-6 h-6 ${isScrolled ? "text-primary" : "text-white"}`} />
                    )}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => scrollToSection(link.id)}
                            className="text-left py-2 text-slate-700 font-medium hover:text-accent"
                        >
                            {link.name}
                        </button>
                    ))}
                    <div className="pt-2 mt-2 border-t border-gray-100">
                        <button
                            onClick={() => scrollToSection("contacto", "nav_reserva")}
                            className="w-full bg-accent text-white font-bold uppercase tracking-wider px-6 py-3 rounded-full hover:bg-accent/90"
                        >
                            Reserva Ahora
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
