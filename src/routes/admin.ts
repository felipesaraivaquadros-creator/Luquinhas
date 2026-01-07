import { Hono } from 'hono'
import { authMiddleware } from '../middlewares/auth'
import { getSupabaseClient } from '../lib/supabaseServer'

const admin = new Hono()

// 🔐 Todas as rotas abaixo exigem admin
admin.use('*', authMiddleware)

/* ===========================
   🧪 TESTE
=========================== */
admin.get('/test', (c) => {
  return c.json({
    message: 'Admin OK',
    user: c.get('user'),
  })
})

/* ===========================
   📚 STORIES (CRUD)
=========================== */

admin.post('/stories/:storyId/parts', async (c) => {
  const supabase = getSupabaseClient(c.env)
  const storyId = c.req.param('storyId')
  const body = await c.req.json()

  let { part_order, text, image_url = null } = body

  if (!text) {
    return c.json(
      { error: 'text é obrigatório' },
      400
    )
  }

  // 🔢 Se não informar part_order, calcula automaticamente
  if (part_order === undefined) {
    const { data: lastPart, error } = await supabase
      .from('story_parts')
      .select('part_order')
      .eq('story_id', storyId)
      .order('part_order', { ascending: false })
      .limit(1)

    if (error) {
      return c.json({ error: error.message }, 500)
    }

    part_order = lastPart.length > 0
      ? lastPart[0].part_order + 1
      : 1
  }

  const { data, error } = await supabase
    .from('story_parts')
    .insert({
      story_id: storyId,
      part_order,
      text,
      image_url,
    })
    .select('*')

  if (error) {
    return c.json({ error: error.message }, 500)
  }

  return c.json(data[0], 201)
})

admin.put('/stories/:id', async (c) => {
  const supabase = getSupabaseClient(c.env)
  const id = c.req.param('id')
  const body = await c.req.json()

  const updates: any = {}

  if (body.title !== undefined) updates.title = body.title
  if (body.content !== undefined) updates.content = body.content
  if (body.image_url !== undefined) updates.image_url = body.image_url
  if (body.audio_url !== undefined) updates.audio_url = body.audio_url
  if (body.status !== undefined) updates.status = body.status
  if (body.is_active !== undefined) updates.is_active = body.is_active

  if (Object.keys(updates).length === 0) {
    return c.json({ error: 'Nenhum campo para atualizar' }, 400)
  }

  const { data, error } = await supabase
    .from('stories')
    .update(updates)
    .eq('id', id)
    .select('*')

  if (error) {
    return c.json({ error: error.message }, 500)
  }

  if (!data || data.length === 0) {
    return c.json({ error: 'Story não encontrada' }, 404)
  }

  return c.json(data[0])
})

admin.delete('/stories/:id', async (c) => {
  const supabase = getSupabaseClient(c.env)
  const id = c.req.param('id')

  const { error } = await supabase
    .from('stories')
    .delete()
    .eq('id', id)

  if (error) {
    return c.json({ error: error.message }, 500)
  }

  return c.json({ success: true })
})

/* ===========================
   🧩 STORY PARTS (CRUD)
=========================== */

/**
 * Criar parte da história
 */


/**
 * Atualizar parte da história
 */
admin.put('/story-parts/:id', async (c) => {
  const supabase = getSupabaseClient(c.env)
  const partId = c.req.param('id')
  const body = await c.req.json()

  const { part_order, text, image_url } = body

  // 1️⃣ Busca a parte atual
  const { data: currentPart, error: fetchError } = await supabase
    .from('story_parts')
    .select('id, story_id, part_order')
    .eq('id', partId)
    .single()

  if (fetchError || !currentPart) {
    return c.json({ error: 'Parte não encontrada' }, 404)
  }

  const storyId = currentPart.story_id
  const oldOrder = currentPart.part_order

  // 2️⃣ Se part_order mudou, reorganiza
  if (
    part_order !== undefined &&
    part_order !== oldOrder
  ) {
    if (part_order < oldOrder) {
      // 🔼 Move para cima
      await supabase.rpc('shift_parts_up', {
        p_story_id: storyId,
        p_from: part_order,
        p_to: oldOrder - 1,
      })
    } else {
      // 🔽 Move para baixo
      await supabase.rpc('shift_parts_down', {
        p_story_id: storyId,
        p_from: oldOrder + 1,
        p_to: part_order,
      })
    }
  }

  // 3️⃣ Atualiza a parte
  const updates: any = {}
  if (part_order !== undefined) updates.part_order = part_order
  if (text !== undefined) updates.text = text
  if (image_url !== undefined) updates.image_url = image_url

  const { data, error } = await supabase
    .from('story_parts')
    .update(updates)
    .eq('id', partId)
    .select()
    .single()

  if (error) {
    return c.json({ error: error.message }, 500)
  }

  return c.json(data)
})

/**
 * Excluir parte da história
 */
admin.delete('/story-parts/:id', async (c) => {
  const supabase = getSupabaseClient(c.env)
  const id = c.req.param('id')

  const { error } = await supabase
    .from('story_parts')
    .delete()
    .eq('id', id)

  if (error) {
    return c.json({ error: error.message }, 500)
  }

  return c.json({ success: true })
})
admin.put('/story-parts/reorder', async (c) => {
  const supabase = getSupabaseClient(c.env)
  const body = await c.req.json()

  const { story_id, ordered_part_ids } = body

  if (!story_id || !Array.isArray(ordered_part_ids)) {
    return c.json({ error: 'Payload inválido' }, 400)
  }

  const updates = ordered_part_ids.map((id: string, index: number) => ({
    id,
    story_id,
    part_order: index + 1,
  }))

  const { error } = await supabase
    .from('story_parts')
    .upsert(updates, { onConflict: 'id' })

  if (error) {
    return c.json({ error: error.message }, 500)
  }

  return c.json({ success: true })
})

export default admin
