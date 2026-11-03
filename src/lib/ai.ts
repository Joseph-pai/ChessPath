import { Chess, type Move } from 'chess.js'

const VALUES: Record<string, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 }

const PAWN_TABLE = [
  0, 0, 0, 0, 0, 0, 0, 0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5, 5, 10, 25, 25, 10, 5, 5,
  0, 0, 0, 20, 20, 0, 0, 0,
  5, -5, -10, 0, 0, -10, -5, 5,
  5, 10, 10, -20, -20, 10, 10, 5,
  0, 0, 0, 0, 0, 0, 0, 0,
]

const CENTER_TABLE = [
  -20, -10, -10, -10, -10, -10, -10, -20,
  -10, 0, 0, 0, 0, 0, 0, -10,
  -10, 0, 5, 5, 5, 5, 0, -10,
  -10, 0, 5, 10, 10, 5, 0, -10,
  -10, 0, 5, 10, 10, 5, 0, -10,
  -10, 0, 5, 5, 5, 5, 0, -10,
  -10, 0, 0, 0, 0, 0, 0, -10,
  -20, -10, -10, -10, -10, -10, -10, -20,
]

function evaluateSide(chess: Chess): number {
  let score = 0
  const board = chess.board()
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f]
      if (!piece) continue
      let v = VALUES[piece.type] ?? 0
      const idx = r * 8 + f
      if (piece.type === 'p') {
        const relative = piece.color === 'w' ? 7 - r : r
        v += PAWN_TABLE[relative * 8 + f]
      } else if (piece.type !== 'k') {
        v += CENTER_TABLE[idx] * 0.6
      }
      score += piece.color === 'w' ? v : -v
    }
  }
  return score
}

const MATE = 100000

function negamax(chess: Chess, depth: number, alpha: number, beta: number): number {
  if (chess.isCheckmate()) return -MATE + (10 - depth)
  if (chess.isStalemate() || chess.isDraw()) return 0
  if (depth === 0) {
    const whiteScore = evaluateSide(chess)
    return chess.turn() === 'w' ? whiteScore : -whiteScore
  }

  const moves = chess.moves({ verbose: true }) as Move[]
  moves.sort((a, b) => {
    const av = a.captured ? VALUES[a.captured] ?? 0 : 0
    const bv = b.captured ? VALUES[b.captured] ?? 0 : 0
    return bv - av
  })

  let best = -Infinity
  for (const m of moves) {
    chess.move(m.san)
    const score = -negamax(chess, depth - 1, -beta, -alpha)
    chess.undo()
    if (score > best) best = score
    if (score > alpha) alpha = score
    if (alpha >= beta) break
  }
  return best === -Infinity ? 0 : best
}

export interface AiConfig {
  depth: number
  randomness: number
}

export function aiConfigForElo(elo: number): AiConfig {
  if (elo < 900) return { depth: 1, randomness: 0.55 }
  if (elo < 1200) return { depth: 2, randomness: 0.3 }
  if (elo < 1500) return { depth: 2, randomness: 0.12 }
  return { depth: 3, randomness: 0.04 }
}

/** 在给定 FEN 中为当前走子方选择一步棋，返回 SAN。 */
export function chooseMove(fen: string, elo: number): string | null {
  let chess: Chess
  try {
    chess = new Chess(fen)
  } catch {
    return null
  }
  const legal = chess.moves({ verbose: true }) as Move[]
  if (!legal.length) return null

  const cfg = aiConfigForElo(elo)
  if (Math.random() < cfg.randomness) {
    const captures = legal.filter((m) => m.captured)
    const pool = captures.length && Math.random() < 0.55 ? captures : legal
    return pool[Math.floor(Math.random() * pool.length)].san
  }

  let bestScore = -Infinity
  let bestMoves: Move[] = []
  for (const m of legal) {
    chess.move(m.san)
    const score = -negamax(chess, cfg.depth - 1, -Infinity, Infinity)
    chess.undo()
    if (score > bestScore) {
      bestScore = score
      bestMoves = [m]
    } else if (score === bestScore) {
      bestMoves.push(m)
    }
  }
  return bestMoves[Math.floor(Math.random() * bestMoves.length)].san
}
