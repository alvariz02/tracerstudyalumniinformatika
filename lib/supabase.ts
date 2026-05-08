import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

// Try to read from .env.local file directly for service role key
let serviceRoleKey = ''
try {
  const envPath = join(process.cwd(), '.env.local')
  const envContent = readFileSync(envPath, 'utf-8')
  const match = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=["']?([^"'\n]+)["']?/)
  if (match) {
    serviceRoleKey = match[1]
  }
} catch {
  // fallback to env var
}

// Use service role key for server-side operations (bypasses RLS)
const supabaseKey = serviceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('Supabase client - Service role from file:', !!serviceRoleKey)
console.log('Supabase client - Service role from env:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
console.log('Supabase client - Key length:', supabaseKey?.length)

export const supabase = createClient(supabaseUrl, supabaseKey)
