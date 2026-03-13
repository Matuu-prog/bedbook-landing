-- 1. Tabla: site_settings (Métricas de Confianza)
CREATE TABLE site_settings (
  id integer PRIMARY KEY DEFAULT 1,
  properties_count integer NOT NULL DEFAULT 50,
  happy_guests integer NOT NULL DEFAULT 10000,
  return_rate integer NOT NULL DEFAULT 98
);

-- 2. Tabla: reviews (Carrusel inferior)
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  body text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  is_approved boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla: apartments (Inventario / Carrusel Principal)
CREATE TABLE apartments (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  image_url text NOT NULL,
  lat double precision,
  lng double precision,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0
);

-- 4. Tabla: site_images (Imágenes estáticas modificables por UI)
CREATE TABLE site_images (
  id text PRIMARY KEY,
  url text NOT NULL,
  title text,
  description text
);

-- ==============================================
-- INYECCIÓN DE DATOS INICIALES (MOCK DATA BASE)
-- ==============================================

-- Llenamos los contadores
INSERT INTO site_settings (id, properties_count, happy_guests, return_rate) 
VALUES (1, 50, 10000, 98);

-- Llenamos las fotos que veníamos usando en local
INSERT INTO site_images (id, url, title, description) VALUES
('hero-1', '/images/hero-1.webp', null, null),
('hero-2', '/images/hero-2.webp', null, null),
('salta-vertical', '/images/salta-vertical.webp', null, null),
('salta-imperdible-1', '/images/cafayate-vinos.webp', 'Cafayate y la Ruta del Vino', 'Disfrutá del corazón vitivinícola de los Valles Calchaquíes, famoso por su Torrontés de altura.'),
('salta-imperdible-2', '/images/salinas.webp', 'Salinas Grandes', 'Un inmenso desierto de sal a más de 3.000 metros sobre el nivel del mar.'),
('salta-imperdible-3', '/images/tren-nubes.webp', 'Tren a las Nubes', 'Una obra maestra de la ingeniería a 4.220 metros de altura, con paisajes andinos únicos.');

-- Llenamos los 8 Departamentos del bloque
INSERT INTO apartments (id, name, image_url, display_order) VALUES
('alfa', 'Alfa', '/images/alfa.webp', 1),
('bravo', 'Bravo', '/images/Bravo.webp', 2),
('charlie', 'Charlie', '/images/Charly.webp', 3),
('delta', 'Delta', '/images/Delta.webp', 4),
('eco', 'Eco', '/images/Eco.webp', 5),
('foxtrot', 'Foxtrot', '/images/foxtrot.webp', 6),
('golf', 'Golf', '/images/golf.webp', 7),
('india', 'India', '/images/india.webp', 8);

-- Llenamos 5 Reviews iniciales
INSERT INTO reviews (name, body, rating, is_approved) VALUES
('Katherine', 'Exceptional! Excellent value for money. Nice location, short walk to the centre. Pool and outdoor area great with well equipped gym with free weights. Apartment very modern clean and tidy.', 5, true),
('Federico', 'Excelentes deptos en salta! Los departamentos estan impecables todos nuevos. Muy limpios y bien equipados. El desayuno excelente muy completo y variado.', 5, true),
('Albert', 'New apartments with all utilities. Air conditioned, small kitchen (but fully functional), comfortable bed and spacious terrace. The building also has gym and pool. Very worth the money.', 5, true),
('Juan', 'Hermoso lugar para quedarse, cerca de todo y con una vista increíble desde la montaña.', 5, true),
('Marcia', 'La pasamos bomba. Muy buena atención y los colchones de diez para después de las peñas.', 5, true);

-- ==============================================
-- SEGURIDAD RLS (Lectura Pública Abierta para Landing)
-- ==============================================
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir lectura publica" ON site_settings FOR SELECT USING (true);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Solo lectura de reviews aprobadas" ON reviews FOR SELECT USING (is_approved = true);

ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura de propiedades activas" ON apartments FOR SELECT USING (is_active = true);

ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir lectura publica fotos" ON site_images FOR SELECT USING (true);
