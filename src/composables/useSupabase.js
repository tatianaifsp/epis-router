// Importar do Supabase (CORRETO)
import { createClient } from '@supabase/supabase-js'

// Variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verificação
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERRO: Variáveis de ambiente do Supabase não configuradas!')
  console.error('Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env')
}

// Criar cliente
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Composable
export function useSupabase() {
  return {
    supabase
  }
}

// Export direto (opcional)
export default supabase