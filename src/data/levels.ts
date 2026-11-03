export const REVIEW_PLAYERS: Record<number, { zh: string; en: string; model: string }> = {
  6: { zh: '保罗·摩菲', en: 'Paul Morphy', model: '带 tempo 出子' },
  5: { zh: '米哈伊尔·塔尔', en: 'Mikhail Tal', model: '时间 > 子力' },
  4: { zh: '何塞·卡帕布兰卡', en: 'José Raúl Capablanca', model: '向有利结构简化' },
  3: { zh: '鲍比·菲舍尔', en: 'Bobby Fischer', model: '动态不平衡' },
  2: { zh: '加里·卡斯帕罗夫', en: 'Garry Kasparov', model: '强制着法优先' },
  1: { zh: '综合大师思维', en: 'Master Checklist', model: '赛前检查清单' },
}

import { level10 } from './level10'
import { level9 } from './level9'
import { level8 } from './level8'
import { level7 } from './level7'
import { reviewLevels } from './reviewLevels'
import type { Level } from '../types'

export const levels: Level[] = [level10, level9, level8, level7, ...reviewLevels]

export function getLevel(id: number): Level | undefined {
  return levels.find((l) => l.id === id)
}

export function levelTitleFor(id: number): string {
  const l = getLevel(id)
  if (l) return l.title
  const p = REVIEW_PLAYERS[id]
  return p ? `${p.zh}的思维课` : '未开放'
}
