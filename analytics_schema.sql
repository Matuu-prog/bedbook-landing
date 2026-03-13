-- Crear la tabla para contabilizar clics en botones de contacto y navegación
CREATE TABLE click_analytics (
    id TEXT PRIMARY KEY,
    clicks INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Habilitar RLS
ALTER TABLE click_analytics ENABLE ROW LEVEL SECURITY;

-- Política de lectura (Select) pública
CREATE POLICY "Public profiles are viewable by everyone."
ON click_analytics FOR SELECT
USING ( true );

-- Política de actualización (Update/Insert) pública (importante para que el landing anónimo pueda sumar clics)
CREATE POLICY "Public can increment clicks."
ON click_analytics FOR INSERT
WITH CHECK ( true );

CREATE POLICY "Public can update click counts."
ON click_analytics FOR UPDATE
USING ( true );

-- Crear función RPC (Procedimiento Almacenado) para incremento atómico y transaccional
CREATE OR REPLACE FUNCTION increment_click(button_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO click_analytics (id, clicks, updated_at)
    VALUES (button_id, 1, now())
    ON CONFLICT (id) DO UPDATE 
    SET clicks = click_analytics.clicks + 1,
        updated_at = now();
END;
$$;
