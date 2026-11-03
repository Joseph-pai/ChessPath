import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useBoard } from '../store/board'
import { FILES, squareToWorld, worldToSquare } from '../lib/chessEngine'

const LIGHT = '#e7d7b6'
const DARK = '#6f5138'

const labelCache = new Map<string, THREE.CanvasTexture>()

function getLabelTexture(text: string): THREE.CanvasTexture {
  const cached = labelCache.get(text)
  if (cached) return cached
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, 128, 128)
  ctx.fillStyle = '#cbb98f'
  ctx.font = 'bold 62px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 64, 66)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  labelCache.set(text, texture)
  return texture
}

function Label({ text, position, rotation }: { text: string; position: [number, number, number]; rotation?: [number, number, number] }) {
  const texture = useMemo(() => getLabelTexture(text), [text])
  return (
    <mesh position={position} rotation={rotation ?? [-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.34, 0.34]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  )
}

export function Board() {
  const interaction = useBoard((s) => s.interaction)
  const clickSquare = useBoard((s) => s.clickSquare)
  const gl = useThree((s) => s.gl)
  const groupRef = useRef<THREE.Group>(null)

  const squares = useMemo(() => {
    const out: { square: string; x: number; z: number; light: boolean }[] = []
    for (let rank = 1; rank <= 8; rank++) {
      for (let f = 0; f < 8; f++) {
        const square = `${FILES[f]}${rank}`
        const [x, , z] = squareToWorld(square)
        out.push({ square, x, z, light: (f + rank) % 2 === 1 })
      }
    }
    return out
  }, [])

  const handleClick = (event: any) => {
    if (interaction === 'none') return
    event.stopPropagation()
    const group = groupRef.current
    if (!group) return
    const local = group.worldToLocal(event.point.clone())
    const square = worldToSquare(local.x, local.z)
    if (square) clickSquare(square as any)
  }

  const setCursor = (value: string) => {
    gl.domElement.style.cursor = value
  }

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.24, 0]} receiveShadow>
        <boxGeometry args={[8.9, 0.28, 8.9]} />
        <meshStandardMaterial color="#1b232b" roughness={0.65} metalness={0.12} />
      </mesh>
      <mesh position={[0, -0.07, 0]} receiveShadow>
        <boxGeometry args={[8.35, 0.1, 8.35]} />
        <meshStandardMaterial color="#0e1419" roughness={0.7} />
      </mesh>

      {squares.map(({ square, x, z, light }) => (
        <mesh key={square} position={[x, 0.005, z]} receiveShadow>
          <boxGeometry args={[1, 0.07, 1]} />
          <meshStandardMaterial
            color={light ? LIGHT : DARK}
            roughness={light ? 0.55 : 0.48}
            metalness={0.05}
          />
        </mesh>
      ))}

      {FILES.map((f, i) => (
        <Label key={`f-${f}`} text={f} position={[i - 3.5, 0.055, 4.24]} />
      ))}
      {FILES.map((f, i) => (
        <Label key={`ft-${f}`} text={f} position={[i - 3.5, 0.055, -4.24]} rotation={[-Math.PI / 2, 0, Math.PI]} />
      ))}
      {[1, 2, 3, 4, 5, 6, 7, 8].map((r) => (
        <Label key={`r-${r}`} text={String(r)} position={[-4.24, 0.055, 3.5 - (r - 1)]} />
      ))}
      {[1, 2, 3, 4, 5, 6, 7, 8].map((r) => (
        <Label key={`rr-${r}`} text={String(r)} position={[4.24, 0.055, 3.5 - (r - 1)]} />
      ))}

      <mesh
        position={[0, 0.04, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={handleClick}
        onPointerOver={() => setCursor(interaction === 'none' ? 'default' : 'pointer')}
        onPointerOut={() => setCursor('default')}
      >
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}
