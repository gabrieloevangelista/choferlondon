import { supabase } from '../lib/supabase'
import fs from 'fs'
import path from 'path'

async function setupBookingsTable() {
  console.log('Configurando tabela de bookings...')
  
  try {
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, 'create-bookings-simple.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    // Executar cada comando SQL separadamente
    const commands = sql.split(';').filter(cmd => cmd.trim().length > 0)
    
    for (const command of commands) {
      const trimmedCommand = command.trim()
      if (trimmedCommand) {
        console.log('Executando:', trimmedCommand.substring(0, 50) + '...')
        const { error } = await supabase.rpc('exec_sql', { sql: trimmedCommand })
        
        if (error) {
          console.error('Erro ao executar comando:', error)
        } else {
          console.log('✓ Comando executado com sucesso')
        }
      }
    }
    
    console.log('\n✅ Tabela de bookings configurada com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro ao configurar tabela:', error)
  }
}

setupBookingsTable()