import type { Level } from '../types'

export const level7: Level = {
  id: 7,
  title: '开局三原则',
  subtitle: 'Level 7',
  tagline: '不背谱，也能把前五步走对。',
  accent: '#d8b06a',
  completionText: '你已经掌握了开局三原则：控制中心、快速出子、尽早易位。现在可以进入棋手课堂了。',
  steps: [
    {
      id: '7.1',
      title: '两种开局，先看结果',
      kicker: '开局 1 · 对比',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      goal: { type: 'demos', count: 2 },
      paragraphs: [
        '下面有两段 10 步的开局。点开演示，让棋子自己走完，然后对比最后的局面。',
        '一段把兵和骑士主教都往中心送，另一段先推边兵、把骑士放到角落。',
        '先各看一遍，再回答下一题。',
      ],
      demos: [
        {
          id: 'good',
          label: 'A 线 · 抢中心',
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'O-O', 'Nf6', 'd3', 'd6'],
          text: 'A 线：白方第一步行到 e4，接着出骑士、出主教、易位。每一步都在让更多棋子参与中心，国王也很快躲到安全位置。',
        },
        {
          id: 'bad',
          label: 'B 线 · 先推边兵',
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          moves: ['h4', 'h5', 'Nh3', 'Nc6', 'Nc3', 'Nf6', 'g3', 'g6', 'Bg2', 'Bg7'],
          text: 'B 线：白方先推 h 兵，又把骑士放到 h3 这个角落。棋子是出动了，但没有一个真正控制中心，国王也还留在中间。',
        },
      ],
    },
    {
      id: '7.2',
      title: '为什么中心更重要',
      kicker: '开局 2 · 中心',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      highlights: ['d4', 'e4', 'd5', 'e5'],
      goal: { type: 'quiz' },
      paragraphs: [
        '棋盘中央的四格 d4、e4、d5、e5 叫“中心”。站在中心的棋子，能更快到达棋盘任何位置。',
        '所以开局的第一目标，是用兵和棋子去影响这四格，而不是把棋子送到边线。',
        '1.e4 和 1.h4 都是合法第一步。哪一个更符合开局原则？',
      ],
      quiz: {
        question: '为什么 1.e4 通常比 1.h4 更好？',
        options: [
          {
            label: 'e4 占住中心，让后和主教的活动空间更大',
            correct: true,
            feedback: '正确。中心兵打开了 e 线、f1 主教的斜线，也让后更容易出动。',
          },
          { label: 'e4 能立刻吃掉对方的兵', feedback: '开局第一步没有棋子可吃。这不是理由。' },
          { label: '边兵更安全，所以 h4 才是好棋', feedback: '边兵离中心最远，对局面的帮助最小。' },
        ],
      },
    },
    {
      id: '7.3',
      title: '尽早易位，把国王藏起来',
      kicker: '开局 3 · 国王的安全',
      fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5',
      goal: { type: 'move', moves: ['e1g1'] },
      allowedMoves: ['e1g1'],
      paragraphs: [
        '白国王还在 e1，两翼的棋子已经出动。现在 f1 和 g1 都是空的，h1 的城堡也没动过，可以短易位。',
        '易位后，国王从中央躲到 g1，城堡同时来到 f1 参与战斗。这是开局最划算的一步。',
        '把白国王从 e1 移到 g1，完成易位。',
      ],
      hint: '操作：点击 e1 的国王，再点击 g1。城堡会自动跟过来。',
    },
    {
      id: '7.4',
      title: '把三原则装进口袋',
      kicker: '开局 4 · 总结',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      highlights: ['d4', 'e4', 'd5', 'e5'],
      goal: { type: 'quiz' },
      paragraphs: [
        '开局三原则：控制中心、快速出子、尽早易位。它们不是死规则，而是让你在前十步不犯大错的地图。',
        '出子时还要注意：不要连续移动同一个棋子，不要为了吃一个边兵而耽误出子。',
        '最后一题：以下哪一项不属于开局三原则？',
      ],
      quiz: {
        question: '以下哪一项不属于开局三原则？',
        options: [
          { label: '控制中心', feedback: '这是第一原则。' },
          { label: '快速出子', feedback: '这是第二原则。' },
          { label: '尽早易位', feedback: '这是第三原则。' },
          {
            label: '尽快吃光对方所有的兵',
            correct: true,
            feedback: '正确。贪吃兵会拖慢出子，反而让国王暴露在危险中。',
          },
        ],
      },
      toolCard: {
        title: '开局检查清单',
        body: '1) 有没有棋子能影响中心？2) 还有哪个轻子没出动？3) 国王能不能在两翼安全易位？',
      },
    },
  ],
}
