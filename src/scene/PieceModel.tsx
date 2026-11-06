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

// 提升可读性：白色用偏亮的奶油色 + 深棕描边；黑色用深色 + 暖色描边
const WHITE = '#f4e9d0'
const WHITE_RIM = '#5a4a32'
const BLACK = '#12161d'
const BLACK_RIM = '#e0d0ac'

function lathe(points: [number, number][], segments = 44) {
  const pts = points.map(([x, y]) => new THREE.Vector2(Math.max(0.001, x), y))
  return new THREE.LatheGeometry(pts, segments)
}

export function PieceModel({ type, color, selected = false, ghost = false, opacity = 1 }: PieceModelProps) {
  const main = color === 'w' ? WHITE : BLACK
  const rim = color === 'w' ? WHITE_RIM : BLACK_RIM
  const emissive = selected ? '#6fd0b1' : '#000000'
  const emissiveIntensity = selected ? 0.45 : 0
  const mat = {
    color: main,
    roughness: color === 'w' ? 0.36 : 0.3,
    metalness: color === 'w' ? 0.05 : 0.34,
    emissive,
    emissiveIntensity,
    transparent: ghost || opacity < 1,
    opacity,
  }
  const rimMat = { ...mat, color: rim, metalness: 0.55, roughness: 0.4 }

  // 对比色底圈：让棋子在浅色/深色格子上都能看清轮廓
  const BaseRim = (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} castShadow>
      <torusGeometry args={[0.3, 0.022, 14, 44]} />
      <meshStandardMaterial {...rimMat} />
    </mesh>
  )

  const body = useMemo(() => {
    switch (type) {
      case 'p': {
        // 兵：底座 → 细颈 → 领圈 → 球头
        const profile: [number, number][] = [
          [0.3, 0.0],
          [0.32, 0.04],
          [0.3, 0.1],
          [0.22, 0.14],
          [0.15, 0.18],
          [0.13, 0.26],
          [0.19, 0.32],
          [0.21, 0.36],
          [0.17, 0.4],
          [0.13, 0.46],
          [0.15, 0.52],
        ]
        return (
          <group>
            <mesh castShadow geometry={lathe(profile)}>
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[0, 0.56, 0]} castShadow>
              <sphereGeometry args={[0.16, 32, 24]} />
              <meshStandardMaterial {...mat} />
            </mesh>
          </group>
        )
      }
      case 'r': {
        // 城堡：底座 → 圆柱塔 → 顶部城垛
        const profile: [number, number][] = [
          [0.3, 0.0],
          [0.33, 0.04],
          [0.31, 0.1],
          [0.24, 0.14],
          [0.2, 0.2],
          [0.22, 0.55],
          [0.26, 0.58],
          [0.26, 0.64],
        ]
        const crenels = [-0.16, -0.053, 0.053, 0.16]
        return (
          <group>
            <mesh castShadow geometry={lathe(profile)}>
              <meshStandardMaterial {...mat} />
            </mesh>
            {crenels.map((x, i) => (
              <mesh key={`c${i}`} position={[x, 0.68, 0.16]} castShadow>
                <boxGeometry args={[0.085, 0.1, 0.085]} />
                <meshStandardMaterial {...mat} />
              </mesh>
            ))}
            {crenels.map((x, i) => (
              <mesh key={`c2${i}`} position={[x, 0.68, -0.16]} castShadow>
                <boxGeometry args={[0.085, 0.1, 0.085]} />
                <meshStandardMaterial {...mat} />
              </mesh>
            ))}
            <mesh position={[0.16, 0.68, 0]} castShadow>
              <boxGeometry args={[0.085, 0.1, 0.4]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[-0.16, 0.68, 0]} castShadow>
              <boxGeometry args={[0.085, 0.1, 0.4]} />
              <meshStandardMaterial {...mat} />
            </mesh>
          </group>
        )
      }
      case 'n': {
        // 骑士：底座 → 脖子 → 马头（朝 +z 方向）
        return (
          <group>
            <mesh castShadow position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.3, 0.33, 0.12, 30]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh castShadow position={[0, 0.24, 0.02]} rotation={[0.18, 0, 0.1]}>
              <cylinderGeometry args={[0.13, 0.2, 0.32, 20]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            {/* 马头主体 */}
            <mesh castShadow position={[0.05, 0.46, 0.05]} rotation={[0.25, 0.3, 0.35]}>
              <boxGeometry args={[0.18, 0.32, 0.28]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            {/* 口鼻 */}
            <mesh castShadow position={[0.11, 0.56, 0.2]} rotation={[0.5, 0.3, 0.3]}>
              <boxGeometry args={[0.12, 0.18, 0.26]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            {/* 耳朵 */}
            <mesh castShadow position={[-0.02, 0.66, -0.04]} rotation={[-0.2, 0, -0.3]}>
              <coneGeometry args={[0.05, 0.14, 10]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh castShadow position={[0.08, 0.66, -0.02]} rotation={[-0.1, 0.2, -0.2]}>
              <coneGeometry args={[0.045, 0.13, 10]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            {/* 眼睛（深色点） */}
            <mesh position={[0.13, 0.5, 0.12]}>
              <sphereGeometry args={[0.025, 12, 10]} />
              <meshStandardMaterial color={rim} metalness={0.5} roughness={0.4} />
            </mesh>
          </group>
        )
      }
      case 'b': {
        // 主教：底座 → 锥形身 → 球 → 主教冠（带缝隙）
        const profile: [number, number][] = [
          [0.29, 0.0],
          [0.32, 0.04],
          [0.3, 0.1],
          [0.22, 0.14],
          [0.14, 0.22],
          [0.12, 0.42],
          [0.16, 0.48],
          [0.16, 0.5],
        ]
        return (
          <group>
            <mesh castShadow geometry={lathe(profile)}>
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[0, 0.55, 0]} castShadow>
              <sphereGeometry args={[0.15, 32, 24]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            {/* 主教冠：两个斜面形成尖端 */}
            <mesh position={[0, 0.72, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
              <boxGeometry args={[0.18, 0.22, 0.18]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[0, 0.86, 0]} castShadow>
              <sphereGeometry args={[0.06, 16, 12]} />
              <meshStandardMaterial {...rimMat} />
            </mesh>
            {/* 缝隙（用对比色细条） */}
            <mesh position={[0, 0.72, 0]}>
              <boxGeometry args={[0.2, 0.1, 0.04]} />
              <meshStandardMaterial color={rim} metalness={0.5} roughness={0.4} />
            </mesh>
          </group>
        )
      }
      case 'q': {
        // 皇后：底座 → 锥形身 → 冠环 + 五个冠尖
        const profile: [number, number][] = [
          [0.3, 0.0],
          [0.33, 0.04],
          [0.31, 0.1],
          [0.24, 0.14],
          [0.17, 0.24],
          [0.15, 0.46],
          [0.2, 0.52],
          [0.21, 0.56],
        ]
        const crownPoints = [0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2
          return [0.16 * Math.cos(a), 0.58 + 0.12, 0.16 * Math.sin(a)] as [number, number, number]
        })
        return (
          <group>
            <mesh castShadow geometry={lathe(profile)}>
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[0, 0.6, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[0.17, 0.03, 12, 36]} />
              <meshStandardMaterial {...rimMat} />
            </mesh>
            {crownPoints.map((p, i) => (
              <mesh key={i} position={p} castShadow>
                <sphereGeometry args={[0.045, 16, 12]} />
                <meshStandardMaterial {...rimMat} />
              </mesh>
            ))}
            <mesh position={[0, 0.74, 0]} castShadow>
              <sphereGeometry args={[0.07, 18, 14]} />
              <meshStandardMaterial {...rimMat} />
            </mesh>
          </group>
        )
      }
      case 'k': {
        // 国王：底座 → 锥形身 → 球 → 十字
        const profile: [number, number][] = [
          [0.3, 0.0],
          [0.33, 0.04],
          [0.31, 0.1],
          [0.24, 0.14],
          [0.17, 0.24],
          [0.16, 0.5],
          [0.18, 0.54],
          [0.17, 0.56],
        ]
        return (
          <group>
            <mesh castShadow geometry={lathe(profile)}>
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[0, 0.62, 0]} castShadow>
              <sphereGeometry args={[0.15, 32, 24]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            <mesh position={[0, 0.82, 0]} castShadow>
              <boxGeometry args={[0.06, 0.22, 0.06]} />
              <meshStandardMaterial {...rimMat} />
            </mesh>
            <mesh position={[0, 0.8, 0]} castShadow>
              <boxGeometry args={[0.18, 0.06, 0.06]} />
              <meshStandardMaterial {...rimMat} />
            </mesh>
          </group>
        )
      }
    }
  }, [type, color, selected, ghost, opacity])

  return (
    <group scale={[1.02, 1.02, 1.02]} rotation={[0, color === 'b' && type === 'n' ? Math.PI : 0, 0]}>
      {body}
      {BaseRim}
      {selected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.34, 0.43, 44]} />
          <meshBasicMaterial color="#7fd3b4" transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}
