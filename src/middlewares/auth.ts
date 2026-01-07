import { MiddlewareHandler } from 'hono'

type Env = {
  SUPABASE_SERVICE_ROLE_KEY: string
}

export const authMiddleware: MiddlewareHandler<{ Bindings: Env }> = async (
  c,
  next
) => {
  const auth = c.req.header('Authorization')

  if (!auth) {
    return c.json({ error: 'Authorization header ausente' }, 401)
  }

  if (auth !== `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`) {
    return c.json({ error: 'Token inválido ou expirado' }, 401)
  }

  // mock de usuário admin (backend only)
  c.set('user', {
    role: 'admin',
  })

  await next()
}
