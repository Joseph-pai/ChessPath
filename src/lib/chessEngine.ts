import { Chess, type Move, type Square } from 'chess.js'
import type { PieceColor, PieceType } from '../types'

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

export const PIECE_NAMES: Record<PieceType, { zh: string; en: string }> = {
  p: { zh: '兵', en: 'Pawn' },
  n: { zh: '骑士', en: 'Knight' },
  b: { zh: '主教', en: 'Bishop' },
  r: { zh: '城堡', en: 'Rook' },
  q: { zh: '皇后', en: 'Queen' },
  k: { zh: '国王', en: 'King' },
}

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const

export interface BoardPiece {
  square: Square
  type: PieceType
  color: PieceColor
}

export function parseBoard(fen: string): BoardPiece[] {
  try {
    const chess = new Chess(fen)
    const out: BoardPiece[] = []
    for (const row of chess.board()) {
      for (const cell of row) {
        if (cell) out.push({ square: cell.square as Square, type: cell.type as PieceType, color: cell.color as PieceColor })
      }
    }
    return out
  } catch {
    return []
  }
}

/** 将 a1 这类格子映射到棋盘中心坐标（第 1 行靠白方） */
export function squareToWorld(square: string): [number, number, number] {
  const file = FILES.indexOf(square[0] as (typeof FILES)[number])
  const rank = parseInt(square[1], 10)
  return [file - 3.5, 0, 3.5 - (rank - 1)]
}

export function worldToSquare(x: number, z: number): string | null {
  const file = Math.round(x + 3.5)
  const rank = Math.round(3.5 - z) + 1
  if (file < 0 || file > 7 || rank < 1 || rank > 8) return null
  return `${FILES[file]}${rank}`
}

export function uciOf(move: Pick<Move, 'from' | 'to' | 'promotion'>): string {
  return `${move.from}${move.to}${move.promotion ?? ''}`
}

export function sanOf(fen: string, uci: string): string {
  try {
    const chess = new Chess(fen)
    const move = chess.move({
      from: uci.slice(0, 2),
      to: uci.slice(2, 4),
      promotion: uci.length > 4 ? uci[4] : undefined,
    })
    return move.san
  } catch {
    return uci
  }
}

export function turnOf(fen: string): PieceColor {
  try {
    return new Chess(fen).turn()
  } catch {
    return 'w'
  }
}

export function isCheckmate(fen: string): boolean {
  try {
    return new Chess(fen).isCheckmate()
  } catch {
    return false
  }
}

/** 棋谱着法的中文说明：a2a4 -> a2 → a4 */
export function describeMove(uci: string): string {
  return `${uci.slice(0, 2)} → ${uci.slice(2, 4)}`
}

export function legalTargets(fen: string, square: string): Square[] {
  try {
    const chess = new Chess(fen)
    return chess
      .moves({ square: square as Square, verbose: true })
      .map((m: Move) => m.to as Square)
  } catch {
    return []
  }
}

export function statusText(fen: string): string {
  try {
    const chess = new Chess(fen)
    if (chess.isCheckmate()) return '将杀 · 对局结束'
    if (chess.isStalemate()) return '逼和 · 和棋'
    if (chess.isDraw()) return '和棋'
    if (chess.isCheck()) return '将军！'
    return chess.turn() === 'w' ? '白方行棋' : '黑方行棋'
  } catch {
    return ''
  }
}

