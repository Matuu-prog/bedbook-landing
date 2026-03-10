"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxlJTDW4DZBPjKYfkErm972pgXuMQ-P7PLZyY7xdrC3P1BvOmRiPzjZaMVq5DAxSaMthA/exec";

export default function LeadForm() {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        checkIn: "",
        checkOut: "",
        huespedes: "1",
    });

    const [cantidadNoches, setCantidadNoches] = useState(0);

    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const formStartedRef = useRef(false);

    // Utilizamos refs para tener los valores más actualizados en los timers/eventos sin cierres de ciclo viejos
    const formStateRef = useRef(formData);
    const abandonTimerRef = useRef<NodeJS.Timeout | null>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isSubmittedRef = useRef(false);

    // Obtener la fecha de hoy en formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    // Sincronizar currentStateRef con el state e implementar DEBOUNCE
    useEffect(() => {
        formStateRef.current = formData;

        // Limpiar timeout anterior
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        // Disparar solo si form fue iniciado, no fue enviado, y hay un email válido
        if (formStartedRef.current && !isSubmittedRef.current && isValidEmail(formData.email)) {
            typingTimeoutRef.current = setTimeout(() => {
                if (!isSubmittedRef.current) {
                    console.log("Evento Incompleto enviado por inactividad de 2 segundos.");
                    sendToWebhook({
                        ...formData,
                        estado: "Incompleto"
                    }, "proactive_capture_debounce");
                }
            }, 2000);
        }

    }, [formData]);

    // Funciones principales
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Trackear el inicio del formulario y reiniciar contadores
        if (!formStartedRef.current) {
            formStartedRef.current = true;
        }

        if (name === "email" || name === "telefono") {
            // Reiniciar el timer de 60s
            resetAbandonTimer();
        }
    };

    // Calcular la cantidad de noches cuando cambian las fechas
    useEffect(() => {
        if (formData.checkIn && formData.checkOut) {
            const dateIn = new Date(formData.checkIn);
            const dateOut = new Date(formData.checkOut);

            // Asegurarse de que el checkOut sea después del checkIn
            if (dateOut > dateIn) {
                const diffTime = Math.abs(dateOut.getTime() - dateIn.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                setCantidadNoches(diffDays);
            } else {
                setCantidadNoches(0);
            }
        } else {
            setCantidadNoches(0);
        }
    }, [formData.checkIn, formData.checkOut]);


    const sendToWebhook = async (data: Record<string, any>, eventType: string) => {
        try {
            const payload = {
                ...data, // nombre, apellido, email, telefono, checkIn, checkOut, huespedes, estado
                noches: cantidadNoches.toString(),
                evento: eventType,
                timestamp: new Date().toISOString()
            };

            await fetch(WEBHOOK_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });
            return true;
        } catch (err) {
            console.error("Error enviando datos:", err);
            return false;
        }
    };

    // Lógica de Abandono (Cierre de Pestaña con sendBeacon)
    const triggerAbandonment = () => {
        const state = formStateRef.current;
        const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        // Disparar "Incompleto" solo si tiene Email válido
        if (isValidEmail(state.email) && formStartedRef.current && !isSubmittedRef.current) {
            console.log("Evento de abandono disparado vía sendBeacon al cerrar pestaña.");

            const payloadToSubmit = {
                ...state,
                noches: cantidadNoches.toString(),
                evento: "form_abandoned",
                timestamp: new Date().toISOString(),
                estado: "Incompleto"
            };

            const blob = new Blob([JSON.stringify(payloadToSubmit)], { type: 'text/plain' });
            navigator.sendBeacon(WEBHOOK_URL, blob);

            formStartedRef.current = false;
        }
    };

    const resetAbandonTimer = () => {
        if (abandonTimerRef.current) clearTimeout(abandonTimerRef.current);

        abandonTimerRef.current = setTimeout(() => {
            triggerAbandonment();
        }, 60000);
    };

    // Escuchar cuando el usuario intente cerrar o recargar la pestaña
    useEffect(() => {
        const handleBeforeUnload = () => {
            triggerAbandonment();
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            if (abandonTimerRef.current) clearTimeout(abandonTimerRef.current);
        };
    }, []);

    // Envío final
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación básica
        if (cantidadNoches <= 0) {
            alert("Por favor, seleccioná fechas válidas. El Check-out debe ser posterior al Check-in.");
            return;
        }

        setStatus("submitting");
        isSubmittedRef.current = true; // Prevenir eventos de abandono y debounce futuros
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        if (abandonTimerRef.current) clearTimeout(abandonTimerRef.current);

        const payloadToSubmit = {
            ...formData,
            estado: "Completado"
        };

        const success = await sendToWebhook(payloadToSubmit, "form_submitted");

        if (success) {
            console.log("Evento Completado enviado correctamente.");
            setStatus("success");
            setFormData({ nombre: "", apellido: "", email: "", telefono: "", checkIn: "", checkOut: "", huespedes: "1" });
            setCantidadNoches(0);
        } else {
            setStatus("error");
            isSubmittedRef.current = false; // Permitir reintento
        }
    };

    // Mensaje de WhatsApp dinámico
    const getWhatsAppUrl = () => {
        const baseUrl = "https://wa.me/5493872542200";
        const message = `¡Hola! Soy ${formData.nombre || "un interesado"}. Vi la web de Bedbook y quiero reservar del ${formData.checkIn || "[Fecha de Entrada]"} al ${formData.checkOut || "[Fecha de Salida]"} para ${formData.huespedes} personas.`;
        return `${baseUrl}?text=${encodeURIComponent(message)}`;
    };

    return (
        <section className="bg-white py-24 px-6 relative w-full border-t border-gray-100 shadow-inner">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Texts */}
                <div className="space-y-6">
                    <h2 className="text-3xl md:text-5xl font-bold text-primary">¿Listos para desconectar?</h2>
                    <p className="text-gray-600 text-lg">
                        Completá el formulario para recibir información exclusiva sobre nuestras propiedades o contactanos directamente para empezar tu experiencia Bedbook.
                    </p>
                </div>

                {/* Formulario */}
                <motion.div
                    className="bg-gray-50 p-8 rounded-3xl shadow-sm border border-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    {status === "success" ? (
                        <div className="text-center py-12 space-y-4">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl mb-4">
                                ✓
                            </div>
                            <h3 className="text-2xl font-bold text-primary">¡Gracias por contactarnos!</h3>
                            <p className="text-gray-600">En breve nos comunicaremos con vos.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                    <input required type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-slate-900" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                                    <input required type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-slate-900" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-slate-900" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                    <input required type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-slate-900" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                                    <input required type="date" name="checkIn" min={today} value={formData.checkIn} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-slate-900" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                                    <input required type="date" name="checkOut" value={formData.checkOut} min={formData.checkIn || today} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-slate-900" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 items-center">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Huéspedes</label>
                                    <select name="huespedes" value={formData.huespedes} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all bg-white text-slate-900">
                                        {[1, 2, 3, 4, 5].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>

                                {cantidadNoches > 0 && (
                                    <div className="flex flex-col justify-end h-full py-3">
                                        <p className="text-sm font-medium text-accent">Total: <span className="font-bold">{cantidadNoches}</span> noche{cantidadNoches > 1 ? 's' : ''}</p>
                                    </div>
                                )}
                            </div>


                            {status === "error" && (
                                <p className="text-red-500 text-sm">Hubo un error al enviar el formulario. Por favor, intentá de nuevo.</p>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-2">
                                <motion.button
                                    type="submit"
                                    disabled={status === "submitting"}
                                    className="flex-1 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-70"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {status === "submitting" ? "Enviando..." : "Enviar consulta"}
                                </motion.button>

                                <motion.a
                                    href={getWhatsAppUrl()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20bd5a] transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        // Marcar como Completado apenas toca WhatsApp
                                        isSubmittedRef.current = true;
                                        if (abandonTimerRef.current) clearTimeout(abandonTimerRef.current);
                                        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

                                        // Enviar de fondo (silencioso)
                                        const payloadToSubmit = {
                                            ...formStateRef.current,
                                            estado: "Completado"
                                        };
                                        sendToWebhook(payloadToSubmit, "form_submitted_whatsapp");

                                        // Feedback en UI opcional
                                        setStatus("success");
                                    }}
                                >
                                    WhatsApp
                                </motion.a>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
