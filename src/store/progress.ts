import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProgressState {
  currentLevel: number
  completedLevels: number[]
  stepIndex: Record<number, number>
  reviewsDone: string[]
  markStep: (levelId: number, index: number) => void
  completeLevel: (levelId: number) => void
  markReview: (reviewId: string) => void
  resetAll: () => void
}

const initial = {
  currentLevel: 10,
  completedLevels: [] as number[],
  stepIndex: {} as Record<number, number>,
  reviewsDone: [] as string[],
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initial,
      markStep: (levelId, index) =>
        set((s) => ({ stepIndex: { ...s.stepIndex, [levelId]: Math.max(s.stepIndex[levelId] ?? 0, index) } })),
      completeLevel: (levelId) =>
        set((s) => {
          const completed = s.completedLevels.includes(levelId) ? s.completedLevels : [...s.completedLevels, levelId]
          return {
            completedLevels: completed,
            currentLevel: Math.min(s.currentLevel, Math.max(1, levelId - 1)),
          }
        }),
      markReview: (reviewId) =>
        set((s) => ({ reviewsDone: s.reviewsDone.includes(reviewId) ? s.reviewsDone : [...s.reviewsDone, reviewId] })),
      resetAll: () => set({ ...initial }),
    }),
    { name: 'chesspath-progress-v1' },
  ),
)

export function isUnlocked(levelId: number, completed: number[]): boolean {
  if (levelId === 10) return true
  return completed.includes(levelId + 1)
}

export function stepProgressFor(levelId: number, steps: number): number {
  const done = useProgress.getState().stepIndex[levelId] ?? 0
  return Math.min(done, steps)
}
