import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = 'https://zhxigmzsnnvvhqqkmcza.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoeGlnbXpzbm52dmhxcWttY3phIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODcwMTkyOCwiZXhwIjoyMDU0Mjc3OTI4fQ.service_role_key_placeholder'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createBookingsTable() {
  console.log('Criando tabela de bookings...')
  
  try {
    // Criar a tabela bookings
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS bookings (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          tour_id VARCHAR(255) NOT NULL,
          tour_name VARCHAR(255) NOT NULL,
          customer_name VARCHAR(255) NOT NULL,
          customer_email VARCHAR(255) NOT NULL,
          customer_phone VARCHAR(50) NOT NULL,
          tour_date DATE NOT NULL,
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
        
        CREATE INDEX IF NOT EXISTS idx_bookings_tour_id ON bookings(tour_id);
        CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON bookings(customer_email);
        CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
        CREATE INDEX IF NOT EXISTS idx_bookings_tour_date ON bookings(tour_date);
        
        ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Allow booking creation" ON bookings;
        CREATE POLICY "Allow booking creation" ON bookings
          FOR INSERT WITH CHECK (true);
        
        DROP POLICY IF EXISTS "Allow booking read" ON bookings;
        CREATE POLICY "Allow booking read" ON bookings
          FOR SELECT USING (true);
        
        DROP POLICY IF EXISTS "Allow booking update" ON bookings;
        CREATE POLICY "Allow booking update" ON bookings
          FOR UPDATE USING (true);
      `
    })
    
    if (error) {
      console.error('Erro ao criar tabela:', error)
    } else {
      console.log('Tabela de bookings criada com sucesso!')
    }
  } catch (error) {
    console.error('Erro:', error)
  }
}

createBookingsTable()