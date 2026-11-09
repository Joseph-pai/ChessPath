import { Chess, type Move } from 'chess.js'
import { PIECE_NAMES } from './chessEngine'
import { bestMove } from './ai'
import type { PieceColor, PieceType } from '../types'

const VALUES: Record<string, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 }

const CENTER_SQUARES = [
  'd4', 'e4', 'd5', 'e5',
  'c4', 'f4', 'c5', 'f5',
  'c3', 'f3', 'c6', 'f6',
  'd3', 'e3', 'd6', 'e6',
]

export interface CoachMove {
  san: string
  from: string
  to: string
  piece: PieceType
  why: string
}

export interface CoachPlan {
  /** 推荐给玩家的着法 */
  recommend: CoachMove | null
  /** 玩家走了推荐着法后，对方最可能的回应 */
  opponentReply: CoachMove | null
  /** 本阶段的策略要点 */
  tips: string[]
}

const pieceName = (t: string) => PIECE_NAMES[t as PieceType]?.zh ?? t

function isBackRank(m: Move): boolean {
  return m.color === 'w' ? m.from[1] === '1' : m.from[1] === '8'
}

function isDeveloping(m: Move): boolean {
  return isBackRank(m) && (m.piece === 'n' || m.piece === 'b' || m.piece === 'r' || m.piece === 'q')
}

function isCenter(square: string): boolean {
  return CENTER_SQUARES.includes(square)
}

/** 把一个着法翻译成初学者能读懂的一句话解释。 */
export function explainMove(m: Move): string {
  const bits: string[] = []

  if (m.san.includes('#')) bits.push('直接将杀，对局结束')
  else if (m.san.includes('+')) bits.push('同时将军，逼对方先来应对')

  if (m.flags.includes('k') || m.flags.includes('q')) bits.push('易位一次完成保护国王和出动城堡')
  else if (m.flags.includes('p')) bits.push('兵升变，换成更强的棋子')

  if (m.captured) bits.push(`顺势吃掉对方的${pieceName(m.captured)}`)

  if (bits.length === 0) {
    if (isDeveloping(m)) bits.push('把子力从底线移到战场，这就是出子')
    else if (isCenter(m.to)) bits.push('占住中心格，能控制更多路线')
    else if (m.piece === 'p') bits.push('推进兵，给后面的子力腾出线路')
    else bits.push('调整位置，为下一步做准备')
  }

  return `${pieceName(m.piece)} ${m.from}→${m.to}：${bits.join('；')}。`
}

function moveFromSan(fen: string, san: string): Move | null {
  try {
    return new Chess(fen).move(san) as Move
  } catch {
    return null
  }
}

/** 预测入门级 AI 最可能回应的一步：优先吃子、将军、出子与控制中心。 */
function predictReply(fen: string): CoachMove | null {
  let chess: Chess
  try {
    chess = new Chess(fen)
  } catch {
    return null
  }
  const legal = chess.moves({ verbose: true }) as Move[]
  if (!legal.length) return null

  let best: Move | null = null
  let bestScore = -Infinity
  for (const m of legal) {
    let s = 0
    if (m.captured) s += 40 + (VALUES[m.captured] ?? 0) / 8
    if (m.san.includes('#')) s += 300
    else if (m.san.includes('+')) s += 30
    if (isDeveloping(m)) s += 14
    if (isCenter(m.to)) s += 10
    if (m.piece === 'p' && m.flags.includes('n')) s -= 5
    if (m.piece === 'q' && isBackRank(m)) s -= 5

    if (best === null || s > bestScore || (s === bestScore && m.san < best.san)) {
      best = m
      bestScore = s
    }
  }
  if (!best) return null
  return { san: best.san, from: best.from, to: best.to, piece: best.piece as PieceType, why: explainMove(best) }
}

function countDeveloped(chess: Chess, color: PieceColor): number {
  const back = color === 'w' ? '1' : '8'
  let n = 0
  for (const row of chess.board()) {
    for (const cell of row) {
      if (!cell || cell.color !== color) continue
      if (cell.type !== 'n' && cell.type !== 'b') continue
      if (cell.square[1] !== back) n++
    }
  }
  return n
}

function tipsFor(chess: Chess, color: PieceColor): string[] {
  const tips: string[] = []
  if (chess.isCheck()) tips.push('你正被将军：必须先把国王移开、挡住或吃掉将军的棋子。')

  const fullmove = Number(chess.fen().split(' ')[5] || '1') || 1
  if (fullmove <= 10) {
    tips.push('开局先做三件事：出子 → 占住中心 → 尽早易位保护国王。')
    const n = Math.min(countDeveloped(chess, color), 4)
    tips.push(`你已经出动 ${n}/4 个骑士与主教；先把轻子全部动起来，再考虑皇后。`)
  } else {
    tips.push('每一步先问：对手上一步想干什么？他最想占哪个格？')
    tips.push('先检查有没有白吃的子或将军，再去找安静的好棋。')
  }
  return tips.slice(0, 3)
}

/** 为当前轮到的玩家生成「推荐着法 + 对方可能应对 + 策略要点」。 */
export function coachPlan(fen: string, color: PieceColor): CoachPlan {
  const empty: CoachPlan = { recommend: null, opponentReply: null, tips: [] }

  let chess: Chess
  try {
    chess = new Chess(fen)
  } catch {
    return empty
  }

  const tips = tipsFor(chess, color)
  if (chess.turn() !== color || chess.isGameOver()) return { ...empty, tips }

  const best = bestMove(fen, 2)
  if (!best) return { ...empty, tips }

  const rec = moveFromSan(fen, best.san)
  if (!rec) return { ...empty, tips }

  let afterFen = fen
  try {
    const after = new Chess(fen)
    after.move(best.san)
    afterFen = after.fen()
  } catch {
    // 保持原局面
  }

  return {
    recommend: { san: rec.san, from: rec.from, to: rec.to, piece: rec.piece as PieceType, why: explainMove(rec) },
    opponentReply: predictReply(afterFen),
    tips,
  }
}
