"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function Hero() {
    const [images, setImages] = useState<string[]>(["/images/hero-1.webp", "/images/hero-2.webp"]); // Valores por defecto rápidos
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isRestModeOn, setIsRestModeOn] = useState(false);

    useEffect(() => {
        async function fetchHeroImages() {
            const { data } = await supabase
                .from('site_images')
                .select('url')
                .in('id', ['hero-1', 'hero-2']);

            if (data && data.length > 0) {
                setImages(data.map(img => img.url));
            }
        }
        fetchHeroImages();

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        // Auto encendido del modo descanso a los 2 segundos
        const timeout = setTimeout(() => {
            setIsRestModeOn(true);
        }, 2000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [images.length]);

    return (
        <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden bg-primary">
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex]}
                    alt="Luxury Property by Bedbook"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </AnimatePresence>

            <div className="absolute inset-0 bg-black/30" /> {/* Overlay for better text readability */}

            <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center text-white max-w-5xl mx-auto space-y-6">
                <motion.h1
                    className="text-5xl md:text-7xl font-bold tracking-tight"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Bienvenido a <span className="text-accent">Bedbook</span>
                </motion.h1>
                <motion.p
                    className="text-lg md:text-2xl font-light"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Gestión premium de propiedades vacacionales.
                </motion.p>

                {/* Toggle Modo Descanso (No Interactivo) */}
                <motion.div
                    className="mt-8 flex items-center justify-center space-x-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-full border border-white/20 shadow-lg pointer-events-none"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <span className={`text-sm md:text-base font-medium transition-colors duration-500 ${!isRestModeOn ? "text-white" : "text-white/60"}`}>
                        Trabajo
                    </span>
                    <div
                        className="w-16 h-8 rounded-full bg-black/40 relative flex items-center px-1 overflow-hidden border border-white/30"
                        aria-label="Estado Modo Descanso"
                    >
                        {/* Background changes when ON */}
                        <motion.div
                            className="absolute inset-0 bg-accent"
                            initial={false}
                            animate={{ opacity: isRestModeOn ? 1 : 0 }}
                            transition={{ duration: 0.5 }}
                        />

                        <motion.div
                            className="w-6 h-6 bg-white rounded-full z-10 shadow-md"
                            layout
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                            initial={false}
                            animate={{
                                x: isRestModeOn ? 32 : 0,
                            }}
                        />
                    </div>
                    <span className={`text-sm md:text-base font-medium transition-colors duration-500 ${isRestModeOn ? "text-accent" : "text-white/60"}`}>
                        Modo Descanso ON
                    </span>
                </motion.div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent z-10" />
        </section>
    );
}
