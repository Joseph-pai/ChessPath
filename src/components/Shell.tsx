import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useProgress } from '../store/progress'

export function Shell() {
  const navigate = useNavigate()
  const currentLevel = useProgress((s) => s.currentLevel)

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-30 border-b border-line/60 bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <button onClick={() => navigate('/')} className="group flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-brass/40 bg-brass/10 text-lg text-brass">
              ♞
            </span>
            <span className="text-left">
              <span className="block font-serif text-lg leading-none tracking-tight text-white">ChessPath</span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.24em] text-slate-500">3D 西洋棋教学</span>
            </span>
          </button>

          <nav className="flex items-center gap-1 text-sm">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `rounded-full px-3 py-2 transition ${isActive ? 'text-brass' : 'text-slate-400 hover:text-white'}`
              }
            >
              段位地图
            </NavLink>
            <NavLink
              to="/play"
              className={({ isActive }) =>
                `rounded-full px-3 py-2 transition ${isActive ? 'text-brass' : 'text-slate-400 hover:text-white'}`
              }
            >
              自由对弈
            </NavLink>
            <span className="ml-2 hidden rounded-full border border-line px-3 py-1.5 text-[11px] text-slate-400 sm:inline-flex">
              当前 · Level {currentLevel}
            </span>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  )
}
