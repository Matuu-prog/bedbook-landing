import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bedbook | Alquileres Temporarios Premium en Salta",
  description: "Descubrí los mejores departamentos para tu estadía en Salta. Gestión de alojamientos vacacionales premium con Bedbook. Confort, ubicación y calidad garantizada.",
  keywords: ["alquiler temporal Salta", "departamentos Salta", "Bedbook", "alojamiento vacacional", "turismo Salta", "gestión de propiedades"],
  authors: [{ name: "Bedbook" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  alternates: {
    canonical: "https://bedbook.com.ar", // Reemplazar con el dominio real si es diferente
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://bedbook.com.ar",
    title: "Bedbook | Alquileres Temporarios Premium en Salta",
    description: "Gestión premium de alojamientos vacacionales en Salta. Encontrá tu próximo hogar lejos de casa.",
    siteName: "Bedbook",
    images: [
      {
        url: "/images/bedbook-logo.jpg", // Usamos el logo que dejamos como fallback
        width: 1200,
        height: 630,
        alt: "Bedbook - Alquileres Temporarios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bedbook | Alquileres Temporarios Premium en Salta",
    description: "Gestión premium de alojamientos vacacionales en Salta.",
    images: ["/images/bedbook-logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
