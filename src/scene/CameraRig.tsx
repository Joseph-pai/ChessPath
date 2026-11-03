import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useBoard } from '../store/board'
import { squareToWorld } from '../lib/chessEngine'

export function CameraRig() {
  const { camera, controls, viewport } = useThree()
  const orientation = useBoard((s) => s.orientation)
  const focusSquare = useBoard((s) => s.focusSquare)
  const focusSeq = useBoard((s) => s.focusSeq)

  const desiredTarget = useRef(new THREE.Vector3(0, 0, 0))
  const desiredPos = useRef(new THREE.Vector3(0, 7.6, 9.4))
  const animating = useRef(true)

  useEffect(() => {
    const target = new THREE.Vector3(0, 0, 0)
    const sign = orientation === 'w' ? 1 : -1
    let position: THREE.Vector3

    if (focusSquare) {
      const [x, , z] = squareToWorld(focusSquare)
      const wx = orientation === 'w' ? x : -x
      const wz = orientation === 'w' ? z : -z
      target.set(wx, 0.25, wz)
      position = new THREE.Vector3(wx, 4.9, wz + sign * 4.9)
    } else {
      // 依据屏幕宽高比调整默认机位：竖屏时拉远，保证棋盘完整入镜
      const fovHalf = THREE.MathUtils.degToRad(22.5)
      const aspect = Math.max(viewport.aspect, 0.01)
      const dist = Math.max(
        12.09,
        4.6 / (Math.tan(fovHalf) * aspect),
        5.2 / Math.tan(fovHalf),
      )
      position = new THREE.Vector3(0, 7.6, sign * 9.4).multiplyScalar(dist / 12.09)
    }

    desiredTarget.current.copy(target)
    desiredPos.current.copy(position)
    animating.current = true
  }, [focusSeq, focusSquare, orientation, viewport.aspect])

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
