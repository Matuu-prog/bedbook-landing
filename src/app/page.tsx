import Hero from "@/components/Hero";
import MapWrapper from "@/components/MapWrapper";
import LeadForm from "@/components/LeadForm";
import SaltaExperience from "@/components/SaltaExperience";
import ApartmentsCarousel from "@/components/ApartmentsCarousel";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      <Hero />

      {/* Salta Experience Section with Modal */}
      <SaltaExperience />

      {/* Carrusel de Departamentos Premium */}
      <ApartmentsCarousel />

      {/* Property Map Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full relative z-20 bg-background">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Nuestras Propiedades</h2>
          <p className="text-lg text-gray-300 font-light tracking-wide italic">Descubrí ubicaciones premium para tu próxima estadía.</p>
        </div>
        <MapWrapper />
      </section>

      {/* Trust Section: Reviews & Stats Animated */}
      <TrustSection />

      {/* Formulario de Contacto / Lead Form */}
      <LeadForm />

      {/* Footer Final */}
      <Footer />
    </main>
  );
}

