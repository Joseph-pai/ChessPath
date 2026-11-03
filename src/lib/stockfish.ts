import { Chess, type Move } from 'chess.js'
import { chooseMove as localChooseMove } from './ai'

let workerPromise: Promise<Worker | null> | null = null

function getWorker(): Promise<Worker | null> {
  if (workerPromise) return workerPromise
  workerPromise = new Promise((resolve) => {
    try {
      const w = new Worker('/stockfish/stockfish.js')
      let resolved = false
      const timeout = window.setTimeout(() => {
        if (!resolved) {
          resolved = true
          w.terminate()
          resolve(null)
        }
      }, 10000)
      const onMsg = (e: MessageEvent) => {
        const line = String(e.data).trim()
        if (!resolved) {
          if (line === 'uciok') {
            w.postMessage('isready')
            return
          }
          if (line === 'readyok') {
            resolved = true
            window.clearTimeout(timeout)
            w.removeEventListener('message', onMsg)
            resolve(w)
          }
        }
      }
      w.addEventListener('message', onMsg)
      w.postMessage('uci')
    } catch {
      resolve(null)
    }
  })
  return workerPromise
}

/** 把 Elo 档位映射到 Stockfish UCI_Elo + 思考时间（毫秒）。
 *  Stockfish UCI_Elo 有效下限约为 1320，低于此值的档位退回本地 AI。 */
function sfElo(elo: number): { sfElo: number; movetime: number } | null {
  if (elo <= 1100) return null
  const sf = Math.max(1320, Math.min(3190, Math.round(elo / 10) * 10))
  const movetime = elo < 1400 ? 500 : elo < 1800 ? 1000 : 1600
  return { sfElo: sf, movetime }
}

export interface StockfishResult {
  san: string | null
  engine: 'stockfish' | 'local'
  elo: number
  elapsed: number
}

/** 异步请求一步着法，优先 Stockfish，不可用时回退本地 AI。 */
export async function requestAiMove(fen: string, elo: number): Promise<StockfishResult> {
  const cfg = sfElo(elo)
  const t0 = performance.now()
  const localFallback = (): StockfishResult => {
    const san = localChooseMove(fen, elo)
    return { san, engine: 'local', elo, elapsed: performance.now() - t0 }
  }

  if (!cfg) return localFallback()

  const worker = await getWorker()
  if (!worker) return localFallback()

  const uciMove = await new Promise<string | null>((resolve) => {
    const timer = window.setTimeout(() => {
      worker.removeEventListener('message', onMsg)
      worker.postMessage('stop')
      resolve(null)
    }, cfg.movetime + 1500)

    const onMsg = (e: MessageEvent) => {
      const line: string = String(e.data)
      if (!line.startsWith('bestmove')) return
      window.clearTimeout(timer)
      worker.removeEventListener('message', onMsg)
      resolve(line.split(' ')[1] ?? null)
    }

    worker.addEventListener('message', onMsg)
    worker.postMessage('ucinewgame')
    worker.postMessage('setoption name UCI_LimitStrength value true')
    worker.postMessage(`setoption name UCI_Elo value ${cfg.sfElo}`)
    worker.postMessage(`position fen ${fen}`)
    worker.postMessage(`go movetime ${cfg.movetime}`)
  })

  if (!uciMove) return localFallback()

  const chess = new Chess(fen)
  try {
    const m = chess.move(uciMove, { strict: false }) as Move | null
    if (m && m.san) return { san: m.san, engine: 'stockfish', elo, elapsed: performance.now() - t0 }
    const from = uciMove.slice(0, 2)
    const to = uciMove.slice(2, 4)
    const promotion = uciMove.length > 4 ? uciMove[4] : undefined
    const mv = chess.move({ from, to, promotion } as any)
    if (mv) return { san: mv.san, engine: 'stockfish', elo, elapsed: performance.now() - t0 }
  } catch {
    // fall through
  }
  return localFallback()
}
