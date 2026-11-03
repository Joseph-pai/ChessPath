import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useBoard } from '../store/board'
import { squareToWorld } from '../lib/chessEngine'

export function CameraRig() {
  const { camera, controls } = useThree()
  const orientation = useBoard((s) => s.orientation)
  const focusSquare = useBoard((s) => s.focusSquare)
  const focusSeq = useBoard((s) => s.focusSeq)

  const desiredTarget = useRef(new THREE.Vector3(0, 0, 0))
  const desiredPos = useRef(new THREE.Vector3(0, 7.6, 9.4))
  const animating = useRef(true)

  useEffect(() => {
    const target = new THREE.Vector3(0, 0, 0)
    const position = orientation === 'w' ? new THREE.Vector3(0, 7.6, 9.4) : new THREE.Vector3(0, 7.6, -9.4)

    if (focusSquare) {
      const [x, , z] = squareToWorld(focusSquare)
      const sign = orientation === 'w' ? 1 : -1
      const wx = orientation === 'w' ? x : -x
      const wz = orientation === 'w' ? z : -z
      target.set(wx, 0.25, wz)
      position.set(wx, 4.9, wz + sign * 4.9)
    }

    desiredTarget.current.copy(target)
    desiredPos.current.copy(position)
    animating.current = true
  }, [focusSeq, focusSquare, orientation])

  useFrame(() => {
    if (!animating.current || !controls) return
    const c = controls as any
    camera.position.lerp(desiredPos.current, 0.07)
    c.target.lerp(desiredTarget.current, 0.09)
    c.update()
    if (camera.position.distanceTo(desiredPos.current) < 0.06 && c.target.distanceTo(desiredTarget.current) < 0.03) {
      animating.current = false
    }
  })

  return null
}
