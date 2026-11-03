import { useMemo } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'
import { squareToWorld } from '../lib/chessEngine'
import { useBoard } from '../store/board'
import type { ArrowSpec } from '../types'

const Y = 0.34

function Arrow({ from, to, color = '#e9c77b' }: ArrowSpec) {
  const [fx, , fz] = squareToWorld(from)
  const [tx, , tz] = squareToWorld(to)

  const { start, end, conePos, quat } = useMemo(() => {
    const s = new THREE.Vector3(fx, Y, fz)
    const e = new THREE.Vector3(tx, Y, tz)
    const dir = e.clone().sub(s).normalize()
    const cone = e.clone().sub(dir.clone().multiplyScalar(0.22))
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
    return { start: s, end: e, conePos: cone, quat: q }
  }, [fx, fz, tx, tz])

  return (
    <group>
      <Line points={[start, end]} color={color} lineWidth={4} transparent opacity={0.92} />
      <mesh position={conePos} quaternion={quat}>
        <coneGeometry args={[0.09, 0.24, 14]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}

export function Arrows() {
  const arrows = useBoard((s) => s.arrows)
  return (
    <group>
      {arrows.map((a, i) => (
        <Arrow key={`${a.from}-${a.to}-${i}`} {...a} />
      ))}
    </group>
  )
}
