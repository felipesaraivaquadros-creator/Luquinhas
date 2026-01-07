import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Home, Trash2, Edit3, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router';

interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  is_active: boolean;
  created_at: string;
}

export default function AdminSponsors() {
  const navigate = useNavigate();

  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [editName, setEditName] = useState('');
  const [editLogoUrl, setEditLogoUrl] = useState('');
  const [editWebsiteUrl, setEditWebsiteUrl] = useState('');

  const [newName, setNewName] = useState('');
  const [newLogoUrl, setNewLogoUrl] = useState('');
  const [newWebsiteUrl, setNewWebsiteUrl] = useState('');

  /* =========================
     Fetch Sponsors
  ========================== */
  const fetchSponsors = async () => {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar patrocinadores:', error);
      return;
    }

    setSponsors(data || []);
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  /* =========================
     Create Sponsor
  ========================== */
  const handleCreate = async () => {
    if (!newName || !newLogoUrl) return;

    const { error } = await supabase.from('sponsors').insert({
      name: newName,
      logo_url: newLogoUrl,
      website_url: newWebsiteUrl || null,
      is_active: false,
    });

    if (error) {
      console.error('Erro ao criar patrocinador:', error);
      return;
    }

    setNewName('');
    setNewLogoUrl('');
    setNewWebsiteUrl('');
    fetchSponsors();
  };

  /* =========================
     Start Edit
  ========================== */
  const startEdit = (s: Sponsor) => {
    setEditingId(s.id);
    setEditName(s.name);
    setEditLogoUrl(s.logo_url);
    setEditWebsiteUrl(s.website_url || '');
  };

  /* =========================
     Cancel Edit
  ========================== */
  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditLogoUrl('');
    setEditWebsiteUrl('');
  };

  /* =========================
     Save Edit
  ========================== */
  const saveEdit = async () => {
    if (!editingId) return;

    const { error } = await supabase
      .from('sponsors')
      .update({
        name: editName,
        logo_url: editLogoUrl,
        website_url: editWebsiteUrl || null,
      })
      .eq('id', editingId);

    if (error) {
      console.error('Erro ao salvar edição:', error);
      return;
    }

    cancelEdit();
    fetchSponsors();
  };

  /* =========================
     Toggle Active
  ========================== */
  const toggleActive = async (id: string, value: boolean) => {
    await supabase
      .from('sponsors')
      .update({ is_active: !value })
      .eq('id', id);

    fetchSponsors();
  };

  /* =========================
     Delete
  ========================== */
  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Deseja excluir este patrocinador?');
    if (!confirm) return;

    await supabase.from('sponsors').delete().eq('id', id);
    fetchSponsors();
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-luquinhas-blue hover:text-luquinhas-blue-dark"
          >
            <Home className="w-6 h-6" />
            <span className="font-semibold">Voltar</span>
          </button>

          <h1 className="text-4xl font-bold text-luquinhas-blue">
            Patrocinadores
          </h1>

          <div className="w-24"></div>
        </div>

        {/* Create */}
        <div className="card mb-8">
          <h2 className="font-bold mb-3">Novo patrocinador</h2>

          <input
            className="input mb-3"
            placeholder="Nome"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <input
            className="input mb-3"
            placeholder="URL da logo"
            value={newLogoUrl}
            onChange={(e) => setNewLogoUrl(e.target.value)}
          />

          {newLogoUrl && (
            <div className="flex justify-center mb-3">
              <img src={newLogoUrl} className="h-16 object-contain" />
            </div>
          )}

          <input
            className="input mb-4"
            placeholder="Site (opcional)"
            value={newWebsiteUrl}
            onChange={(e) => setNewWebsiteUrl(e.target.value)}
          />

          <button className="btn-primary" onClick={handleCreate}>
            Adicionar
          </button>
        </div>

        {/* List */}
        <ul className="space-y-4">
          {sponsors.map((s) => (
            <li key={s.id} className="card flex justify-between items-center">
              <div className="flex-1">

                {editingId === s.id ? (
                  <>
                    <input
                      className="input mb-2"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <input
                      className="input mb-2"
                      value={editLogoUrl}
                      onChange={(e) => setEditLogoUrl(e.target.value)}
                    />
                    <input
                      className="input"
                      value={editWebsiteUrl}
                      onChange={(e) => setEditWebsiteUrl(e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <p className="font-bold">{s.name}</p>
                    <p className="text-sm text-gray-500">
                      {s.is_active ? 'Ativo' : 'Inativo'}
                    </p>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                {editingId === s.id ? (
                  <>
                    <button className="btn-primary" onClick={saveEdit}>
                      <Check className="w-5 h-5" />
                    </button>
                    <button className="btn-secondary" onClick={cancelEdit}>
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn-secondary"
                      onClick={() => toggleActive(s.id, s.is_active)}
                    >
                      {s.is_active ? 'Desativar' : 'Ativar'}
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => startEdit(s)}
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(s.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}
