export type PieceColor = 'w' | 'b'
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'

export interface ArrowSpec {
  from: string
  to: string
  color?: string
  dashed?: boolean
}

export interface TourPiece {
  square: string
  type: PieceType
  name: string
  en: string
  note: string
}

export interface DemoSpec {
  id: string
  label: string
  fen: string
  /** SAN 着法，逐步播放 */
  moves: string[]
  text: string
  highlights?: string[]
  arrows?: ArrowSpec[]
  focus?: string
}

export interface QuizOption {
  label: string
  correct?: boolean
  feedback: string
}

export interface QuizSpec {
  question: string
  options: QuizOption[]
}

export type GoalType =
  | 'next'
  | 'move'
  | 'mate'
  | 'click'
  | 'quiz'
  | 'tour'
  | 'demos'
  | 'inspect'
  | 'review'

export interface StepGoal {
  type: GoalType
  /** move: UCI 着法白名单，同时用于棋盘限制 */
  moves?: string[]
  /** click: 需要点中的格子 */
  squares?: string[]
  /** tour / demos / inspect: 需要完成的次数 */
  count?: number
  /** review: 关联的复盘 id */
  reviewId?: string
}

export interface LessonStep {
  id: string
  title: string
  kicker?: string
  paragraphs: string[]
  fen: string
  orientation?: PieceColor
  highlights?: string[]
  arrows?: ArrowSpec[]
  focus?: string
  goal: StepGoal
  /** 只允许这些 UCI 着法；不填则仅限制合法着法 */
  allowedMoves?: string[]
  /** 用户走完后自动播放的对手回应（SAN） */
  autoReply?: string
  /** 练习提示 */
  hint?: string
  quiz?: QuizSpec
  tour?: TourPiece[]
  demos?: DemoSpec[]
  /** 完成后的思维工具总结 */
  toolCard?: { title: string; body: string }
  /** 标记为复盘入口步骤 */
  reviewId?: string
}

export interface Level {
  id: number
  title: string
  subtitle: string
  tagline: string
  accent: string
  steps: LessonStep[]
  completionText: string
}

export interface ReviewQuestion {
  ply: number
  question: string
  options: QuizOption[]
}

export interface ReviewAnnotation {
  ply: number
  text: string
  tag?: string
  highlights?: string[]
  arrows?: ArrowSpec[]
}

export interface Review {
  id: string
  levelId: number
  player: string
  playerEn: string
  title: string
  subtitle: string
  model: string
  modelEn: string
  startFen?: string
  pgn: string
  annotations: ReviewAnnotation[]
  questions: ReviewQuestion[]
  summary: string[]
}
