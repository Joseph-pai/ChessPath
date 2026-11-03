import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Chess, type Square } from 'chess.js'
import { parseBoard, squareToWorld } from '../lib/chessEngine'
import { useBoard } from '../store/board'

function SquarePlane({ square, color, opacity, y = 0.045 }: { square: string; color: string; opacity: number; y?: number }) {
  const [x, , z] = squareToWorld(square)
  return (
    <mesh position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.98, 0.98]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  )
}

function FocusPulse({ square }: { square: string }) {
  const ref = useRef<THREE.Mesh>(null)
  const [x, , z] = squareToWorld(square)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const s = 1 + 0.08 * Math.sin(t * 3.2)
    if (ref.current) ref.current.scale.set(s, s, 1)
  })
  return (
    <mesh ref={ref} position={[x, 0.06, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.4, 0.46, 44]} />
      <meshBasicMaterial color="#d8b06a" transparent opacity={0.85} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  )
}

export function Highlights() {
  const fen = useBoard((s) => s.fen)
  const highlights = useBoard((s) => s.highlights)
  const selected = useBoard((s) => s.selected)
  const legalTargets = useBoard((s) => s.legalTargets)
  const lastMove = useBoard((s) => s.lastMove)
  const focusSquare = useBoard((s) => s.focusSquare)

  const occupied = useMemo(() => new Set(parseBoard(fen).map((p) => p.square)), [fen])
  const checkSquare = useMemo(() => {
    try {
      const chess = new Chess(fen)
      if (!chess.isCheck() && !chess.isCheckmate()) return null
      const turn = chess.turn()
      for (const row of chess.board()) {
        for (const cell of row) {
          if (cell && cell.type === 'k' && cell.color === turn) return cell.square
        }
      }
    } catch {
      return null
    }
    return null
  }, [fen])

  return (
    <group>
      {lastMove && (
        <>
          <SquarePlane square={lastMove.from} color="#d8b06a" opacity={0.16} />
          <SquarePlane square={lastMove.to} color="#d8b06a" opacity={0.22} />
        </>
      )}
      {checkSquare && <SquarePlane square={checkSquare} color="#e0574f" opacity={0.38} />}
      {highlights.map((sq) => (
        <SquarePlane key={`hl-${sq}`} square={sq} color="#d8b06a" opacity={0.3} y={0.05} />
      ))}
      {selected && <SquarePlane square={selected} color="#7fd3b4" opacity={0.28} y={0.052} />}
      {focusSquare && <FocusPulse square={focusSquare} />}

      {legalTargets.map((sq) => {
        const [x, , z] = squareToWorld(sq)
        if (occupied.has(sq)) {
          return (
            <mesh key={`cap-${sq}`} position={[x, 0.07, z]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.3, 0.37, 32]} />
              <meshBasicMaterial color="#7fd3b4" transparent opacity={0.75} depthWrite={false} side={THREE.DoubleSide} />
            </mesh>
          )
        }
        return (
          <mesh key={`dot-${sq}`} position={[x, 0.07, z]}>
            <cylinderGeometry args={[0.105, 0.105, 0.01, 24]} />
            <meshBasicMaterial color="#7fd3b4" transparent opacity={0.85} depthWrite={false} />
          </mesh>
        )
      })}
    </group>
  )
}
