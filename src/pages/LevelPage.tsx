import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Move } from 'chess.js'
import { BoardStage } from '../components/BoardStage'
import { ProgressDots } from '../components/ProgressDots'
import { ResultModal } from '../components/ResultModal'
import { getLevel } from '../data/levels'
import { PIECE_NAMES } from '../lib/chessEngine'
import { useBoard, type SelectInfo } from '../store/board'
import { useProgress } from '../store/progress'
import type { DemoSpec, LessonStep, PieceType, TourPiece } from '../types'

type Tone = 'good' | 'bad' | 'info'
interface Feedback {
  tone: Tone
  text: string
}

export function LevelPage() {
  const { levelId } = useParams()
  const navigate = useNavigate()
  const id = Number(levelId)
  const level = getLevel(id)

  const savedIndex = useProgress((s) => s.stepIndex[id] ?? 0)
  const reviewsDone = useProgress((s) => s.reviewsDone)
  const markStep = useProgress((s) => s.markStep)
  const completeLevel = useProgress((s) => s.completeLevel)

  const [index, setIndex] = useState(0)
  const [solved, setSolved] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [quizPick, setQuizPick] = useState<number | null>(null)
  const [seen, setSeen] = useState<string[]>([])
  const [activeDemo, setActiveDemo] = useState<string | null>(null)
  const [showComplete, setShowComplete] = useState(false)
  const [demoRunning, setDemoRunning] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const step = level?.steps[Math.min(index, Math.max(0, (level?.steps.length ?? 1) - 1))]
  const stepRef = useRef<LessonStep | undefined>(step)
  const solvedRef = useRef(solved)
  const seenRef = useRef<string[]>([])
  const timersRef = useRef<number[]>([])

  stepRef.current = step
  solvedRef.current = solved
  seenRef.current = seen

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t))
    timersRef.current = []
  }, [])

  const addTimer = useCallback((fn: () => void, ms: number) => {
    const t = window.setTimeout(fn, ms)
    timersRef.current.push(t)
  }, [])

  useEffect(() => {
    if (!level) return
    const start = savedIndex >= level.steps.length ? 0 : savedIndex
    setIndex(start)
    setShowComplete(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (!level) return
    markStep(level.id, Math.min(index, level.steps.length - 1))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, id])

  useEffect(() => {
    if (!step || !level) return
    clearTimers()
    setFeedback(null)
    setQuizPick(null)
    setSeen([])
    seenRef.current = []
    setActiveDemo(null)
    setDemoRunning(false)
    setAttempts(0)

    const interaction: 'move' | 'click' | 'none' | 'free' =
      step.goal.type === 'click'
        ? 'click'
        : step.goal.type === 'inspect'
          ? 'free'
          : step.goal.type === 'move' || step.goal.type === 'mate'
            ? 'move'
            : 'none'

    useBoard.getState().loadPosition(step.fen, {
      mode: 'lesson',
      orientation: step.orientation ?? 'w',
      interaction,
      allowedMoves: step.allowedMoves ?? null,
      highlights: step.highlights ?? [],
      arrows: step.arrows ?? [],
      focus: step.focus ?? null,
    })

    const preSolved =
      step.goal.type === 'next' ||
      (step.goal.type === 'review' && step.reviewId ? reviewsDone.includes(step.reviewId) : false)
    setSolved(preSolved)
    solvedRef.current = preSolved

    if (step.goal.type === 'next') {
      setFeedback({ tone: 'info', text: '读完这一页，点“继续”进入下一课。' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step?.id, level?.id, clearTimers])

  const markSeen = useCallback(
    (key: string) => {
      const s = stepRef.current
      if (!s || !s.goal.count) return
      const next = seenRef.current.includes(key) ? seenRef.current : [...seenRef.current, key]
      seenRef.current = next
      setSeen(next)
      if (next.length >= s.goal.count) {
        setSolved(true)
        solvedRef.current = true
        setFeedback({
          tone: 'good',
          text:
            s.goal.type === 'tour'
              ? '六个棋子都看完了。它们的位置和性格，比名字更重要。'
              : s.goal.type === 'inspect'
                ? '六种走法都看过了。记住：先看棋子能去哪，再决定走哪一步。'
                : '演示全部看完。现在你能认出这三条特殊规则了。',
        })
      }
    },
    [],
  )

  const handleQuiz = (optionIndex: number) => {
    if (!step?.quiz) return
    const option = step.quiz.options[optionIndex]
    setQuizPick(optionIndex)
    if (option.correct) {
      setSolved(true)
      solvedRef.current = true
      setFeedback({ tone: 'good', text: option.feedback })
    } else {
      setFeedback({ tone: 'bad', text: option.feedback })
    }
  }

  const handleMove = useCallback(
    (move: Move) => {
      const s = stepRef.current
      if (!s) return

      if (s.goal.type === 'inspect') {
        const name = PIECE_NAMES[move.piece as PieceType]?.zh ?? move.piece
        markSeen(move.piece)
        if (!solvedRef.current) {
          setFeedback({ tone: 'info', text: `${name}走到了 ${move.to}。这就是它的走法。` })
        }
        return
      }

      if (s.goal.type === 'mate') {
        if (useBoard.getState().game.isCheckmate()) {
          setSolved(true)
          solvedRef.current = true
          setFeedback({
            tone: 'good',
            text: '将杀！城堡封住了第 8 行，黑国王没有一格可以走。这就是“底线杀”。',
          })
        } else {
          setAttempts((a) => a + 1)
          setFeedback({ tone: 'bad', text: '这一步还不是将杀。再看看黑国王的退路：它被自己的兵堵住了哪一行？' })
          useBoard.getState().setLocked(true)
          addTimer(() => {
            if (!solvedRef.current) useBoard.getState().undo()
            useBoard.getState().setLocked(false)
          }, 900)
        }
        return
      }

      if (s.goal.type === 'move') {
        if (s.autoReply) {
          useBoard.getState().setLocked(true)
          setFeedback({ tone: 'info', text: '走对了。看黑方怎么回应……' })
          addTimer(() => {
            useBoard.getState().autoMove(s.autoReply!)
            useBoard.getState().setLocked(false)
            setSolved(true)
            solvedRef.current = true
            setFeedback({ tone: 'good', text: '这一步完成了。读一下右边的解释，再继续。' })
          }, 800)
        } else {
          setSolved(true)
          solvedRef.current = true
          if (useBoard.getState().game.isCheckmate()) {
            setFeedback({ tone: 'good', text: '将杀完成！你赢了这一盘。' })
          } else {
            setFeedback({ tone: 'good', text: '走对了。' })
          }
        }
      }
    },
    [addTimer, markSeen],
  )

  const handleSquareClick = useCallback((square: string) => {
    const s = stepRef.current
    if (!s || s.goal.type !== 'click') return
    if (s.goal.squares?.includes(square)) {
      setSolved(true)
      solvedRef.current = true
      setFeedback({
        tone: 'good',
        text: '找到了。c3 的骑士一动，b4 的黑主教就会直接攻击 e1 的国王，所以它被“钉”在原地。',
      })
    } else {
      setFeedback({ tone: 'bad', text: '不是这一枚。沿着黑主教 b4 与白国王 e1 之间的斜线看，哪枚棋子在中间？' })
    }
  }, [])

  const handleSelect = useCallback((info: SelectInfo) => {
    const s = stepRef.current
    if (!s || s.goal.type !== 'inspect') return
    const entry = s.tour?.find((t) => t.type === info.type)
    const name = entry?.name ?? PIECE_NAMES[info.type as PieceType]?.zh ?? info.type
    if (info.targets.length === 0) {
      setFeedback({ tone: 'info', text: `${name}（${entry?.en ?? ''}）在 ${info.square}，现在被自己的兵挡住了。先把挡在它前面的兵走开，再点它就能看到走法。` })
    } else {
      setFeedback({ tone: 'info', text: `${name}（${entry?.en ?? ''}）在 ${info.square}。绿色圆点/圆环就是它现在能去的位置。` })
    }
  }, [])

  useEffect(() => {
    if (!step) return
    useBoard.getState().setCallbacks({
      onMove: handleMove,
      onClickSquare: handleSquareClick,
      onSelect: handleSelect,
      onReject: () => {
        setFeedback({ tone: 'bad', text: '这一步不在教学线上。跟着高亮的提示走，会更容易理解。' })
      },
    })
    return () => useBoard.getState().setCallbacks({ onMove: null, onClickSquare: null, onSelect: null, onReject: null })
  }, [step?.id, handleMove, handleSquareClick, handleSelect])

  const runDemo = (demo: DemoSpec) => {
    clearTimers()
    setActiveDemo(demo.id)
    setDemoRunning(true)
    setFeedback({ tone: 'info', text: '演示进行中，看棋子怎么走。' })
    useBoard.getState().loadPosition(demo.fen, {
      mode: 'lesson',
      orientation: 'w',
      interaction: 'none',
      highlights: demo.highlights ?? [],
      arrows: demo.arrows ?? [],
      focus: demo.focus ?? null,
    })

    let delay = 900
    demo.moves.forEach((m, i) => {
      addTimer(() => {
        useBoard.getState().autoMove(m)
        if (i === demo.moves.length - 1) {
          setDemoRunning(false)
          setFeedback({ tone: 'info', text: demo.text })
          markSeen(demo.id)
        }
      }, delay)
      delay += 850
    })
  }

  const handleTour = (piece: TourPiece) => {
    useBoard.getState().setVisuals({ focus: piece.square, highlights: [piece.square] })
    if (step?.goal.type === 'inspect') {
      useBoard.getState().clickSquare(piece.square as any)
      // inspect 通过实际移动棋子计分，点击列表只做聚焦辅助
    } else {
      markSeen(piece.type)
    }
  }

  const goNext = () => {
    if (!level) return
    clearTimers()
    if (index >= level.steps.length - 1) {
      markStep(level.id, level.steps.length)
      completeLevel(level.id)
      setShowComplete(true)
      return
    }
    setIndex(index + 1)
  }

  const restartPosition = () => {
    if (!step) return
    useBoard.getState().loadPosition(step.fen, {
      mode: 'lesson',
      orientation: step.orientation ?? 'w',
      interaction: step.goal.type === 'click' ? 'click' : step.goal.type === 'inspect' ? 'free' : 'move',
      allowedMoves: step.allowedMoves ?? null,
      highlights: step.highlights ?? [],
      arrows: step.arrows ?? [],
      focus: step.focus ?? null,
    })
    setFeedback({ tone: 'info', text: '局面已还原，再试一次。' })
    setAttempts(0)
  }

  useEffect(() => () => clearTimers(), [clearTimers])

  if (!level) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="kicker">COMING SOON</p>
        <h1 className="mt-3 font-serif text-3xl text-white">这个段位还没有开放</h1>
        <p className="mt-3 text-sm text-slate-500">返回段位地图，先从 Level 10 开始。</p>
        <Link to="/" className="btn mt-6">
          返回地图
        </Link>
      </main>
    )
  }

  if (!step) return null

  const isLast = index >= level.steps.length - 1
  const nextLevel = level.id > 1 ? level.id - 1 : undefined
  const goalText = goalDescription(step)

  return (
    <>
      <main className="mx-auto grid w-full max-w-6xl gap-5 px-4 pb-8 pt-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-5">
        <section className="flex min-h-[46vh] flex-col gap-4 lg:min-h-[calc(100vh-8.5rem)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-sm text-slate-500 transition hover:text-white">
                ← 地图
              </Link>
              <span className="chip" style={{ borderColor: `${level.accent}55`, color: level.accent }}>
                Level {level.id}
              </span>
              <span className="hidden text-sm text-slate-400 sm:block">{level.title}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-500">
                第 {index + 1} / {level.steps.length} 步
              </span>
              <ProgressDots total={level.steps.length} current={index} />
            </div>
          </div>
          <BoardStage className="min-h-[46vh] flex-1 lg:min-h-0" />
        </section>

        <aside className="panel flex max-h-[calc(100vh-5.5rem)] flex-col overflow-hidden">
          <div className="border-b border-line/60 px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <p className="kicker">{step.kicker ?? `Step ${index + 1}`}</p>
              <button onClick={restartPosition} className="text-[11px] text-slate-500 transition hover:text-brass">
                还原本步
              </button>
            </div>
            <h1 className="mt-2 font-serif text-2xl leading-snug text-white">{step.title}</h1>
            {goalText && <p className="mt-2 text-xs text-slate-500">{goalText}</p>}
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            <div className="lesson-text">
              {step.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {step.goal.type === 'tour' && step.tour && (
              <div className="mt-5 grid grid-cols-2 gap-2">
                {step.tour.map((t) => {
                  const active = seen.includes(t.type)
                  return (
                    <button
                      key={t.type}
                      onClick={() => handleTour(t)}
                      className={`rounded-xl border px-3 py-2.5 text-left transition ${
                        active ? 'border-mint/50 bg-mint/10' : 'border-line bg-white/[0.02] hover:border-brass/50'
                      }`}
                    >
                      <span className="block text-sm font-medium text-slate-100">{t.name}</span>
                      <span className="mt-0.5 block text-[10px] uppercase tracking-wider text-slate-500">{t.en}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {step.goal.type === 'inspect' && step.tour && (
              <div className="mt-5 space-y-2">
                {step.tour.map((t) => {
                  const active = seen.includes(t.type)
                  return (
                    <button
                      key={t.type}
                      onClick={() => handleTour(t)}
                      className={`flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                        active ? 'border-mint/50 bg-mint/10' : 'border-line bg-white/[0.02] hover:border-brass/50'
                      }`}
                    >
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-line text-sm">
                        {tourGlyph[t.type]}
                      </span>
                      <span>
                        <span className="text-sm font-medium text-slate-100">
                          {t.name} <span className="text-[10px] font-normal text-slate-500">{t.en} · {t.square}</span>
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate-400">{t.note}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            )}

            {step.demos && (step.goal.type === 'demos' || step.goal.type === 'quiz') && (
              <div className="mt-5 space-y-2">
                {step.demos.map((d) => {
                  const active = seen.includes(d.id)
                  return (
                    <button
                      key={d.id}
                      onClick={() => runDemo(d)}
                      disabled={demoRunning}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition disabled:opacity-60 ${
                        activeDemo === d.id ? 'border-brass/60 bg-brass/10' : active ? 'border-mint/40' : 'border-line bg-white/[0.02] hover:border-brass/50'
                      }`}
                    >
                      <span>
                        <span className="block text-sm text-slate-100">{d.label}</span>
                        <span className="mt-0.5 block text-[11px] text-slate-500">{d.moves.length} 步自动演示</span>
                      </span>
                      <span className="text-xs text-slate-400">{active ? '已看' : '▶ 播放'}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {step.quiz && (
              <div className="mt-5 space-y-2">
                <p className="text-sm font-medium text-slate-200">{step.quiz.question}</p>
                {step.quiz.options.map((o, i) => {
                  const picked = quizPick === i
                  const state = picked ? (o.correct ? 'border-mint/60 bg-mint/10' : 'border-red-400/50 bg-red-400/5') : 'border-line bg-white/[0.02] hover:border-brass/50'
                  return (
                    <button
                      key={i}
                      onClick={() => handleQuiz(i)}
                      className={`block w-full rounded-xl border px-3 py-2.5 text-left text-sm text-slate-300 transition ${state}`}
                    >
                      <span className="mr-2 text-xs text-slate-500">{String.fromCharCode(65 + i)}.</span>
                      {o.label}
                    </button>
                  )
                })}
              </div>
            )}

            {step.goal.type === 'review' && step.reviewId && (
              <div className="mt-5 rounded-xl border border-brass/30 bg-brass/5 p-4">
                <p className="text-sm text-slate-300">进入复盘模式，逐步播放名局，并在关键节点回答一个问题。</p>
                <button className="btn btn-primary mt-3 w-full" onClick={() => navigate(`/review/${step.reviewId}`)}>
                  {reviewsDone.includes(step.reviewId) ? '再打开复盘' : '打开复盘 →'}
                </button>
                {reviewsDone.includes(step.reviewId) && <p className="mt-2 text-center text-xs text-mint">已记录完成</p>}
              </div>
            )}

            {step.hint && <p className="mt-5 rounded-xl border border-line/70 bg-white/[0.02] px-3 py-2.5 text-xs leading-5 text-slate-400">{step.hint}</p>}

            {feedback && (
              <div
                className={`mt-4 rounded-xl border px-3 py-3 text-sm leading-6 ${
                  feedback.tone === 'good'
                    ? 'border-mint/40 bg-mint/5 text-mint'
                    : feedback.tone === 'bad'
                      ? 'border-red-400/40 bg-red-400/5 text-red-300'
                      : 'border-line bg-white/[0.02] text-slate-400'
                }`}
              >
                {feedback.text}
                {step.goal.type === 'mate' && attempts >= 2 && !solved && (
                  <button className="mt-2 block text-xs text-brass underline-offset-2 hover:underline" onClick={restartPosition}>
                    还原局面再试
                  </button>
                )}
              </div>
            )}

            {step.toolCard && solved && (
              <div className="mt-5 rounded-xl border border-brass/40 bg-brass/5 p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-brass">思维工具</p>
                <p className="mt-1 text-sm font-medium text-white">{step.toolCard.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">{step.toolCard.body}</p>
              </div>
            )}
          </div>

          <div className="border-t border-line/60 px-5 py-4">
            <button
              className={`btn w-full py-3 ${solved ? 'btn-primary' : ''}`}
              disabled={!solved}
              onClick={goNext}
            >
              {isLast ? (solved ? '完成这个段位' : '完成本步后解锁') : solved ? '下一步 →' : '完成本步后继续'}
            </button>
            {!solved && step.goal.type !== 'next' && (
              <p className="mt-2 text-center text-[11px] text-slate-600">先完成上面的任务，按钮才会亮起。</p>
            )}
          </div>
        </aside>
      </main>

      <ResultModal
        open={showComplete}
        title={`Level ${level.id} 完成`}
        text={level.completionText}
        nextLevel={nextLevel}
        onClose={() => setShowComplete(false)}
      />
    </>
  )
}

const tourGlyph: Record<string, string> = {
  p: '♟',
  n: '♞',
  b: '♝',
  r: '♜',
  q: '♛',
  k: '♚',
}

function goalDescription(step: LessonStep): string {
  switch (step.goal.type) {
    case 'move':
      return '任务：在棋盘上走出教学线中的着法'
    case 'mate':
      return '任务：找出一步将杀'
    case 'click':
      return '任务：在棋盘上点出正确的格子'
    case 'quiz':
      return '任务：回答下面的问题'
    case 'tour':
      return '任务：依次查看每一种棋子'
    case 'inspect':
      return '任务：移动六种棋子，各走一次'
    case 'demos':
      return '任务：观看并理解每个演示'
    case 'review':
      return '任务：完成这盘名局的复盘'
    default:
      return ''
  }
}
