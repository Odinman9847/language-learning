import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pzbphblambwuxybuktwn.supabase.co'
const supaBaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6YnBoYmxhbWJ3dXh5YnVrdHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5ODc3NjYsImV4cCI6MjA3NjU2Mzc2Nn0.Z_ORtmQI0bV2SMSCV69Ps5fu_CslrS77rWO8eqMZ5Xk'

export const supabase = createClient(supabaseUrl, supaBaseAnonKey)
