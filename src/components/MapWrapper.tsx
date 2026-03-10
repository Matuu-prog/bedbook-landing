"use client";

import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] bg-gray-100 animate-pulse flex items-center justify-center text-primary rounded-2xl">
            Cargando mapa...
        </div>
    ),
});

export default function MapWrapper() {
    return <PropertyMap />;
}
