import { createMiddleware } from 'hono/factory'
import { getSupabaseClient } from '../lib/supabaseServer'

export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('authorization')

  if (!authHeader) {
    return c.json({ error: 'Token ausente' }, 401)
  }

  const token = authHeader.replace('Bearer ', '')

  const supabase = getSupabaseClient(c.env)

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    return c.json({ error: 'Token inválido' }, 401)
  }

  // busca role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (profile?.role !== 'admin') {
    return c.json({ error: 'Acesso negado' }, 403)
  }

  c.set('user', data.user)
  await next()
})
