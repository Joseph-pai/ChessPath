import { useNavigate } from 'react-router-dom'

interface ResultModalProps {
  open: boolean
  title: string
  text: string
  nextLevel?: number
  onClose?: () => void
}

export function ResultModal({ open, title, text, nextLevel, onClose }: ResultModalProps) {
  const navigate = useNavigate()
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="float-in w-full max-w-md rounded-3xl border border-brass/30 bg-panel p-7 shadow-2xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brass/40 bg-brass/10 text-2xl">
          ♔
        </div>
        <h2 className="font-serif text-2xl text-white">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
        <div className="mt-7 flex flex-wrap gap-2">
          {nextLevel ? (
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate(`/level/${nextLevel}`)
                onClose?.()
              }}
            >
              进入 Level {nextLevel}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => navigate('/play')}>
              去自由对弈
            </button>
          )}
          <button className="btn" onClick={() => navigate('/')}>
            返回段位地图
          </button>
        </div>
      </div>
    </div>
  )
}
