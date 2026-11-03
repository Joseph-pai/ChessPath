import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { parseBoard, squareToWorld } from '../lib/chessEngine'
import { useBoard, type MoveInfo } from '../store/board'
import { PieceModel } from './PieceModel'

const BOARD_TOP = 0.05
const DURATION = 0.26

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function FlyingPiece({ move }: { move: MoveInfo }) {
  const ref = useRef<THREE.Group>(null)
  const progress = useRef(0)
  const [fromX, , fromZ] = squareToWorld(move.from)
  const [toX, , toZ] = squareToWorld(move.to)

  useFrame((_, delta) => {
    if (!ref.current) return
    progress.current = Math.min(1, progress.current + delta / DURATION)
    const t = easeOutCubic(progress.current)
    ref.current.position.set(
      fromX + (toX - fromX) * t,
      BOARD_TOP + Math.sin(Math.PI * progress.current) * 0.32,
      fromZ + (toZ - fromZ) * t,
    )
  })

  return (
    <group ref={ref} position={[fromX, BOARD_TOP, fromZ]}>
      <PieceModel type={move.piece as any} color={move.color} />
    </group>
  )
}

function CapturedGhost({ move }: { move: MoveInfo }) {
  const ref = useRef<THREE.Group>(null)
  const progress = useRef(0)
  const [x, , z] = squareToWorld(move.to)

  useFrame((_, delta) => {
    if (!ref.current) return
    progress.current = Math.min(1, progress.current + delta / DURATION)
    const s = 1 - progress.current
    ref.current.scale.setScalar(Math.max(0.001, s))
    ref.current.position.y = BOARD_TOP - progress.current * 0.2
  })

  return (
    <group ref={ref} position={[x, BOARD_TOP, z]}>
      <PieceModel type={move.captured as any} color={move.color === 'w' ? 'b' : 'w'} ghost opacity={0.85} />
    </group>
  )
}

export function Pieces() {
  const fen = useBoard((s) => s.fen)
  const lastMove = useBoard((s) => s.lastMove)
  const moveSeq = useBoard((s) => s.moveSeq)
  const selected = useBoard((s) => s.selected)
  const [anim, setAnim] = useState<MoveInfo | null>(null)

  const pieces = useMemo(() => parseBoard(fen), [fen])

  useEffect(() => {
    if (!lastMove || moveSeq === 0) {
      setAnim(null)
      return
    }
    setAnim(lastMove)
    const timer = setTimeout(() => setAnim(null), 420)
    return () => clearTimeout(timer)
  }, [moveSeq, lastMove])

  return (
    <group>
      {pieces.map((p) => {
        const [x, , z] = squareToWorld(p.square)
        if (anim && p.square === anim.to) return null
        const lift = p.square === selected ? 0.09 : 0
        return (
          <group key={p.square} position={[x, BOARD_TOP + lift, z]}>
            <PieceModel type={p.type} color={p.color} selected={p.square === selected} />
          </group>
        )
      })}
      {anim && (
        <>
          {anim.captured && <CapturedGhost move={anim} />}
          <FlyingPiece move={anim} />
        </>
      )}
    </group>
  )
}
