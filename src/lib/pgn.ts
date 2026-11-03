import { Chess } from 'chess.js'
import { START_FEN } from './chessEngine'
import type { PieceColor, PieceType, Review } from '../types'

export interface ParsedPly {
  san: string
  from: string
  to: string
  fen: string
  color: PieceColor
  piece: PieceType
  captured?: string
  flags: string
}

export interface ParsedReview {
  startFen: string
  plies: ParsedPly[]
}

export function parseReview(review: Review): ParsedReview {
  const startFen = review.startFen || START_FEN
  const source = new Chess(startFen)
  source.loadPgn(review.pgn)
  const sans = source.history()

  const replay = new Chess(startFen)
  const plies: ParsedPly[] = sans.map((san) => {
    const move = replay.move(san)
    return {
      san: move.san,
      from: move.from,
      to: move.to,
      fen: replay.fen(),
      color: move.color as PieceColor,
      piece: move.piece as PieceType,
      captured: move.captured,
      flags: move.flags,
    }
  })

  return { startFen, plies }
}

export function fenAtPly(pgn: string, ply: number, startFen?: string): string {
  const base = startFen || START_FEN
  const chess = new Chess(base)
  chess.loadPgn(pgn)
  const sans = chess.history()
  const replay = new Chess(base)
  for (let i = 0; i < Math.min(ply, sans.length); i++) replay.move(sans[i])
  return replay.fen()
}

export function annotationFor(review: Review, ply: number) {
  return review.annotations.find((a) => a.ply === ply)
}
