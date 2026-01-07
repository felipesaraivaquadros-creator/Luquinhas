import { Hono } from 'hono'
import adminRoutes from '../routes/admin'
import { getSupabaseClient } from '../lib/supabaseServer'

const app = new Hono<{ Bindings: Env }>()

/* ===========================
   📖 ROTAS PÚBLICAS
=========================== */

app.get('/stories', async (c) => {
  const supabase = getSupabaseClient(c.env)

  const page = Number(c.req.query('page') || 1)
  const limit = Number(c.req.query('limit') || 10)

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from('stories')
    .select('id, title, image_url', { count: 'exact' })
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    return c.json({ error: error.message }, 500)
  }

  return c.json({
    page,
    limit,
    total: count,
    data,
  })
})


app.get('/stories/:id/parts', async (c) => {
  const supabase = getSupabaseClient(c.env)
  const storyId = c.req.param('id')

  const page = Number(c.req.query('page') || 1)
  const limit = Number(c.req.query('limit') || 5)

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from('story_parts')
    .select('id, part_order, text, image_url', { count: 'exact' })
    .eq('story_id', storyId)
    .order('part_order', { ascending: true })
    .range(from, to)

  if (error) {
    return c.json({ error: error.message }, 500)
  }

  return c.json({
    story_id: storyId,
    page,
    limit,
    total: count,
    data,
  })
})


/* ===========================
   🔒 ROTAS ADMIN
=========================== */

app.route('/admin', adminRoutes)

/* ===========================
   🧪 HEALTH
=========================== */

app.post('/ping-admin', (c) => {
  return c.json({ ok: true })
})

export default app
