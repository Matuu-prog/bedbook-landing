"use client";

import { Instagram, Phone, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Footer() {
    const trackClick = async (buttonId: string) => {
        try {
            await supabase.rpc('increment_click', { button_id: buttonId });
        } catch (error) {
            console.error("Error tracking click:", error);
        }
    };
    return (
        <footer className="bg-slate-900 border-t border-white/10 py-6 px-4 w-full text-slate-300">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8 mb-6">

                {/* Columna 1: Logo y Bio */}
                <div className="md:w-1/3 space-y-3">
                    <div className="w-24 overflow-hidden">
                        <img
                            src="/images/bedbook-logo.jpg"
                            alt="Bedbook Logo"
                            className="w-full h-auto object-contain [filter:invert(1)_brightness(100)] [mix-blend-mode:screen]"
                        />
                    </div>
                    <p className="text-xs font-light leading-relaxed">
                        Expertos en gestión de propiedades vacacionales premium en Salta capital.
                    </p>
                </div>

                <div className="md:w-1/3 space-y-4">
                    <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-2">Contacto</h4>
                    <div className="flex flex-col gap-3">
                        <a
                            href="https://wa.me/5493872542200"
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => trackClick("footer_phone")}
                            className="flex items-center gap-3 text-sm font-light hover:text-white transition-colors bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10"
                        >
                            <Phone className="w-5 h-5 text-accent" />
                            +54 9 387 254 2200
                        </a>

                        <a
                            href="mailto:bedbook.reservas@gmail.com"
                            onClick={() => trackClick("footer_email")}
                            className="flex items-center gap-3 text-sm font-light hover:text-white transition-colors bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10"
                        >
                            <Mail className="w-5 h-5 text-accent" />
                            bedbook.reservas@gmail.com
                        </a>
                    </div>
                </div>

                {/* Columna 3: Redes Sociales */}
                <div className="md:w-1/4 space-y-4">
                    <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-2">Seguinos</h4>
                    <div className="flex gap-4">
                        <a
                            href="https://www.instagram.com/bedbook.alquilerestemporarios/"
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => trackClick("footer_instagram")}
                            className="bg-white/5 p-3 rounded-full border border-white/10 text-white hover:bg-accent hover:text-white hover:border-accent transition-all shadow-lg"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                    </div>
                </div>

            </div>

            {/* Copyright Bottom Bar */}
            <div className="max-w-6xl mx-auto border-t border-white/10 pt-4 flex flex-col md:flex-row justify-between items-center text-[10px] font-light text-slate-500">
                <div className="flex items-center gap-2">
                    <p>© {new Date().getFullYear()} Bedbook Salta.</p>
                    {/* Botón Oculto de Acceso Admin */}
                    <a href="/admin/login" className="opacity-10 hover:opacity-100 transition-opacity" title="Panel de Control">
                        🔒
                    </a>
                </div>
                <div className="flex gap-4 mt-2 md:mt-0">
                    <a href="#" className="hover:text-white transition-colors">Términos</a>
                    <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                </div>
            </div>
        </footer>
    );
}
