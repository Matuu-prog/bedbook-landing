"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Apartment {
    id: string;
    name: string;
    image_url: string;
}

export default function ApartmentsCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [apartments, setApartments] = useState<Apartment[]>([]);

    useEffect(() => {
        async function fetchApartments() {
            const { data } = await supabase
                .from('apartments')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (data) {
                setApartments(data);
            }
        }
        fetchApartments();
    }, []);

    useEffect(() => {
        if (apartments.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % apartments.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [apartments.length]);

    return (
        <section className="pt-6 pb-12 w-full bg-gray-50 overflow-hidden">
            <div className="w-full px-6 md:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

                {/* Lado Izquierdo: Fotos (Queda debajo del texto de SaltaExperience) */}
                <div className="order-2 md:order-1 relative h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl">
                    <AnimatePresence mode="wait">
                        {apartments.length > 0 && (
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="absolute inset-0"
                            >
                                <img
                                    src={apartments[currentIndex].image_url}
                                    alt={`Departamento ${apartments[currentIndex].name}`}
                                    className="w-full h-full object-cover"
                                />
                                {/* Overlay y Etiqueta de Nombre del Depto */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8 md:p-12">
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                        className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30"
                                    >
                                        <span className="text-white text-xl font-medium tracking-wider">
                                            {apartments[currentIndex].name} Suites
                                        </span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Lado Derecho: Titular (Queda debajo de las fotos de SaltaExperience) */}
                <div className="order-1 md:order-2 space-y-6 max-w-2xl pl-0 md:pl-8">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-800">
                        Mirá algunos de nuestros departamentos
                    </h2>
                    <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed">
                        Listos esperándote para tu descanso en Salta.
                    </p>

                    {/* Indicadores de progreso (Dot indicators) */}
                    <div className="flex gap-2 pt-8">
                        {apartments.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-2 rounded-full transition-all duration-500 ${idx === currentIndex ? "w-8 bg-accent" : "w-2 bg-slate-300 hover:bg-slate-400"
                                    }`}
                                aria-label={`Ir a foto ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
