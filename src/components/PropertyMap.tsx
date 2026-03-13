"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ApartmentMarker {
    id: string;
    name: string;
    description: string | null;
    image_url: string;
    lat: number;
    lng: number;
}

// Soluciona el problema de los íconos de Leaflet en Next.js
const createCustomIcon = () => {
    return L.icon({
        iconUrl: '/images/bedbook-logo.jpg',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -25],
        className: 'rounded-full border-2 border-primary shadow-lg object-cover bg-white pointer-events-auto',
    });
};

export default function PropertyMap() {
    const [isMounted, setIsMounted] = useState(false);
    const [customIcon, setCustomIcon] = useState<L.DivIcon | null>(null);
    const [properties, setProperties] = useState<ApartmentMarker[]>([]);

    useEffect(() => {
        setIsMounted(true);
        setCustomIcon(createCustomIcon());

        async function fetchLocations() {
            const { data } = await supabase
                .from('apartments')
                .select('id, name, description, image_url, lat, lng')
                .eq('is_active', true)
                .not('lat', 'is', null)
                .not('lng', 'is', null);

            if (data && data.length > 0) {
                setProperties(data as ApartmentMarker[]);
            }
        }
        fetchLocations();
    }, []);

    if (!isMounted || !customIcon) return null;

    return (
        <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            <MapContainer
                center={[-24.7859, -65.4116]} // Centro aproximado de Ciudad de Salta
                zoom={14}
                scrollWheelZoom={false}
                className="w-full h-full z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                {properties.map((prop) => (
                    <Marker
                        key={prop.id}
                        position={[prop.lat, prop.lng]}
                        icon={customIcon}
                    >
                        <Popup className="font-sans custom-leaflet-popup">
                            <div className="flex flex-col w-48 -m-[13px] overflow-hidden rounded-xl bg-white shadow-xl">
                                {prop.image_url && (
                                    <div className="h-28 w-full relative">
                                        <img src={prop.image_url} alt={prop.name} className="absolute inset-0 w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="p-3">
                                    <h3 className="font-bold text-slate-800 text-[15px] m-0 leading-tight">{prop.name}</h3>
                                    {prop.description && <p className="text-gray-500 text-xs m-0 mt-1.5 leading-snug line-clamp-3">{prop.description}</p>}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
