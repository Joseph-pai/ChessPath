import { useBoard } from '../store/board'
import { statusText } from '../lib/chessEngine'
import { ChessScene } from '../scene/ChessScene'

export function BoardStage({ className = '' }: { className?: string }) {
  const fen = useBoard((s) => s.fen)
  const setVisuals = useBoard((s) => s.setVisuals)
  const locked = useBoard((s) => s.locked)
  const status = statusText(fen)

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-line/70 bg-[#0b1016] ${className}`}>
      <ChessScene />

      <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
        <span>拖动旋转 · 滚轮缩放</span>
        {locked && <span className="text-brass/90">对手思考中…</span>}
      </div>

      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-xl border border-white/5 bg-[#0b1016]/70 px-3 py-2 backdrop-blur">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className={`h-1.5 w-1.5 rounded-full ${status.includes('将杀') || status.includes('和') ? 'bg-brass' : 'bg-mint'}`} />
          <span>{status}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden max-w-[42vw] truncate font-mono text-[10px] text-slate-500 lg:block">{fen}</span>
          <button
            onClick={() => setVisuals({ focus: null })}
            className="rounded-full border border-line/80 px-2.5 py-1 text-[11px] text-slate-400 transition hover:text-white"
          >
            重置视角
          </button>
        </div>
      </div>
    </div>
  )
}
