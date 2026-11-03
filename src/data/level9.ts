import { Chess } from 'chess.js'
import type { Level, LessonStep } from '../types'
import { uciOf } from '../lib/chessEngine'

interface ScriptMove {
  san: string
  reply?: string
  title: string
  paragraphs: string[]
  hint?: string
}

const script: ScriptMove[] = [
  {
    san: 'e4',
    reply: 'e5',
    title: '第 1 步 · 抢占中心',
    paragraphs: [
      '轮到你走白棋。把 e2 的兵向前推两格到 e4。',
      '一个兵站在棋盘正中央，就同时控制了两条斜线。黑方通常会跟着走 e5，也占住自己的中心。',
      '这一步没有花招，只是把棋子放到更有影响力的位置。',
    ],
    hint: '操作：点击 e2 的兵，再点击高亮的 e4。',
  },
  {
    san: 'Nf3',
    reply: 'd6',
    title: '第 2 步 · 出骑士，同时威胁',
    paragraphs: [
      '把 g1 的骑士走到 f3。骑士在 f3 不仅靠近中心，还直接攻击黑方 e5 的兵。',
      '黑方选择 d6 保护 e5。它没有立刻反击，而是先稳住中心，这是一种保守但扎实的应法。',
      '注意：出子时尽量让每一步都带一点威胁，对手就必须花时间回应。',
    ],
    hint: '操作：点击 g1 的骑士，再点击 f3。',
  },
  {
    san: 'Bc4',
    reply: 'Bg4',
    title: '第 3 步 · 把主教放到斜线上',
    paragraphs: [
      '把 f1 的主教走到 c4。主教在 c4 瞄准黑国王所在的 f7 格，这是一条很重要的斜线。',
      '黑方走 Bg4，把主教放到 g4。它盯着你的 f3 骑士，同时沿着 g4–f3–e2–d1 这条斜线，瞄准了你身后的后。',
      '这条线，就是你接下来要利用的“牵制”。',
    ],
    hint: '操作：点击 f1 的主教，再点击 c4。',
  },
  {
    san: 'Nc3',
    reply: 'g6',
    title: '第 4 步 · 再出一个子',
    paragraphs: [
      '把 b1 的骑士走到 c3，保护 e4 的兵，也让更多棋子参与中心。',
      '黑方走 g6，看似只是推兵，其实想让自己的主教以后能从 g7 出来。',
      '现在，黑方的主教在 g4 正盯着你的 f3 骑士。下一步会有一个看起来非常危险的走法。',
    ],
    hint: '操作：点击 b1 的骑士，再点击 c3。',
  },
  {
    san: 'Nxe5',
    reply: 'Bxd1',
    title: '第 5 步 · 看似送后，其实是将杀',
    paragraphs: [
      '把 f3 的骑士走到 e5，吃掉黑兵。这个骑士现在威胁 f7，也就是黑国王身边的格子。',
      '黑方的主教立刻走到 d1，吃掉了你的后。别慌——这正是我们想要的。',
      '后虽然没了，但黑国王已经暴露。接下来两步，用剩下的棋子完成将杀。',
    ],
    hint: '放心走：点击 f3 的骑士，吃掉 e5 的黑兵。',
  },
  {
    san: 'Bxf7+',
    reply: 'Ke7',
    title: '第 6 步 · 将军',
    paragraphs: [
      '用 c4 的主教吃掉 f7 的兵，将军！黑国王必须离开 e8。',
      '它只能走到 e7：d7 被你 e5 的骑士控制，f7 被你的主教占住，其他格子也被自己的棋子挡住。',
      '现在黑国王站在 e7，身边看起来很拥挤。找出最后一步。',
    ],
    hint: '操作：点击 c4 的主教，吃掉 f7 的兵。',
  },
  {
    san: 'Nd5#',
    title: '第 7 步 · 将杀',
    paragraphs: [
      '把 c3 的骑士走到 d5，将军！',
      '黑国王无路可走：f8 被自己的主教占着，d8 被自己的后占着，d7、f7、e6、f6 全被白子控制。',
      '你刚刚完成的，是历史上著名的“莱加尔将杀”。你没有被丢掉的后吓住，而是看到了国王的安全。',
    ],
    hint: '操作：点击 c3 的骑士，再点击 d5。',
  },
]

function buildSteps(): LessonStep[] {
  const chess = new Chess()
  const steps: LessonStep[] = []
  for (const s of script) {
    if (!s.paragraphs.length) break
    const fen = chess.fen()
    const move = chess.move(s.san)
    steps.push({
      id: `9.${steps.length + 1}`,
      title: s.title,
      kicker: '第一盘完整对局',
      fen,
      goal: { type: 'move', moves: [uciOf(move)] },
      allowedMoves: [uciOf(move)],
      autoReply: s.reply,
      paragraphs: s.paragraphs,
      hint: s.hint,
      orientation: 'w',
    })
    if (s.reply) chess.move(s.reply)
  }
  return steps
}

export const level9: Level = {
  id: 9,
  title: '下完第一盘棋',
  subtitle: 'Level 9',
  tagline: '你执白，系统执黑。每一步都有人解释。',
  accent: '#8fb8ff',
  completionText: '你完成了第一盘完整的对局，而且用弃后完成将杀。接下来，我们拆开几个最常用的战术。',
  steps: buildSteps(),
}
