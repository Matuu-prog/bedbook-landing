import Hero from "@/components/Hero";
import MapWrapper from "@/components/MapWrapper";
import LeadForm from "@/components/LeadForm";
import SaltaExperience from "@/components/SaltaExperience";
import VirtualTour360 from "@/components/VirtualTour360";
import ApartmentsCarousel from "@/components/ApartmentsCarousel";
import Navbar from "@/components/Navbar";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      {/* Rastreador Invisible de Analíticas Reales */}
      <AnalyticsTracker />

      {/* Navegación Superior */}
      <Navbar />

      <Hero />

      {/* Salta Experience Section with Modal 
      <SaltaExperience /> */}

      {/* Recorrido Virtual 360 */}
      <VirtualTour360 />

      {/* Carrusel de Departamentos Premium */}
      <div id="alojamientos">
        <ApartmentsCarousel />
      </div>

      {/* Property Map Section */}
      <section id="ubicaciones" className="py-24 px-6 max-w-7xl mx-auto w-full relative z-20 bg-background">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Nuestras Propiedades</h2>
          <p className="text-lg text-gray-300 font-light tracking-wide italic">Descubrí ubicaciones premium para tu próxima estadía.</p>
        </div>
        <MapWrapper />
      </section>

      {/* Trust Section: Reviews & Stats Animated */}
      <div id="huespedes">
        <TrustSection />
      </div>

      {/* Formulario de Contacto / Lead Form */}
      <div id="contacto">
        <LeadForm />
      </div>

      {/* Footer Final */}
      <Footer />
    </main>
  );
}

