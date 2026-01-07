import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// =====================
// Público
// =====================
import HomePage from '@/react-app/pages/Home'
import Stories from '@/react-app/pages/Stories'
import Storiesparts from '@/react-app/pages/Storiesparts'
import Curiosities from '@/react-app/pages/Curiosities'
import Activities from '@/react-app/pages/Activities'
import Sponsors from '@/react-app/pages/Sponsors'

// =====================
// Admin
// =====================
import Admin from '@/react-app/pages/Admin'

// Admin - Stories
import AdminStoriesIndex from '@/react-app/pages/admin/stories/Index'
import AdminStoryEdit from '@/react-app/pages/admin/stories/Edit'
import NewStory from '@/react-app/pages/admin/stories/New'

// Admin - Curiosities
import AdminCuriosities from '@/react-app/pages/admin/curiosities/AdminCuriosities'

// Admin - Activities (subpainel)
import AdminActivities from '@/react-app/pages/admin/activities/AdminActivities'

// Admin - Coloring (CRUD)
import AdminColoring from '@/react-app/pages/admin/activities/coloring/AdminColoring'
import NewColoring from '@/react-app/pages/admin/activities/coloring/NewColoring'
import EditColoring from '@/react-app/pages/admin/activities/coloring/EditColoring'

// =====================
// Jogos / Atividades
// =====================
import ColoringGame from '@/react-app/pages/games/colorir/ColoringGame'
import ColorirPlay from '@/react-app/pages/games/colorir/ColorirPlay'
import Quiz from '@/react-app/pages/games/Quiz'
import Memoria from '@/react-app/pages/games/Memoria'
import CacaPalavras from '@/react-app/pages/games/CacaPalavras'
import Puzzle from '@/react-app/pages/games/Puzzle'
import LigarPontos from '@/react-app/pages/games/LigarPontos'

export default function App() {
  return (
    <Router>
      <Routes>
        {/* =====================
            Público
        ===================== */}
        <Route path="/" element={<HomePage />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/stories/:id" element={<Storiesparts />} />
        <Route path="/curiosities" element={<Curiosities />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/sponsors" element={<Sponsors />} />

        {/* =====================
            Admin
        ===================== */}
        <Route path="/admin" element={<Admin />} />

        {/* Admin - Stories */}
        <Route path="/admin/stories" element={<AdminStoriesIndex />} />
        <Route path="/admin/stories/new" element={<NewStory />} />
        <Route path="/admin/stories/:id" element={<AdminStoryEdit />} />

        {/* Admin - Curiosities */}
        <Route path="/admin/curiosities" element={<AdminCuriosities />} />

        {/* Admin - Activities */}
        <Route path="/admin/activities" element={<AdminActivities />} />

        {/* Admin - Coloring */}
        <Route path="/admin/activities/coloring" element={<AdminColoring />} />
        <Route path="/admin/activities/coloring/new" element={<NewColoring />} />
        <Route path="/admin/activities/coloring/:id" element={<EditColoring />} />

        {/* =====================
            Jogos
        ===================== */}
        <Route path="/games/colorir" element={<ColoringGame />} />
        <Route path="/games/colorir/:id" element={<ColorirPlay />} />
        <Route path="/games/quiz" element={<Quiz />} />
        <Route path="/games/memoria" element={<Memoria />} />
        <Route path="/games/caca-palavras" element={<CacaPalavras />} />
        <Route path="/games/puzzle" element={<Puzzle />} />
        <Route path="/games/ligar-pontos" element={<LigarPontos />} />
      </Routes>
    </Router>
  )
}
