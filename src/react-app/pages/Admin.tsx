import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  Home,
  Book,
  HelpCircle,
  Award,
  Image,
  Users,
  Lock,
  LogOut,
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export default function Admin() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // 🔎 Verifica sessão e role
  useEffect(() => {
  const checkSession = async () => {
    const { data: sessionData } =
      await supabase.auth.getSession()

    if (!sessionData.session) {
      setLoading(false)
      return
    }

    const user = sessionData.session.user

    const { data: profile, error } =
      await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (error) {
      console.error(error)
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    if (profile?.role === 'admin') {
      setIsAuthenticated(true)
    } else {
      await supabase.auth.signOut()
      alert('Acesso negado. Usuário não é admin.')
    }

    setLoading(false)
  }

  checkSession()

  // 👇 mantém sessão viva
  const {
    data: listener,
  } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      if (!session) {
        setIsAuthenticated(false)
      }
    }
  )

  return () => {
    listener.subscription.unsubscribe()
  }
}, [])


  // 🔐 Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert('Credenciais inválidas')
      setLoading(false)
      return
    }

    navigate('/admin')

  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    )
  }

  // 🔒 Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="card max-w-md w-full">
          <div className="text-center mb-8">
            <Lock className="w-16 h-16 mx-auto mb-4 text-luquinhas-blue" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Painel Administrativo
            </h1>
            <p className="text-gray-600">Login de administrador</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2"
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2"
              required
            />
            <button type="submit" className="btn-primary w-full">
              Entrar
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ✅ Painel Admin
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-luquinhas-blue"
          >
            <Home className="w-6 h-6" />
            Voltar ao App
          </button>

          <h1 className="text-5xl font-bold text-gray-800">
            Painel Administrativo
          </h1>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AdminCard
            icon={Book}
            title="Histórias"
            description="Gerencie histórias"
            onClick={() => navigate('/admin/stories')}
          />

          <AdminCard
            icon={HelpCircle}
            title="Curiosidades"
            description="Gerencie curiosidades"
            onClick={() => navigate('/admin/curiosities')}
          />

          <AdminCard
            icon={Award}
            title="Patrocinadores"
            description="Gerencie patrocinadores"
            onClick={() => navigate('/admin/sponsors')}
          />

          <AdminCard
            icon={Image}
            title="Imagens"
            description="Gerencie mídias"
          />

          <AdminCard
          icon={Users}
          title="Atividades"
          description="Gerencie atividades"
          onClick={() => navigate('/admin/activities')}
          />

        </div>
      </div>
    </div>
  )
}

// 🔹 Card reutilizável
function AdminCard({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: any
  title: string
  description: string
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="card hover:scale-105 transition-transform cursor-pointer"
    >
      <div className="bg-luquinhas-blue text-white p-4 rounded-2xl mb-4 inline-block">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">
        {title}
      </h3>
      <p className="text-gray-600">{description}</p>
      <div className="text-luquinhas-blue font-semibold mt-3">
        Clique para gerenciar
      </div>
    </div>
  )
}
