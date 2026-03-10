"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";

// Componente individual para el contador animado
const AnimatedCounter = ({ endValue, label, subtitle = "" }: { endValue: number, label: string, subtitle?: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView) {
            let startTime: number;
            const duration = 2000; // 2 segundos totales de animación

            const animate = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);

                // Función de easing easeOutQuart
                const easeProgress = 1 - Math.pow(1 - progress, 4);

                setCount(Math.floor(easeProgress * endValue));

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        }
    }, [isInView, endValue]);

    return (
        <div className="space-y-1" ref={ref}>
            <motion.p
                className="text-4xl md:text-5xl font-black text-white tracking-tighter"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
            >
                {label.includes('50.000') ? "50.000" : label.includes('35%') ? "35%" : count}
            </motion.p>
            <motion.p
                className="text-sm md:text-base font-bold text-white uppercase tracking-wider"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                {label.replace(/[0-9.]+%?/, '').trim()}
            </motion.p>
            {subtitle && (
                <motion.p
                    className="text-xs md:text-sm font-light text-gray-300"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );
};

const REVIEWS = [
    {
        name: "Katherine",
        text: "Exceptional! Excellent value for money. Nice location, short walk to the centre. Pool and outdoor area great with well equipped gym with free weights. Apartment very modern clean and tidy."
    },
    {
        name: "Federico",
        text: "Excelentes deptos en salta! Los departamentos estan impecables todos nuevos. Muy limpios y bien equipados. El desayuno excelente muy completo y variado."
    },
    {
        name: "Albert",
        text: "New apartments with all utilities. Air conditioned, small kitchen (but fully functional), comfortable bed and spacious terrace. The building also has gym and pool. Very worth the money."
    },
    {
        name: "Juan",
        text: "New apartments with all utilities. Air conditioned, small kitchen (but fully functional), comfortable bed and spacious terrace. The building also has gym and pool. Very worth the money."
    },
    {
        name: "Thomas",
        text: "New apartments with all utilities. Air conditioned, small kitchen (but fully functional), comfortable bed and spacious terrace. The building also has gym and pool. Very worth the money."
    }
];

// Multiplicamos x4 para crear el efecto de loop infinito sin fin
const INF_REVIEWS = [...REVIEWS, ...REVIEWS, ...REVIEWS, ...REVIEWS];

export default function TrustSection() {
    const carouselRef = useRef<HTMLDivElement>(null);

    // Centrar automáticamente en el medio del loop al cargar
    useEffect(() => {
        if (carouselRef.current) {
            const startIndex = Math.floor(INF_REVIEWS.length / 2);
            const container = carouselRef.current;
            const targetElement = container.children[startIndex] as HTMLElement;

            if (targetElement) {
                const scrollPos = targetElement.offsetLeft - (container.clientWidth / 2) + (targetElement.clientWidth / 2);
                container.style.scrollBehavior = 'auto'; // Instant jump
                container.scrollLeft = scrollPos;

                // Restore smooth scroll for manual navigation
                setTimeout(() => {
                    container.style.scrollBehavior = 'smooth';
                }, 50);
            }
        }
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const scrollAmount = direction === 'left' ? -374 : 374; // 350px width + 24px gap = 374
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="bg-primary w-full py-12 relative z-10 overflow-hidden">

            {/* Títulos */}
            <div className="max-w-4xl mx-auto px-6 text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">¿Que opinan nuestros huéspedes de nosotros?</h2>
                <p className="text-lg text-gray-300 font-light tracking-wide italic">Miralo vos mismo</p>
            </div>

            {/* Parte 1: Reseñas / Opiniones (Full-width bleed) */}
            <div className="relative w-full group mb-16">

                {/* Flecha Izquierda */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 text-primary w-12 h-12 rounded-full flex items-center justify-center shadow-2xl opacity-0 xl:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-110 hidden md:flex"
                    aria-label="Anterior reseña"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                {/* Flecha Derecha */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 text-primary w-12 h-12 rounded-full flex items-center justify-center shadow-2xl opacity-0 xl:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-110 hidden md:flex"
                    aria-label="Siguiente reseña"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>

                <div
                    ref={carouselRef}
                    // padding matemático exacto: 50vw - la mitad del ancho de la tarjeta asegura que centren perfectas al extremo
                    className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-[7.5vw] md:px-[calc(50vw-175px)] pb-12 pt-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] items-stretch"
                >
                    {INF_REVIEWS.map((review, idx) => (
                        <div key={idx} className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden w-[85vw] md:w-[350px] flex-shrink-0 snap-center">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col">
                                <span className="font-bold text-slate-800 text-lg">{review.name}</span>
                                <div className="flex text-accent text-lg mt-1 tracking-widest">★★★★★</div>
                            </div>
                            <div className="p-6 flex-grow">
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    "{review.text}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Parte 2: Contadores (Estadísticas Originales) */}
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center items-end border-t border-white/10 pt-16">
                    <AnimatedCounter endValue={50} label="50+ Propiedades Gestionadas" />
                    <AnimatedCounter endValue={10000} label="10000+ Huéspedes Felices" />
                    <AnimatedCounter endValue={98} label="% De los huespedes nos reeligen" />
                </div>
            </div>
        </section>
    );
}
