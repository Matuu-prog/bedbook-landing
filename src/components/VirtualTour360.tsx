"use client";

export default function VirtualTour360() {
    return (
        <section className="py-20 bg-white" id="recorrido-virtual">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-4">
                        Explorá los espacios con tecnología 3D y conoce el estilo, el nivel de
                        equipamiento y los detalles que caracterizan a nuestros alojamientos
                    </h2>
                </div>

                <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-gray-50 aspect-video lg:aspect-auto">
                    <iframe
                        className="w-full h-[300px] md:h-[400px] lg:h-[500px]"
                        src="https://my.matterport.com/show/?m=X3MJbLevhQt&play=1"
                        allowFullScreen
                        allow="xr-spatial-tracking"
                        title="Bedbook Matterport 360 Virtual Tour"
                    ></iframe>
                </div>
                <p className="text-lg leading-8 text-gray-600 mt-4" style={{ textAlign: "center" }} >
                    Este tour muestra una de nuestras unidades.
                    Cada departamento cuenta con su propia distribución y amoblamiento, manteniendo
                    siempre el mismo estándar de diseño, equipamiento y confort que caracteriza a
                    nuestros alojamientos.
                </p>
            </div>
        </section>
    );
}
