
-- Criar tabela de reservas
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id VARCHAR(255) NOT NULL,
  tour_name VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  tour_date TIMESTAMP NOT NULL,
  passengers INTEGER NOT NULL DEFAULT 1,
  luggage INTEGER NOT NULL DEFAULT 0,
  hotel VARCHAR(255) NOT NULL,
  flight VARCHAR(100),
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id VARCHAR(255),
  stripe_session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_bookings_tour_id ON bookings(tour_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_tour_date ON bookings(tour_date);

-- Adicionar políticas de segurança RLS (Row Level Security)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Permitir inserção de novas reservas
CREATE POLICY "Allow booking creation" ON bookings
  FOR INSERT WITH CHECK (true);

-- Permitir leitura de reservas (para admin ou proprietário)
CREATE POLICY "Allow booking read" ON bookings
  FOR SELECT USING (true);

-- Permitir atualização de reservas
CREATE POLICY "Allow booking update" ON bookings
  FOR UPDATE USING (true);
