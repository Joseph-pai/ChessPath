import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useBoard } from '../store/board'
import { Board } from './Board'
import { Pieces } from './Pieces'
import { Highlights } from './Highlights'
import { Arrows } from './Arrows'
import { CameraRig } from './CameraRig'

function Reveal({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null)
  const t = useRef(0)
  useFrame((_, delta) => {
    if (!group.current) return
    t.current = Math.min(1, t.current + delta / 0.9)
    const e = 1 - Math.pow(1 - t.current, 3)
    const s = 0.94 + 0.06 * e
    group.current.scale.setScalar(s)
    group.current.position.y = -0.55 * (1 - e)
  })
  return <group ref={group}>{children}</group>
}

export function ChessScene() {
  const orientation = useBoard((s) => s.orientation)

  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      camera={{ position: [0, 7.6, 9.4], fov: 45, near: 0.1, far: 60 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
    >
      <color attach="background" args={['#0b1016']} />
      <fog attach="fog" args={['#0b1016', 17, 36]} />

      <ambientLight intensity={0.7} />
      <directionalLight
        position={[6, 11, 6]}
        intensity={1.9}
        color="#fff4dd"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-7, 6, -5]} intensity={0.5} color="#9fc2ff" />

      <Reveal>
        <group rotation={[0, orientation === 'w' ? 0 : Math.PI, 0]}>
          <Board />
          <Highlights />
          <Pieces />
          <Arrows />
        </group>
      </Reveal>

      <ContactShadows position={[0, -0.4, 0]} opacity={0.5} scale={14} blur={2.6} far={5} color="#000000" />
      <CameraRig />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={5}
        maxDistance={20}
        minPolarAngle={0.16}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 0, 0]}
      />
    </Canvas>
  )
}
