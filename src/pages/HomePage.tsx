import { useNavigate } from 'react-router-dom'
import { REVIEW_PLAYERS, getLevel } from '../data/levels'
import { useProgress } from '../store/progress'

const MINI_BOARD = [
  ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
]

export function HomePage() {
  const navigate = useNavigate()
  const completed = useProgress((s) => s.completedLevels)
  const currentLevel = useProgress((s) => s.currentLevel)
  const resetAll = useProgress((s) => s.resetAll)

  const nextTarget = completed.includes(currentLevel) ? Math.max(1, currentLevel - 1) : currentLevel
  const allDone = completed.length >= 10

  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-12 md:pt-16">
      <section className="grid items-center gap-12 md:grid-cols-[1.05fr_0.95fr]">
        <div className="float-in">
          <span className="kicker">A 3D CHESS CURRICULUM</span>
          <h1 className="mt-5 font-serif text-4xl leading-[1.12] tracking-tight text-white md:text-6xl">
            从第一格，
            <br />
            走到大师的思路。
          </h1>
          <p className="mt-6 max-w-lg text-[15px] leading-7 text-slate-400">
            ChessPath 把西洋棋拆成 10 个段位。从认识棋盘、走完第一盘棋，到用摩菲、塔尔、卡帕布兰卡的眼睛看局面。
            每一步都在 3D 棋盘上看得见。
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button className="btn btn-primary px-6 py-3" onClick={() => navigate(`/level/${allDone ? 1 : nextTarget}`)}>
              {allDone ? '重看大师课' : completed.length ? `继续 Level ${nextTarget}` : '从 Level 10 开始'}
              <span aria-hidden>→</span>
            </button>
            <button className="btn px-5 py-3" onClick={() => navigate('/play')}>
              自由对弈
            </button>
          </div>

          <div className="mt-8 flex items-center gap-6 text-xs text-slate-500">
            <span>
              <span className="text-brass">{completed.length}</span> / 10 段位完成
            </span>
            <span className="h-px w-8 bg-line" />
            <span>无需登录 · 进度保存在本地</span>
          </div>
        </div>

        <div className="float-in relative mx-auto w-full max-w-[420px] [perspective:1200px]">
          <div className="pointer-events-none absolute -inset-10 rounded-full bg-brass/10 blur-3xl" />
          <div className="relative rounded-[28px] border border-line/80 bg-gradient-to-b from-white/[0.06] to-transparent p-6">
            <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500">
              <span>Level 10 · 起点</span>
              <span>3D Board</span>
            </div>
            <div className="[transform:rotateX(48deg)_rotateZ(-14deg)] [transform-style:preserve-3d] transition-transform duration-500 hover:[transform:rotateX(38deg)_rotateZ(-8deg)]">
              <div className="grid grid-cols-8 overflow-hidden rounded-xl border-[6px] border-[#1b232b] shadow-[0_30px_60px_rgba(0,0,0,0.55)]">
                {MINI_BOARD.flatMap((row, r) =>
                  row.map((piece, f) => (
                    <div
                      key={`${r}-${f}`}
                      className={`flex aspect-square items-center justify-center text-[clamp(12px,2vw,20px)] ${
                        (r + f) % 2 === 0 ? 'bg-[#e7d7b6] text-[#3b2a1c]' : 'bg-[#6f5138] text-[#f4ecdc]'
                      }`}
                    >
                      {piece}
                    </div>
                  )),
                )}
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">你的第一盘棋</p>
                <p className="mt-1 text-xs text-slate-500">点击棋子，高亮走法，再点击目标格</p>
              </div>
              <span className="chip">a — h / 1 — 8</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="kicker">THE PATH</span>
            <h2 className="mt-3 font-serif text-3xl text-white">十段位地图</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-500">
            按 10 → 1 的顺序排列，可自由选择任意段位开始学习；进度会保存在这台设备上。
          </p>
        </div>

        <div className="grid gap-3">
          {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((id) => {
            const level = getLevel(id)
            const player = REVIEW_PLAYERS[id]
            const done = completed.includes(id)
            const available = Boolean(level)
            const title = level?.title ?? (player ? `${player.zh}的思维课` : '名局复盘')
            const tagline = level?.tagline ?? (player ? `核心思维：${player.model}` : '内容准备中')
            const accent = level?.accent ?? '#d8b06a'

            return (
              <button
                key={id}
                disabled={!available}
                onClick={() => navigate(`/level/${id}`)}
                className={`group relative overflow-hidden rounded-2xl border px-5 py-5 text-left transition ${
                  available
                    ? 'border-line/80 bg-panel/60 hover:border-brass/50 hover:bg-panel'
                    : 'cursor-not-allowed border-line/40 bg-panel/25 opacity-60'
                }`}
              >
                <div className="flex items-center gap-5">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border font-serif text-xl"
                    style={{ borderColor: `${accent}55`, color: accent, background: `${accent}12` }}
                  >
                    {id}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[15px] font-semibold text-slate-100">{title}</h3>
                      {done && <span className="chip border-mint/40 text-mint">已完成</span>}
                      {!done && <span className="chip border-brass/40 text-brass">可进入</span>}
                      {player && <span className="chip">{player.en}</span>}
                    </div>
                    <p className="mt-1.5 text-sm text-slate-500">{tagline}</p>
                  </div>
                  <span className="hidden text-xs text-slate-500 sm:block">{level ? `${level.steps.length} 个步骤` : ''}</span>
                  <span className="text-slate-500 transition group-hover:translate-x-0.5">{available ? '→' : '🔒'}</span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <span>ChessPath · 纯前端 · React Three Fiber + chess.js</span>
          <button
            className="rounded-full border border-line/60 px-3 py-1.5 transition hover:border-red-400/40 hover:text-red-300"
            onClick={() => {
              if (window.confirm('确定要清除所有段位进度吗？此操作不可撤销。')) resetAll()
            }}
          >
            清除学习进度
          </button>
        </div>
      </section>
    </main>
  )
}
