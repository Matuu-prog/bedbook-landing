"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// Soluciona el problema de los íconos de Leaflet en Next.js
const createCustomIcon = () => {
    return L.divIcon({
        className: "custom-leaflet-icon",
        html: `<div style="background-color: #365361; width: 24px; height: 24px; border-radius: 50%; border: 3px solid #A38A5E; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
    });
};

const properties = [
    { id: 1, name: "Villa Esmeralda", lat: -34.6037, lng: -58.3816, city: "Buenos Aires" },
    { id: 2, name: "Cabaña Los Pinos", lat: -41.1335, lng: -71.3103, city: "Bariloche" },
    { id: 3, name: "Chalet del Mar", lat: -38.0055, lng: -57.5426, city: "Mar del Plata" },
];

export default function PropertyMap() {
    const [isMounted, setIsMounted] = useState(false);
    const [customIcon, setCustomIcon] = useState<L.DivIcon | null>(null);

    useEffect(() => {
        setIsMounted(true);
        setCustomIcon(createCustomIcon());
    }, []);

    if (!isMounted || !customIcon) return null;

    return (
        <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            <MapContainer
                center={[-38.4161, -63.6167]} // Centro aproximado de Argentina
                zoom={4}
                scrollWheelZoom={false}
                className="w-full h-full"
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
                        <Popup className="font-sans">
                            <div className="p-1">
                                <h3 className="font-bold text-primary text-base m-0">{prop.name}</h3>
                                <p className="text-gray-600 text-sm m-0 mt-1">{prop.city}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
