import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BoardStage } from '../components/BoardStage'
import { getReview, REVIEWS } from '../data/reviews'
import { annotationFor, parseReview } from '../lib/pgn'
import { useBoard } from '../store/board'
import { useProgress } from '../store/progress'

export function ReviewPage() {
  const { reviewId } = useParams()
  const navigate = useNavigate()
  const review = reviewId ? getReview(reviewId) : undefined

  const parsed = useMemo(() => (review ? parseReview(review) : null), [review])
  const [ply, setPly] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [answered, setAnswered] = useState<number[]>([])
  const [pick, setPick] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{ tone: 'good' | 'bad'; text: string } | null>(null)
  const [finished, setFinished] = useState(false)

  const reviewsDone = useProgress((s) => s.reviewsDone)
  const markReview = useProgress((s) => s.markReview)

  useEffect(() => {
    setPly(0)
    setPlaying(false)
    setAnswered([])
    setPick(null)
    setFeedback(null)
    setFinished(false)
  }, [reviewId])

  const annotation = review ? annotationFor(review, ply) : undefined
  const question = review?.questions.find((q) => q.ply === ply)
  const hasQuestion = Boolean(question)
  const questionAnswered = Boolean(question && answered.includes(ply))

  useEffect(() => {
    if (!parsed || !parsed) return
    const fen = ply === 0 ? parsed.startFen : parsed.plies[ply - 1]?.fen ?? parsed.startFen
    const prev = ply > 0 ? parsed.plies[ply - 1] : null
    useBoard.getState().loadPosition(fen, {
      mode: 'review',
      interaction: 'none',
      orientation: 'w',
      highlights: annotation?.highlights ?? [],
      arrows: annotation?.arrows ?? [],
      focus: annotation?.arrows?.[0]?.to ?? null,
      lastMove: prev
        ? {
            from: prev.from as any,
            to: prev.to as any,
            san: prev.san,
            color: prev.color,
            piece: prev.piece,
            captured: prev.captured,
            flags: prev.flags,
          }
        : null,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ply, reviewId, parsed])

  useEffect(() => {
    if (!playing || !parsed) return
    if (ply >= parsed.plies.length) {
      setPlaying(false)
      return
    }
    if (question && !questionAnswered) {
      setPlaying(false)
      return
    }
    const t = window.setTimeout(() => setPly((p) => p + 1), 1400)
    return () => window.clearTimeout(t)
  }, [playing, ply, parsed, question, questionAnswered])

  if (!review || !parsed) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="kicker">NOT FOUND</p>
        <h1 className="mt-3 font-serif text-3xl text-white">找不到这盘复盘</h1>
        <p className="mt-3 text-sm text-slate-500">可选复盘：{REVIEWS.map((r) => r.player).join('、')}</p>
        <Link to="/" className="btn mt-6">
          返回地图
        </Link>
      </main>
    )
  }

  const total = parsed.plies.length
  const atEnd = ply >= total
  const canFinish = atEnd && answered.length >= review.questions.length

  const answer = (i: number) => {
    const opt = question?.options[i]
    if (!opt) return
    setPick(i)
    if (opt.correct) {
      setAnswered((a) => (a.includes(ply) ? a : [...a, ply]))
      setFeedback({ tone: 'good', text: opt.feedback })
    } else {
      setFeedback({ tone: 'bad', text: opt.feedback })
    }
  }

  const finish = () => {
    markReview(review.id)
    setFinished(true)
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-5 px-4 pb-8 pt-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-5">
      <section className="flex min-h-[46vh] flex-col gap-4 lg:min-h-[calc(100vh-8.5rem)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to={`/level/${review.levelId}`} className="text-sm text-slate-500 transition hover:text-white">
              ← Level {review.levelId}
            </Link>
            <span className="chip border-brass/40 text-brass">名局复盘</span>
            <span className="hidden text-sm text-slate-400 sm:block">
              {review.player} · {review.title}
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            {ply} / {total} 半步
          </span>
        </div>
        <BoardStage className="min-h-[46vh] flex-1 lg:min-h-0" />
      </section>

      <aside className="panel flex max-h-[calc(100vh-5.5rem)] flex-col overflow-hidden">
        <div className="border-b border-line/60 px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="kicker">{review.playerEn}</p>
            <span className="chip">{review.modelEn}</span>
          </div>
          <h1 className="mt-2 font-serif text-2xl leading-snug text-white">{review.title}</h1>
          <p className="mt-1 text-xs text-slate-500">
            {review.subtitle} · 思维模型：{review.model}
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {ply === 0 && <p className="text-sm leading-6 text-slate-400">{review.summary[0]}</p>}

          {ply > 0 && (
            <div className="mb-4 flex items-baseline gap-3 rounded-xl border border-line/70 bg-white/[0.02] px-3 py-2.5">
              <span className="font-mono text-xs text-brass">
                {Math.ceil(ply / 2)}
                {ply % 2 === 1 ? '.' : '…'}
              </span>
              <span className="font-mono text-lg text-white">{parsed.plies[ply - 1]?.san}</span>
              {annotation?.tag && <span className="ml-auto text-[10px] text-mint">{annotation.tag}</span>}
            </div>
          )}

          <div className="lesson-text">
            <p>{annotation?.text ?? '这一步没有额外的战术讲解。保持你的计划，继续看下一步。'}</p>
          </div>

          {question && (
            <div className="mt-5 rounded-2xl border border-brass/30 bg-brass/5 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.2em] text-brass">暂停判断</p>
                {questionAnswered && <span className="chip border-mint/40 text-mint">已答对</span>}
              </div>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-100">{question.question}</p>
              <div className="mt-3 space-y-2">
                {question.options.map((o, i) => {
                  const picked = pick === i
                  const state = picked ? (o.correct ? 'border-mint/60 bg-mint/10' : 'border-red-400/50 bg-red-400/5') : 'border-line bg-white/[0.02] hover:border-brass/50'
                  return (
                    <button
                      key={i}
                      disabled={questionAnswered}
                      onClick={() => answer(i)}
                      className={`block w-full rounded-xl border px-3 py-2.5 text-left text-xs leading-5 text-slate-300 transition disabled:opacity-80 ${state}`}
                    >
                      <span className="mr-2 text-slate-500">{String.fromCharCode(65 + i)}.</span>
                      {o.label}
                    </button>
                  )
                })}
              </div>
              {feedback && (
                <p className={`mt-3 rounded-lg px-3 py-2 text-xs leading-5 ${feedback.tone === 'good' ? 'bg-mint/10 text-mint' : 'bg-red-400/10 text-red-300'}`}>
                  {feedback.text}
                </p>
              )}
            </div>
          )}

          {canFinish && !finished && (
            <div className="mt-5 rounded-2xl border border-mint/30 bg-mint/5 p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-mint">REVIEW COMPLETE</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{review.summary[1] ?? review.summary[0]}</p>
              <button className="btn btn-mint mt-3 w-full" onClick={finish}>
                完成复盘，返回 Level {review.levelId}
              </button>
            </div>
          )}

          {finished && (
            <div className="mt-5 rounded-2xl border border-mint/40 bg-mint/5 p-4">
              <p className="text-sm font-medium text-white">复盘完成</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">思维模型已记录。回到段位，完成最后的总结题。</p>
              <button className="btn btn-mint mt-3 w-full" onClick={() => navigate(`/level/${review.levelId}`)}>
                返回 Level {review.levelId}
              </button>
            </div>
          )}

          <div className="mt-6 border-t border-line/60 pt-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">Move list</p>
            <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs">
              {parsed.plies.map((p, i) => {
                const pIndex = i + 1
                const active = pIndex === ply
                return (
                  <button
                    key={i}
                    onClick={() => setPly(pIndex)}
                    className={`rounded px-1.5 py-0.5 transition ${active ? 'bg-brass text-ink' : 'text-slate-500 hover:text-white'}`}
                  >
                    {pIndex % 2 === 1 ? `${Math.ceil(pIndex / 2)}.` : ''}
                    {p.san}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-line/60 px-4 py-3">
          <div className="flex items-center justify-center gap-2">
            <button className="btn px-3" onClick={() => setPly(0)} disabled={ply === 0} title="回到开局">
              ⏮
            </button>
            <button className="btn px-3" onClick={() => setPly((p) => Math.max(0, p - 1))} disabled={ply === 0}>
              ◀
            </button>
            <button
              className={`btn px-4 ${playing ? 'btn-mint' : ''}`}
              onClick={() => setPlaying((p) => !p)}
              disabled={atEnd || (question ? !questionAnswered : false)}
            >
              {playing ? '暂停' : '自动播放'}
            </button>
            <button
              className="btn px-3"
              onClick={() => setPly((p) => Math.min(total, p + 1))}
              disabled={atEnd || (question ? !questionAnswered : false)}
            >
              ▶
            </button>
            <button className="btn px-3" onClick={() => setPly(total)} disabled={atEnd} title="跳到结尾">
              ⏭
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-slate-600">
            {hasQuestion && !questionAnswered ? '先回答“暂停判断”才能继续' : reviewsDone.includes(review.id) ? '这盘棋已复盘过，可重复观看' : '每步都有一句解释'}
          </p>
        </div>
      </aside>
    </main>
  )
}
