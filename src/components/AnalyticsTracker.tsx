"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function AnalyticsTracker() {
    const isTracked = useRef(false);

    useEffect(() => {
        if (isTracked.current) return;
        isTracked.current = true;

        const trackVisit = async () => {
            try {
                // 1. Obtener IP y Locación (Usando ip-api.com o similar)
                // Nota: en producción a veces los adblockers bloquean esto. 
                // Usamos free ipapi.co para demostración
                let country = "Desconocido";
                let city = "Desconocido";
                let ipAddress = "0.0.0.0";

                try {
                    const geoResponse = await fetch('https://ipapi.co/json/');
                    if (geoResponse.ok) {
                        const geoData = await geoResponse.json();
                        country = geoData.country_name || "Desconocido";
                        city = geoData.city || "Desconocido";
                        ipAddress = geoData.ip || "0.0.0.0";
                    }
                } catch (e) {
                    console.warn("Fallo geolocalización, asumiendo visita local.");
                }

                // 2. Extraer User Agent
                const userAgent = window.navigator.userAgent;

                // 3. Insertar en Supabase
                await supabase.from("page_views").insert([
                    {
                        ip_address: ipAddress,
                        country: country,
                        city: city,
                        user_agent: userAgent
                    }
                ]);

            } catch (error) {
                console.error("Error tracking view:", error);
            }
        };

        trackVisit();
    }, []);

    return null; // Componente invisible
}
