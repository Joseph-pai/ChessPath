import { create } from 'zustand'
import { Chess, type Move, type Square } from 'chess.js'
import { START_FEN } from '../lib/chessEngine'
import type { ArrowSpec, PieceColor } from '../types'

export type BoardMode = 'lesson' | 'play' | 'review'
export type Interaction = 'move' | 'click' | 'none' | 'free'

export interface MoveInfo {
  from: Square
  to: Square
  san: string
  color: PieceColor
  piece: string
  captured?: string
  flags: string
  promotion?: string
}

export interface SelectInfo {
  square: Square
  type: string
  color: PieceColor
  targets: Square[]
}

interface LoadOptions {
  mode?: BoardMode
  interaction?: Interaction
  allowedMoves?: string[] | null
  orientation?: PieceColor
  highlights?: string[]
  arrows?: ArrowSpec[]
  focus?: string | null
  locked?: boolean
  lastMove?: MoveInfo | null
}

interface BoardStore {
  game: Chess
  fen: string
  mode: BoardMode
  interaction: Interaction
  allowedMoves: string[] | null
  orientation: PieceColor
  selected: Square | null
  legalTargets: Square[]
  lastMove: MoveInfo | null
  moveSeq: number
  highlights: string[]
  arrows: ArrowSpec[]
  focusSquare: string | null
  focusSeq: number
  locked: boolean
  onMove: ((move: Move) => void) | null
  onClickSquare: ((square: Square) => void) | null
  onReject: ((reason: string) => void) | null
  onSelect: ((info: SelectInfo) => void) | null

  loadPosition: (fen: string, options?: LoadOptions) => void
  resetVisuals: () => void
  setVisuals: (v: { highlights?: string[]; arrows?: ArrowSpec[]; focus?: string | null }) => void
  setInteraction: (i: Interaction, allowedMoves?: string[] | null) => void
  setOrientation: (c: PieceColor) => void
  setLocked: (v: boolean) => void
  setCallbacks: (cbs: {
    onMove?: ((move: Move) => void) | null
    onClickSquare?: ((square: Square) => void) | null
    onReject?: ((reason: string) => void) | null
    onSelect?: ((info: SelectInfo) => void) | null
  }) => void
  clickSquare: (square: Square) => void
  tryMove: (from: Square, to: Square) => Move | null
  autoMove: (sanOrUci: string) => Move | null
  undo: () => void
}

const makeGame = (fen?: string) => {
  if (!fen) return new Chess()
  try {
    return new Chess(fen)
  } catch {
    return new Chess()
  }
}

const toMoveInfo = (move: Move): MoveInfo => ({
  from: move.from as Square,
  to: move.to as Square,
  san: move.san,
  color: move.color as PieceColor,
  piece: move.piece,
  captured: move.captured,
  flags: move.flags,
  promotion: move.promotion,
})

/** 把局面强制设为指定颜色行棋（用于自由摆子演示，去掉吃过路兵标记）。 */
function withTurn(fen: string, color: PieceColor): Chess {
  const parts = fen.split(' ')
  parts[1] = color
  parts[3] = '-'
  return new Chess(parts.join(' '))
}

