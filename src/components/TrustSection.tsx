"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

// Interfaces para los datos requeridos
interface SiteSettings {
    properties_count: number;
    happy_guests: number;
    return_rate: number;
}

interface Review {
    id: string;
    name: string;
    body: string;
    rating: number;
}

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

export default function TrustSection() {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        async function fetchData() {
            // Fetch Reviews
            const { data: reviewsData } = await supabase
                .from('reviews')
                .select('*')
                .eq('is_approved', true)
                .order('created_at', { ascending: false });

            // Fetch Settings
            const { data: settingsData } = await supabase
                .from('site_settings')
                .select('*')
                .single();

            if (reviewsData && reviewsData.length > 0) {
                // Multiplicamos para crear el loop infinito
                setReviews([...reviewsData, ...reviewsData, ...reviewsData, ...reviewsData]);
            }

            if (settingsData) {
                setSettings(settingsData);
            }
        }
        fetchData();
    }, []);

    // Centrar automáticamente en el medio del loop al cargar
    useEffect(() => {
        if (reviews.length > 0 && carouselRef.current) {
            const startIndex = Math.floor(reviews.length / 2);
            const container = carouselRef.current;
            const targetElement = container.children[startIndex] as HTMLElement;

            if (targetElement) {
                setTimeout(() => {
                    const scrollPos = targetElement.offsetLeft - (container.clientWidth / 2) + (targetElement.clientWidth / 2);
                    container.style.scrollBehavior = 'auto'; // Instant jump
                    container.scrollLeft = scrollPos;

                    // Restore smooth scroll for manual navigation
                    setTimeout(() => {
                        container.style.scrollBehavior = 'smooth';
                    }, 50);
                }, 100);
            }
        }
    }, [reviews]);

    // Auto-scroll continuo e infinito
    useEffect(() => {
        if (reviews.length === 0 || isHovered) return;

        let animationFrameId: number;
        const container = carouselRef.current;
        if (!container) return;

        const scrollContinuous = () => {
            // Avanzar 1 píxel por frame
            container.scrollLeft += 1;

            // Resetear instantáneamente en bucle
            // El scrollWidth / 2 funciona porque cuadruplicamos el array
            if (container.scrollLeft >= container.scrollWidth / 2) {
                container.scrollLeft = 0;
            }

            animationFrameId = requestAnimationFrame(scrollContinuous);
        };

        animationFrameId = requestAnimationFrame(scrollContinuous);

        return () => cancelAnimationFrame(animationFrameId);
    }, [reviews, isHovered]);

    const scroll = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const container = carouselRef.current;
            const scrollAmount = direction === 'left' ? -374 : 374; // 350px width + 24px gap = 374
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });

            // Ilusión óptica de scroll infinito bidireccional
            setTimeout(() => {
                if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 100) {
                    container.style.scrollBehavior = 'auto'; // Instant jump
                    container.scrollLeft = container.clientWidth;
                    setTimeout(() => container.style.scrollBehavior = 'smooth', 50);
                } else if (container.scrollLeft <= 100) {
                    container.style.scrollBehavior = 'auto';
                    container.scrollLeft = container.scrollWidth / 2;
                    setTimeout(() => container.style.scrollBehavior = 'smooth', 50);
                }
            }, 600); // Da tiempo a la animación natural a terminar
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
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onTouchStart={() => setIsHovered(true)}
                    onTouchEnd={() => setIsHovered(false)}
                    // padding matemático exacto: 50vw - la mitad del ancho de la tarjeta asegura que centren perfectas al extremo
                    className="flex gap-6 overflow-x-auto px-[7.5vw] md:px-[calc(50vw-175px)] pb-12 pt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] items-stretch cursor-grab active:cursor-grabbing"
                >
                    {reviews.map((review, idx) => (
                        <div key={`${review.id}-${idx}`} className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden w-[85vw] md:w-[350px] flex-shrink-0">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col">
                                <span className="font-bold text-slate-800 text-lg">{review.name}</span>
                                <div className="flex text-accent text-lg mt-1 tracking-widest">
                                    {Array.from({ length: review.rating }).map((_, i) => "★").join("")}
                                    {Array.from({ length: 5 - review.rating }).map((_, i) => "☆").join("")}
                                </div>
                            </div>
                            <div className="p-6 flex-grow">
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    "{review.body}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Parte 2: Contadores (Estadísticas Originales) */}
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center items-end border-t border-white/10 pt-16 mt-8">
                    <AnimatedCounter endValue={settings?.properties_count || 50} label={`${settings?.properties_count || 50}+ Propiedades Gestionadas`} />
                    <AnimatedCounter endValue={settings?.happy_guests || 10000} label={`${settings?.happy_guests || 10000}+ Huéspedes Felices`} />
                    <AnimatedCounter endValue={settings?.return_rate || 98} label="% De los huespedes nos reeligen" />
                </div>
            </div>
        </section>
    );
}
