import { useMemo } from 'react'
import * as THREE from 'three'
import type { PieceColor, PieceType } from '../types'

interface PieceModelProps {
  type: PieceType
  color: PieceColor
  selected?: boolean
  ghost?: boolean
  opacity?: number
}

const WHITE = '#f4ecdc'
const BLACK = '#252b33'

export function PieceModel({ type, color, selected = false, ghost = false, opacity = 1 }: PieceModelProps) {
  const main = color === 'w' ? WHITE : BLACK
  const trim = color === 'w' ? '#b49a6a' : '#c8a96f'
  const emissive = selected ? '#6fd0b1' : '#000000'
  const emissiveIntensity = selected ? 0.45 : 0
  const mat = {
    color: main,
    roughness: color === 'w' ? 0.42 : 0.36,
    metalness: color === 'w' ? 0.08 : 0.28,
    emissive,
    emissiveIntensity,
    transparent: ghost || opacity < 1,
    opacity,
  }

  const body = useMemo(() => {
    switch (type) {
      case 'p':
        return (
          <group>
            <mesh position={[0, 0.1, 0]} castShadow>
              <cylinderGeometry args={[0.26, 0.3, 0.14, 28]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[0, 0.27, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.24, 0.26, 24]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[0, 0.45, 0]} castShadow>
              <sphereGeometry args={[0.16, 24, 18]} />
              <meshStandardMaterial {...mat} />
            </mesh>
          </group>
        )
      case 'r':
        return (
          <group>
            <mesh position={[0, 0.1, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.34, 0.14, 28]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[0, 0.3, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.27, 0.34, 24]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[0.48, 0.12, 0.48]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            {[
              [-0.18, -0.18],
              [0.18, -0.18],
              [-0.18, 0.18],
              [0.18, 0.18],
            ].map(([x, z], i) => (
              <mesh key={i} position={[x, 0.6, z]} castShadow>
                <boxGeometry args={[0.1, 0.12, 0.1]} />
                <meshStandardMaterial {...mat} />
              </mesh>
            ))}
          </group>
        )
      case 'n':
        return (
          <group>
            <mesh position={[0, 0.1, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.34, 0.14, 28]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[0, 0.29, 0.02]} rotation={[0.18, 0, 0.12]} castShadow>
              <cylinderGeometry args={[0.12, 0.2, 0.34, 20]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[0.06, 0.49, 0.03]} rotation={[0.15, 0.35, 0.35]} castShadow>
              <boxGeometry args={[0.2, 0.3, 0.26]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[0.11, 0.56, 0.16]} rotation={[0.5, 0.3, 0.3]} castShadow>
              <boxGeometry args={[0.13, 0.17, 0.24]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[0.02, 0.66, -0.02]} castShadow>
              <coneGeometry args={[0.05, 0.14, 10]} />
              <meshStandardMaterial {...mat} />
            </mesh>
          </group>
        )
      case 'b':
        return (
          <group>
            <mesh position={[0, 0.1, 0]} castShadow>
              <cylinderGeometry args={[0.27, 0.32, 0.14, 28]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[0, 0.31, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.21, 0.36, 24]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[0, 0.52, 0]} castShadow>
              <sphereGeometry args={[0.14, 24, 18]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[0, 0.65, 0]} castShadow>
              <coneGeometry args={[0.07, 0.16, 16]} />
              <meshStandardMaterial {...mat} />
            </mesh>
          </group>
        )
      case 'q':
        return (
          <group>
            <mesh position={[0, 0.1, 0]} castShadow>
              <cylinderGeometry args={[0.29, 0.34, 0.14, 28]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[0, 0.34, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.24, 0.4, 24]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[0, 0.59, 0]} castShadow>
              <sphereGeometry args={[0.13, 24, 18]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[0, 0.64, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[0.16, 0.035, 12, 28]} />
              <meshStandardMaterial {...mat} color={trim} metalness={0.5} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.7, 0]} castShadow>
              <sphereGeometry args={[0.06, 16, 12]} />
              <meshStandardMaterial {...mat} color={trim} metalness={0.5} roughness={0.35} />
            </mesh>
          </group>
        )
      case 'k':
        return (
          <group>
            <mesh position={[0, 0.1, 0]} castShadow>
              <cylinderGeometry args={[0.29, 0.34, 0.14, 28]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[0, 0.35, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.25, 0.42, 24]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[0, 0.61, 0]} castShadow>
              <sphereGeometry args={[0.13, 24, 18]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[0, 0.79, 0]} castShadow>
              <boxGeometry args={[0.055, 0.2, 0.055]} />
              <meshStandardMaterial {...mat} color={trim} metalness={0.5} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.77, 0]} castShadow>
              <boxGeometry args={[0.17, 0.055, 0.055]} />
              <meshStandardMaterial {...mat} color={trim} metalness={0.5} roughness={0.35} />
            </mesh>
          </group>
        )
    }
  }, [type, color, selected, ghost, opacity])

  return (
    <group scale={[0.96, 0.96, 0.96]} rotation={[0, color === 'b' && type === 'n' ? Math.PI : 0, 0]}>
      {body}
      {selected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.33, 0.42, 40]} />
          <meshBasicMaterial color="#7fd3b4" transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}
