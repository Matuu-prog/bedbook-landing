export default function Footer() {
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

                {/* Columna 2: Enlaces Rápidos */}
                <div className="md:w-1/4 space-y-2">
                    <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Secciones</h4>
                    <ul className="space-y-1 text-xs font-light">
                        <li><a href="#" className="hover:text-accent transition-colors">Nuestras Propiedades</a></li>
                        <li><a href="#" className="hover:text-accent transition-colors">Experiencia Salta</a></li>
                        <li><a href="#" className="hover:text-accent transition-colors">Reseñas y Confianza</a></li>
                    </ul>
                </div>

                {/* Columna 3: Contacto */}
                <div className="md:w-1/4 space-y-2">
                    <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Contacto</h4>
                    <ul className="space-y-1 text-xs font-light">
                        <li className="flex items-center gap-2"><span>📞</span> +54 9 387 123 4567</li>
                        <li className="flex items-center gap-2"><span>✉️</span> reservas@bedbook.com.ar</li>
                    </ul>
                </div>

            </div>

            {/* Copyright Bottom Bar */}
            <div className="max-w-6xl mx-auto border-t border-white/10 pt-4 flex flex-col md:flex-row justify-between items-center text-[10px] font-light text-slate-500">
                <p>© {new Date().getFullYear()} Bedbook Salta.</p>
                <div className="flex gap-4 mt-2 md:mt-0">
                    <a href="#" className="hover:text-white transition-colors">Términos</a>
                    <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                </div>
            </div>
        </footer>
    );
}
