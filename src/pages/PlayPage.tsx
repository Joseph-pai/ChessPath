import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Chess } from 'chess.js'
import { BoardStage } from '../components/BoardStage'
import { START_FEN, statusText } from '../lib/chessEngine'
import { coachPlan, type CoachPlan } from '../lib/coach'
import { requestAiMove } from '../lib/stockfish'
import { useBoard } from '../store/board'

const LEVELS = [
  { elo: 700, label: '入门', note: '会漏看简单威胁，适合刚学走法，附教练建议。' },
  { elo: 1000, label: '初级', note: '会吃明显可吃的子，偶尔看到一步威胁。' },
  { elo: 1300, label: '中级', note: '能计算两三步，开始保护自己的子。' },
  { elo: 1700, label: '高级', note: '更少失误，会利用你的结构弱点。' },
]

export function PlayPage() {
  const fen = useBoard((s) => s.fen)
  const [started, setStarted] = useState(false)
  const [color, setColor] = useState<'w' | 'b'>('w')
  const [elo, setElo] = useState(700)
  const [result, setResult] = useState<{ title: string; text: string } | null>(null)
  const [thinking, setThinking] = useState(false)
  const [coach, setCoach] = useState<CoachPlan | null>(null)
  const [showArrow, setShowArrow] = useState(false)

  const colorRef = useRef(color)
  const eloRef = useRef(elo)
  const timerRef = useRef<number[]>([])
  const startedRef = useRef(false)
  colorRef.current = color
  eloRef.current = elo
  startedRef.current = started

  const clearTimers = () => {
    timerRef.current.forEach((t) => window.clearTimeout(t))
    timerRef.current = []
  }

  const moves = useMemo(() => {
    try {
      return new Chess(fen).history()
    } catch {
      return []
    }
  }, [fen])

  const finishIfOver = (): boolean => {
    const g = useBoard.getState().game
    if (g.isCheckmate()) {
      const playerLost = g.turn() === colorRef.current
      setResult({
        title: playerLost ? '将杀 · 你输了' : '将杀 · 你赢了',
        text: playerLost ? '国王被将杀，对局结束。看看走子记录，找出哪一步让国王暴露了。' : '你把对手的国王将杀了。试着复盘：哪一步是关键？',
      })
      useBoard.getState().setLocked(true)
      return true
    }
    if (g.isStalemate() || g.isDraw()) {
      setResult({ title: '和棋', text: '没有一方能把国王将杀，对局以和棋结束。' })
      useBoard.getState().setLocked(true)
      return true
    }
    return false
  }

  const runAiTurn = async () => {
    const g = useBoard.getState().game
    if (g.isGameOver()) return
    setThinking(true)
    useBoard.getState().setLocked(true)
    const { san } = await requestAiMove(g.fen(), eloRef.current)
    if (san && !useBoard.getState().game.isGameOver()) {
      useBoard.getState().autoMove(san)
    }
    setThinking(false)
    useBoard.getState().setLocked(false)
    finishIfOver()
  }

  const requestAi = () => {
    const t = window.setTimeout(() => { runAiTurn() }, 550)
    timerRef.current.push(t)
  }

  const startGame = () => {
    clearTimers()
    setResult(null)
    setThinking(false)
    setCoach(null)
    setShowArrow(false)
    useBoard.getState().loadPosition(START_FEN, {
      mode: 'play',
      interaction: 'move',
      orientation: colorRef.current,
      locked: false,
    })
    setStarted(true)
    startedRef.current = true
    if (colorRef.current === 'b') {
      const t = window.setTimeout(() => { runAiTurn() }, 700)
      timerRef.current.push(t)
    }
  }

  useEffect(() => {
    useBoard.getState().setCallbacks({
      onMove: () => {
        if (!startedRef.current) return
        useBoard.getState().setVisuals({ arrows: [] })
        setShowArrow(false)
        if (finishIfOver()) return
        const g = useBoard.getState().game
        if (g.turn() !== colorRef.current) requestAi()
      },
      onClickSquare: null,
      onReject: null,
    })
    return () => {
      clearTimers()
      useBoard.getState().setCallbacks({ onMove: null, onClickSquare: null, onReject: null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 入门模式：轮到玩家时生成教练建议
  useEffect(() => {
    if (!started || elo !== 700) {
      setCoach(null)
      setShowArrow(false)
      return
    }
    const g = useBoard.getState().game
    if (g.isGameOver() || g.turn() !== colorRef.current) return
    setCoach(coachPlan(fen, colorRef.current))
    setShowArrow(false)
    useBoard.getState().setVisuals({ arrows: [] })
  }, [fen, started, elo, color])

  const resign = () => {
    clearTimers()
    useBoard.getState().setLocked(true)
    setResult({ title: '你认输了', text: '认输不是失败，是承认自己看不到解法。换一局，再试一次。' })
  }

  const coaching = started && elo === 700

  const toggleArrow = () => {
    const rec = coach?.recommend
    if (!rec) return
    const next = !showArrow
    setShowArrow(next)
    useBoard.getState().setVisuals({
      arrows: next ? [{ from: rec.from, to: rec.to, color: '#3b82f6' }] : [],
    })
  }

  const status = statusText(fen)
  const historyRows = useMemo(() => {
    const rows: { n: number; w: string; b: string }[] = []
    moves.forEach((san, i) => {
      const n = Math.floor(i / 2)
      if (i % 2 === 0) rows.push({ n: n + 1, w: san, b: '' })
      else rows[n].b = san
    })
    return rows
  }, [moves])

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-5 px-4 pb-8 pt-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-5">
      <section className="flex min-h-[46vh] flex-col gap-4 lg:min-h-[calc(100vh-8.5rem)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-slate-500 hover:text-white">
              ← 地图
            </Link>
            <span className="chip">自由对弈</span>
            <span className="hidden text-sm text-slate-400 sm:block">你执{color === 'w' ? '白' : '黑'}</span>
          </div>
          <span className="text-[11px] text-slate-500">{started ? status : '选择难度后开始'}</span>
        </div>
        <BoardStage className="min-h-[46vh] flex-1 lg:min-h-0" />
      </section>

      <aside className="panel flex max-h-[calc(100vh-5.5rem)] flex-col overflow-hidden">
        {!started ? (
          <div className="flex-1 overflow-y-auto p-5">
            <p className="kicker">FREE PLAY</p>
            <h1 className="mt-2 font-serif text-2xl text-white">自由对弈</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              选一个难度，下完一整盘。入门难度会实时给出教练建议；其他难度全靠你自己。走完记得回看记录。
            </p>

            <p className="mt-6 text-xs font-medium text-slate-300">选择执棋颜色</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                { c: 'w' as const, label: '执白 · 先走' },
                { c: 'b' as const, label: '执黑 · 后走' },
              ].map((o) => (
                <button
                  key={o.c}
                  onClick={() => setColor(o.c)}
                  className={`rounded-xl border px-3 py-3 text-sm transition ${
                    color === o.c ? 'border-brass/60 bg-brass/10 text-white' : 'border-line bg-white/[0.02] text-slate-400 hover:border-brass/40'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>

            <p className="mt-6 text-xs font-medium text-slate-300">AI 难度</p>
            <div className="mt-2 space-y-2">
              {LEVELS.map((l) => (
                <button
                  key={l.elo}
                  onClick={() => setElo(l.elo)}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition ${
                    elo === l.elo ? 'border-brass/60 bg-brass/10' : 'border-line bg-white/[0.02] hover:border-brass/40'
                  }`}
                >
                  <span>
                    <span className="block text-sm text-slate-100">{l.label}</span>
                    <span className="mt-0.5 block text-[11px] leading-4 text-slate-500">{l.note}</span>
                  </span>
                  <span className="text-[11px] text-slate-500">≈ {l.elo}</span>
                </button>
              ))}
            </div>

            <button className="btn btn-primary mt-7 w-full py-3" onClick={startGame}>
              开始对局
            </button>
            <p className="mt-3 text-center text-[11px] text-slate-600">走子：点击自己的棋子，再点高亮格</p>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="border-b border-line/60 px-5 py-4">
              <div className="flex items-center justify-between">
                <p className="kicker">GAME</p>
                <span className="text-xs text-slate-500">难度 ≈ {elo}</span>
              </div>
              <h1 className="mt-1 font-serif text-xl text-white">{status}</h1>
              {
                <p className="mt-1 text-xs text-slate-500">
                  {thinking ? 'AI 正在计算…' : '轮到你走。点击棋子查看合法目标。'}
                </p>
              }
            </div>

            {coaching && (
              <div className="shrink-0 border-b border-line/60 bg-white/[0.02] px-5 py-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-mint">教练建议 · 入门</p>
                  {coach?.recommend && (
                    <button
                      onClick={toggleArrow}
                      className="rounded-full border border-line/80 px-2.5 py-1 text-[11px] text-slate-400 transition hover:text-white"
                    >
                      {showArrow ? '隐藏箭头' : '标到棋盘'}
                    </button>
                  )}
                </div>

                {thinking ? (
                  <p className="mt-2 text-xs leading-5 text-slate-500">对方正在应对这一步……</p>
                ) : coach?.recommend ? (
                  <>
                    <p className="mt-2 font-mono text-lg leading-6 text-white">{coach.recommend.san}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{coach.recommend.why}</p>
                    {coach.opponentReply && (
                      <p className="mt-2 text-xs leading-5 text-slate-400">
                        若你走 <span className="font-mono text-brass">{coach.recommend.san}</span>，对方最可能回应{' '}
                        <span className="font-mono text-slate-200">{coach.opponentReply.san}</span>。
                        <span className="mt-0.5 block text-slate-500">{coach.opponentReply.why}</span>
                      </p>
                    )}
                  </>
                ) : (
                  <p className="mt-2 text-xs leading-5 text-slate-500">等对方走完，这里会给出建议。</p>
                )}

                {coach?.tips.length ? (
                  <ul className="mt-3 space-y-1.5">
                    {coach.tips.map((t, i) => (
                      <li key={i} className="flex gap-2 text-xs leading-5 text-slate-500">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brass" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              {historyRows.length === 0 ? (
                <p className="text-sm text-slate-600">还没有走子。</p>
              ) : (
                <div className="space-y-1 text-sm">
                  {historyRows.map((r) => (
                    <div key={r.n} className="grid grid-cols-[2rem_1fr_1fr] gap-2 rounded px-1 py-1 odd:bg-white/[0.02]">
                      <span className="text-xs text-slate-600">{r.n}.</span>
                      <span className="text-slate-300">{r.w}</span>
                      <span className="text-slate-400">{r.b}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-line/60 px-5 py-4">
              <button className="btn" onClick={startGame}>
                重开一局
              </button>
              <button className="btn" onClick={resign} disabled={Boolean(result)}>
                认输
              </button>
              <button className="btn col-span-2" onClick={() => setStarted(false)}>
                返回设置
              </button>
            </div>
          </div>
        )}
      </aside>

      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="float-in w-full max-w-md rounded-3xl border border-brass/30 bg-panel p-7">
            <p className="kicker">GAME OVER</p>
            <h2 className="mt-2 font-serif text-2xl text-white">{result.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{result.text}</p>
            <div className="mt-6 flex gap-2">
              <button
                className="btn btn-primary flex-1"
                onClick={() => {
                  setResult(null)
                  startGame()
                }}
              >
                再来一局
              </button>
              <Link to="/" className="btn flex-1">
                返回地图
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
