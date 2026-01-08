import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ error: 'Sem token' })
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: user } = await supabase.auth.getUser(token)

  if (!user.user) {
    return res.status(401).json({ error: 'Token inválido' })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.user.id)
    .single()

  if (profile?.role !== 'admin') {
    return res.status(403).json({ error: 'Não autorizado' })
  }

  const { data } = await supabase
    .from('stories')
    .select('*')

  res.json(data)
}
