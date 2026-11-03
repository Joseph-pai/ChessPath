import type { Level } from '../types'

export const level8: Level = {
  id: 8,
  title: '战术入门：将军、牵制、双攻',
  subtitle: 'Level 8',
  tagline: '学会看见对手没看见的那一步。',
  accent: '#ffb37a',
  completionText: '你已经能识别将军、牵制和双攻。Level 7 会把这三件事放进开局计划里。',
  steps: [
    {
      id: '8.1',
      title: '被将军时，只有三种解法',
      kicker: '战术 1 · 将军',
      fen: '4k3/8/8/8/7q/8/8/4K3 w - - 0 1',
      arrows: [{ from: 'h4', to: 'e1', color: '#e0574f' }],
      highlights: ['e1'],
      goal: { type: 'quiz' },
      paragraphs: [
        '黑后在 h4，沿着斜线攻击 e1 的白国王。这就是“将军”。被将军的一方不能装作没看见。',
        '解除将军只有三种办法：把国王移到安全格、用别的棋子挡住攻击线、吃掉正在将军的棋子。',
        '下面哪一项，不能解除将军？',
      ],
      quiz: {
        question: '以下哪种做法不能解除将军？',
        options: [
          { label: '把国王移到没有被攻击的格子', feedback: '这是第一种解法：移开国王。能解除将军。' },
          { label: '用棋子挡在国王和攻击者之间', feedback: '这是第二种解法：挡住攻击线。能解除将军。' },
          { label: '吃掉正在将军的那枚棋子', feedback: '这是第三种解法：消除威胁。能解除将军。' },
          {
            label: '把国王移到另一个同样被攻击的格子',
            correct: true,
            feedback: '正确。国王任何时候都不能走到被攻击的格子，所以这等于没有解除将军。',
          },
        ],
      },
    },
    {
      id: '8.2',
      title: '找出被牵制的棋子',
      kicker: '战术 2 · 牵制',
      fen: 'r1bqk2r/pppp1ppp/2n2n2/4p3/1b1P4/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 6',
      goal: { type: 'click', squares: ['c3'] },
      paragraphs: [
        '“牵制”就是一枚棋子被钉在一条线上：它一动，身后的国王或后就会暴露。被钉住的棋子，其实等于不能动。',
        '看这个局面：黑主教站在 b4，沿斜线经过 c3，一直指向 e1 的白国王。',
        '在棋盘上点出那枚被牵制、不能随便移动的白棋。',
      ],
      hint: '提示：沿着黑主教 b4 和白国王 e1 之间那条斜线找。',
    },
    {
      id: '8.3',
      title: '一步同时攻击两个目标',
      kicker: '战术 3 · 双攻',
      fen: 'r3k3/8/8/1N6/8/8/8/4K3 w - - 0 1',
      goal: { type: 'move', moves: ['b5c7'] },
      allowedMoves: ['b5c7'],
      paragraphs: [
        '“双攻”（fork）是一枚棋子同时攻击两个目标，对手只能救一个。骑士特别擅长做这件事，因为它能跳。',
        '白方的骑士在 b5，黑国王在 e8，黑城堡在 a8。棋盘上有一个格子，骑士跳过去就能同时攻击国王和城堡。',
        '找到那个格子，把骑士跳过去。',
      ],
      hint: '提示：骑士的目标要同时落在 e8 和 a8 的“日”字范围内。',
    },
  ],
}
