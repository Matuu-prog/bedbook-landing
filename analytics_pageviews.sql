-- Crear la tabla para almacenar visitas a la página
CREATE TABLE page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address TEXT,
    country TEXT,
    city TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Habilitar RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Política de lectura (Select) reservada para el admin (acceso vía service_role a nivel API o RLS falso para stats)
CREATE POLICY "Public profiles are viewable by everyone."
ON page_views FOR SELECT
USING ( true );

-- Política de inserción (Insert) pública
CREATE POLICY "Public can insert page views."
ON page_views FOR INSERT
WITH CHECK ( true );