export const useBoard = create<BoardStore>((set, get) => ({
  game: makeGame(),
  fen: START_FEN,
  mode: 'lesson',
  interaction: 'move',
  allowedMoves: null,
  orientation: 'w',
  selected: null,
  legalTargets: [],
  lastMove: null,
  moveSeq: 0,
  highlights: [],
  arrows: [],
  focusSquare: null,
  focusSeq: 0,
  locked: false,
  onMove: null,
  onClickSquare: null,
  onReject: null,
  onSelect: null,

  loadPosition: (fen, options = {}) => {
    const game = makeGame(fen)
    set({
      game,
      fen: game.fen(),
      mode: options.mode ?? 'lesson',
      interaction: options.interaction ?? 'move',
      allowedMoves: options.allowedMoves ?? null,
      orientation: options.orientation ?? get().orientation,
      highlights: options.highlights ?? [],
      arrows: options.arrows ?? [],
      focusSquare: options.focus ?? null,
      focusSeq: get().focusSeq + (options.focus ? 1 : 0),
      locked: options.locked ?? false,
      lastMove: options.lastMove ?? null,
      selected: null,
      legalTargets: [],
    })
  },

  resetVisuals: () => set({ selected: null, legalTargets: [], highlights: [], arrows: [], focusSquare: null, lastMove: null }),

  setVisuals: ({ highlights, arrows, focus }) =>
    set((s) => ({
      highlights: highlights ?? s.highlights,
      arrows: arrows ?? s.arrows,
      focusSquare: focus === undefined ? s.focusSquare : focus,
      focusSeq: focus === undefined ? s.focusSeq : s.focusSeq + 1,
    })),

  setInteraction: (interaction, allowedMoves = null) => set({ interaction, allowedMoves, selected: null, legalTargets: [] }),

  setOrientation: (orientation) => set({ orientation }),

  setLocked: (locked) => set({ locked }),

  setCallbacks: (cbs) =>
    set({
      onMove: cbs.onMove === undefined ? get().onMove : cbs.onMove,
      onClickSquare: cbs.onClickSquare === undefined ? get().onClickSquare : cbs.onClickSquare,
      onReject: cbs.onReject === undefined ? get().onReject : cbs.onReject,
      onSelect: cbs.onSelect === undefined ? get().onSelect : cbs.onSelect,
    }),

  clickSquare: (square) => {
    const { interaction, locked, onClickSquare } = get()
    if (locked) return
    if (interaction === 'click') {
      onClickSquare?.(square)
      return
    }
    if (interaction !== 'move' && interaction !== 'free') return

    const { game, selected, legalTargets, orientation } = get()
    if (selected && legalTargets.includes(square)) {
      get().tryMove(selected, square)
      return
    }
    const piece = game.get(square)

    if (interaction === 'free') {
      if (piece && piece.color === orientation) {
        const g = withTurn(game.fen(), orientation)
        const moves = g.moves({ square, verbose: true }).map((m) => m.to as Square)
        set({ selected: square, legalTargets: moves })
        get().onSelect?.({ square, type: piece.type, color: piece.color as PieceColor, targets: moves })
      } else {
        set({ selected: null, legalTargets: [] })
      }
      return
    }

    if (piece && piece.color === game.turn()) {
      const moves = game.moves({ square, verbose: true })
      set({ selected: square, legalTargets: moves.map((m) => m.to as Square) })
    } else {
      set({ selected: null, legalTargets: [] })
    }
  },

  tryMove: (from, to) => {
    const { game, allowedMoves, interaction, locked, onReject, orientation } = get()
    if (locked || (interaction !== 'move' && interaction !== 'free')) return null
    if (allowedMoves && !allowedMoves.includes(`${from}${to}`)) {
      onReject?.('教学线之外')
      set({ selected: null, legalTargets: [] })
      return null
    }

    if (interaction === 'free') {
      const g = withTurn(game.fen(), orientation)
      let move: Move
      try {
        move = g.move({ from, to, promotion: 'q' })
      } catch {
        onReject?.('不合法着法')
        set({ selected: null, legalTargets: [] })
        return null
      }
      const next = withTurn(g.fen(), orientation)
      set((s) => ({
        game: next,
        fen: next.fen(),
        selected: null,
        legalTargets: [],
        lastMove: toMoveInfo(move),
        moveSeq: s.moveSeq + 1,
      }))
      get().onMove?.(move)
      return move
    }

    let move: Move
    try {
      move = game.move({ from, to, promotion: 'q' })
    } catch {
      onReject?.('不合法着法')
      set({ selected: null, legalTargets: [] })
      return null
    }
    const fen = game.fen()
    const info = toMoveInfo(move)
    set((s) => ({
      fen,
      selected: null,
      legalTargets: [],
      lastMove: info,
      moveSeq: s.moveSeq + 1,
      allowedMoves: s.mode === 'play' ? null : s.allowedMoves,
    }))
    get().onMove?.(move)
    return move
  },

  autoMove: (input) => {
    const { game } = get()
    let move: Move
    try {
      move = game.move(input)
    } catch {
      try {
        move = game.move({
          from: input.slice(0, 2),
          to: input.slice(2, 4),
          promotion: input.length > 4 ? input[4] : undefined,
        })
      } catch {
        return null
      }
    }
    const fen = game.fen()
    set((s) => ({ fen, lastMove: toMoveInfo(move), moveSeq: s.moveSeq + 1, selected: null, legalTargets: [] }))
    return move
  },

  undo: () => {
    const { game } = get()
    game.undo()
    set({ fen: game.fen(), selected: null, legalTargets: [], lastMove: null })
  },
}))
