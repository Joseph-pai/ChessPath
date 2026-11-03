import { Route, Routes } from 'react-router-dom'
import { Shell } from './components/Shell'
import { HomePage } from './pages/HomePage'
import { LevelPage } from './pages/LevelPage'
import { PlayPage } from './pages/PlayPage'
import { ReviewPage } from './pages/ReviewPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/level/:levelId" element={<LevelPage />} />
        <Route path="/play" element={<PlayPage />} />
        <Route path="/review/:reviewId" element={<ReviewPage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  )
}
