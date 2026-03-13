"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface SiteImage {
    id: string;
    url: string;
    title: string | null;
    description: string | null;
}

export default function SaltaExperience() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mainImage, setMainImage] = useState("/images/salta-vertical.webp");
    const [lowerImage, setLowerImage] = useState("/images/paisaje-ancho.webp");
    const [sideImage, setSideImage] = useState("/images/detalle-deco.webp");
    const [imperdibles, setImperdibles] = useState<SiteImage[]>([]);

    useEffect(() => {
        async function fetchImages() {
            const { data } = await supabase
                .from('site_images')
                .select('*')
                .in('id', ['salta-vertical', 'salta-horizontal', 'salta-cuadrada', 'salta-imperdible-1', 'salta-imperdible-2', 'salta-imperdible-3']);

            if (data) {
                const vertical = data.find(img => img.id === 'salta-vertical');
                if (vertical) setMainImage(vertical.url);

                const horizontal = data.find(img => img.id === 'salta-horizontal');
                if (horizontal) setLowerImage(horizontal.url);

                const cuadrada = data.find(img => img.id === 'salta-cuadrada');
                if (cuadrada) setSideImage(cuadrada.url);

                const modalImgs = data
                    .filter(img => img.id.startsWith('salta-imperdible-'))
                    .sort((a, b) => a.id.localeCompare(b.id));

                if (modalImgs.length > 0) {
                    setImperdibles(modalImgs);
                }
            }
        }
        fetchImages();
    }, []);

    return (
        <>
            <section className="pt-12 pb-6 w-full bg-gray-50 overflow-hidden">
                <div className="w-full px-6 md:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="space-y-6 max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold text-primary">Auténtica Experiencia Norteña</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Bedbook no solo ofrece alojamiento de lujo, brindamos una conexión directa con la cultura,
                            los paisajes y la gastronomía de Salta. Cada detalle de tu estadía está diseñado para
                            transformar un simple viaje en una experiencia inolvidable.
                        </p>
                        <div className="pt-4">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-8 py-3 outline outline-2 outline-accent text-accent font-semibold rounded-full hover:bg-accent hover:text-white transition-colors"
                            >
                                Descubrir más
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 grid-rows-2 gap-4 md:gap-6 h-[400px] md:h-[500px] w-full">
                        {/* Imagen Grande (Vertical - Izquierda) */}
                        <div className="relative row-span-2 rounded-[2rem] overflow-hidden shadow-2xl group">
                            <img
                                src={mainImage}
                                alt="Salta Vertical"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        {/* Imagenes Pequeñas (Derecha) */}
                        <div className="relative rounded-[2rem] overflow-hidden shadow-xl group">
                            <img
                                src={lowerImage}
                                alt="Paisaje Ancho Norteño"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <div className="relative rounded-[2rem] overflow-hidden shadow-xl group">
                            <img
                                src={sideImage}
                                alt="Detalle Decorativo Salteño"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal Imperdibles */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            className="bg-white rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                            initial={{ scale: 0.95, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.95, y: 20, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()} // Evita cerrar si se hace clic adentro
                        >
                            {/* Header */}
                            <div className="relative flex justify-center items-center p-6 border-b border-gray-100">
                                <h3 className="text-2xl md:text-3xl font-bold text-primary text-center">3 Imperdibles del norte que tenes que visitar</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 md:p-8 overflow-y-auto w-full custom-scrollbar">
                                <p className="text-gray-600 mb-8 text-lg font-light text-center">Todos estos destinos son fácilmente accesibles coordinando desde nuestros alojamientos premium Bedbook.</p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {imperdibles.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            className="relative group rounded-[2rem] overflow-hidden shadow-lg h-[350px]"
                                            whileHover={{ y: -5 }}
                                        >
                                            <img
                                                src={item.url}
                                                alt={item.title || "Imperdible"}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            {/* Gradiente inmersivo inferior */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                                                <h4 className="font-bold text-2xl text-white mb-2">{item.title}</h4>
                                                <p className="text-gray-200 text-sm leading-relaxed drop-shadow-md">{item.description}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
