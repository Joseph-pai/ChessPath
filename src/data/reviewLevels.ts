import type { ArrowSpec, Level, QuizSpec, Review } from '../types'
import { fenAtPly, parseReview } from '../lib/pgn'
import { REVIEWS } from './reviews'

interface Spec {
  review: Review
  introPly: number
  introHighlights?: string[]
  introArrows?: ArrowSpec[]
  introParagraphs: string[]
  reviewParagraphs: string[]
  summaryParagraphs: string[]
  quiz: QuizSpec
  tool: { title: string; body: string }
  introTitle: string
  reviewTitle: string
  quizTitle: string
}

function build(spec: Spec): Level {
  const { review } = spec
  const total = parseReview(review).plies.length
  const introFen = fenAtPly(review.pgn, spec.introPly, review.startFen)
  const finalFen = fenAtPly(review.pgn, total, review.startFen)
  return {
    id: review.levelId,
    title: `${review.player}的思维课`,
    subtitle: `Level ${review.levelId}`,
    tagline: `${review.title} · 核心思维：${review.model}`,
    accent: '#d8b06a',
    completionText: `你已经完成了 ${review.player} 的思维模型：${review.model}。带着这张工具卡，去下一段位。`,
    steps: [
      {
        id: `${review.levelId}.1`,
        title: spec.introTitle,
        kicker: `${review.playerEn} · 思维模型`,
        fen: introFen,
        orientation: 'w',
        highlights: spec.introHighlights,
        arrows: spec.introArrows,
        goal: { type: 'next' },
        paragraphs: spec.introParagraphs,
        toolCard: spec.tool,
      },
      {
        id: `${review.levelId}.2`,
        title: spec.reviewTitle,
        kicker: '名局复盘',
        fen: introFen,
        orientation: 'w',
        goal: { type: 'review', reviewId: review.id },
        reviewId: review.id,
        paragraphs: spec.reviewParagraphs,
      },
      {
        id: `${review.levelId}.3`,
        title: spec.quizTitle,
        kicker: '把思维装进口袋',
        fen: finalFen,
        orientation: 'w',
        goal: { type: 'quiz' },
        paragraphs: spec.summaryParagraphs,
        quiz: spec.quiz,
        toolCard: spec.tool,
      },
    ],
  }
}

export const reviewLevels: Level[] = [
  build({
    review: REVIEWS.find((r) => r.id === 'morphy')!,
    introPly: 13,
    introHighlights: ['f7', 'b7', 'b3'],
    introArrows: [{ from: 'b3', to: 'f7', color: '#f2b6a0' }],
    introParagraphs: [
      '摩菲是 19 世纪最锋利的实战棋手。他的核心思维只有一句：每一步出子都要带威胁（tempo），让对手一直忙于应付。',
      '看这个局面：白后刚走到 b3，同时盯住 f7 和 b7。黑方必须分心防守，而白方还可以继续出子。',
      '接下来的复盘里，注意数一数：白方每走一步，黑方有多少步是在“救火”。',
    ],
    reviewParagraphs: [
      '从 1.e4 开始，逐步播放整盘棋。重点看白方如何用出子、牵制、弃子，一步步把黑方逼到墙角。',
      '关键节点会暂停，问你一个问题。答对后才能继续。',
    ],
    summaryParagraphs: ['你已经看完了歌剧院对局。最后用一道题，把“tempo”变成你能带走的东西。'],
    quiz: {
      question: '“带 tempo 出子”最关键的意思是什么？',
      options: [
        {
          label: '出子的同时威胁对手，让对手没有时间完成自己的计划',
          correct: true,
          feedback: '正确。tempo 不是走得更快，而是让对手的每一步都被迫回应你。',
        },
        { label: '每一步都走同一个棋子，尽快深入敌阵', feedback: '连续移动同一个棋子会耽误出子，和 tempo 相反。' },
        { label: '不惜代价吃掉对方最多的兵', feedback: '吃兵若拖慢出子，就会把主动权交还给对手。' },
      ],
    },
    tool: {
      title: 'Morphy 工具卡：带 tempo 出子',
      body: '出子之前问一句：这一步有没有威胁？如果没有，能不能换一个带威胁的出子？',
    },
    introTitle: '摩菲：让每一步都带威胁',
    reviewTitle: '复盘：歌剧院对局 1858',
    quizTitle: '把 tempo 变成一个动作',
  }),
  build({
    review: REVIEWS.find((r) => r.id === 'tal')!,
    introPly: 31,
    introHighlights: ['d5', 'h7', 'g7'],
    introArrows: [{ from: 'd5', to: 'e7', color: '#f2b6a0' }],
    introParagraphs: [
      '塔尔被称为“里加魔术师”。他的核心思维是：时间比子力更重要。为了抢到几步进攻的节奏，他愿意送掉城堡、骑士、主教。',
      '看这个局面：白方的骑士已经跳到 d5，直接攻击 e7 的主教；f3 的后、d3 的主教和 g5 的兵也全部朝向国王翼。',
      '复盘时，别急着算“我少了几个兵”，先算“谁的国王先出事”。',
    ],
    reviewParagraphs: [
      '这是一盘典型的塔尔式进攻：白方不断制造威胁，黑方每一步都在被迫应对。',
      '到关键节点会暂停。回答问题时，先找强制着法，再看安静着法。',
    ],
    summaryParagraphs: ['复盘结束。用一道题把“时间 > 子力”固定下来。'],
    quiz: {
      question: '塔尔的“时间 > 子力”到底在说什么？',
      options: [
        {
          label: '进攻方的子力数量与协调度，比账面上的兵子价值更重要',
          correct: true,
          feedback: '正确。数战场上的子，不数棋盘上的子：能参与进攻的子越多，时间就越站在你这边。',
        },
        { label: '只要弃子就一定能赢', feedback: '弃子必须换来具体的威胁，否则只是白送。' },
        { label: '开局阶段应该尽快交换掉所有重子', feedback: '塔尔恰恰相反，他要保留进攻子力。' },
      ],
    },
    tool: {
      title: 'Tal 工具卡：数战场上的子',
      body: '准备进攻前先数：我有几个子能打到对方国王？对手有几个子能回来防守？进攻子力占优，才值得投入时间。',
    },
    introTitle: '塔尔：时间比子力更贵',
    reviewTitle: '复盘：塔尔 vs 拉尔森 1965',
    quizTitle: '把“时间”变成可数的东西',
  }),
  build({
    review: REVIEWS.find((r) => r.id === 'capablanca')!,
    introPly: 19,
    introHighlights: ['c4', 'd5', 'e5'],
    introParagraphs: [
      '卡帕布兰卡的风格是“看不见的压迫”。他先问对手想干什么，然后用最少的动作把它堵住，再慢慢积累微小优势。',
      '看这个局面：白方没有立刻进攻，而是控制关键格，让黑方的子力找不到好位置。',
      '复盘时留意：他什么时候交换，什么时候拒绝交换。',
    ],
    reviewParagraphs: [
      '这盘棋节奏很慢，但每一步都在限制黑方的选择。',
      '暂停问题会问你“对手想干什么”，这正是卡帕布兰卡的第一问。',
    ],
    summaryParagraphs: ['复盘结束。最后一道题，检查你是否抓住了“简化”的方向感。'],
    quiz: {
      question: '卡帕布兰卡式的“简化”，正确做法是？',
      options: [
        {
          label: '当交换能让自己剩下的子力更活跃、结构更舒服时才交换',
          correct: true,
          feedback: '正确。简化不是随便兑子，而是向着对自己有利的结构兑子。',
        },
        { label: '只要自己多一个兵，就立刻换掉所有子', feedback: '换光后反而可能守和。' },
        { label: '永远不交换，保留全部子力', feedback: '该简化时不简化，优势会被拖散。' },
      ],
    },
    tool: {
      title: 'Capablanca 工具卡：先问对手想干什么',
      body: '每到关键节点先问：对手下一步想做什么？能不能用最小的动作阻止它？优势时，只做对自己结构有利的交换。',
    },
    introTitle: '卡帕布兰卡：先堵住，再积累',
    reviewTitle: '复盘：卡帕布兰卡 vs 特雷巴尔 1929',
    quizTitle: '把“简化”变成一个判断',
  }),
  build({
    review: REVIEWS.find((r) => r.id === 'fischer')!,
    introPly: 30,
    introHighlights: ['f2', 'g1', 'd5'],
    introArrows: [{ from: 'f2', to: 'g4', color: '#f2b6a0' }],
    introParagraphs: [
      '菲舍尔的核心思维是“动态不平衡”：他不追求绝对安全的局面，而是主动制造不对称，让自己的子力更活跃。',
      '看这个局面：黑骑士已经跳到 f2，白国王还留在 g1。账面上黑方并不占优，但黑方的子力全部活跃，白国王随时会被拖到开阔地。',
      '复盘时注意：他愿意承担什么样的风险，又用什么来补偿。',
    ],
    reviewParagraphs: [
      '这盘棋展示了菲舍尔如何把“看起来不舒服”的局面转化成主动。',
      '关键节点会暂停，问你哪一方的子力更协调。',
    ],
    summaryParagraphs: ['复盘结束。用一道题把“动态不平衡”变成可操作的判断。'],
    quiz: {
      question: '“动态不平衡”最准确的理解是？',
      options: [
        {
          label: '主动制造不对称，用子力活跃度补偿结构或材料上的让步',
          correct: true,
          feedback: '正确。不是盲目冒险，而是清楚知道自己用什么换什么。',
        },
        { label: '尽量让局面保持完全对称', feedback: '对称往往意味着双方都没有主动权。' },
        { label: '只要子力多就一定能赢', feedback: '菲舍尔更看重子力是否能参与进攻。' },
      ],
    },
    tool: {
      title: 'Fischer 工具卡：用活跃度换不平衡',
      body: '问自己：我愿意让出什么（兵、结构、空间），换来的活跃度能不能立刻变成威胁？能，就敢做。',
    },
    introTitle: '菲舍尔：主动制造不平衡',
    reviewTitle: '复盘：伯恩 vs 菲舍尔 1963',
    quizTitle: '把“不平衡”变成一个选择',
  }),
  build({
    review: REVIEWS.find((r) => r.id === 'kasparov')!,
    introPly: 43,
    introHighlights: ['d5', 'e7', 'b6'],
    introArrows: [{ from: 'd5', to: 'e7', color: '#f2b6a0' }],
    introParagraphs: [
      '卡斯帕罗夫的思维是“强制着法优先”：将军、吃子、威胁，先把对手的选择压缩到最少，再计算安静着法。',
      '看这个局面：白方刚把骑士送到 d5，直接威胁 e7 的主教和后。这只是强行打开线路的第一步。',
      '复盘时数一数：白方的每一步里，有多少是带将军的强制着法。',
    ],
    reviewParagraphs: [
      '这是一盘著名的“国王的长途跋涉”：黑国王从 g8 一路被赶到 a4。',
      '暂停问题会反复问你：这一步是强制着法吗？它压缩了对手哪些选择？',
    ],
    summaryParagraphs: ['复盘结束。最后一道题，把“强制着法优先”变成你的检查顺序。'],
    quiz: {
      question: '计算时“强制着法优先”的正确顺序是？',
      options: [
        {
          label: '先看将军、吃子、威胁，再看安静着法',
          correct: true,
          feedback: '正确。强制着法分支少、效果好，先算它们能省下大量时间。',
        },
        { label: '先算安静着法，因为强制着法太容易看见', feedback: '顺序反了，会浪费大量计算在无效分支上。' },
        { label: '只算将军，不算其他', feedback: '吃子和威胁同样是强制着法。' },
      ],
    },
    tool: {
      title: 'Kasparov 工具卡：强制着法优先',
      body: '每一回合按顺序检查：将军 → 吃子 → 威胁 → 安静着法。先算分支少的，再算分支多的。',
    },
    introTitle: '卡斯帕罗夫：先把选择压到最少',
    reviewTitle: '复盘：卡斯帕罗夫 vs 托帕洛夫 1999',
    quizTitle: '把“强制”变成计算顺序',
  }),
  build({
    review: REVIEWS.find((r) => r.id === 'reti')!,
    introPly: 15,
    introHighlights: ['d1', 'd8', 'e4'],
    introArrows: [{ from: 'd3', to: 'd8', color: '#9fd8c2' }],
    introParagraphs: [
      '走到最后一段位，我们要把前五张工具卡合成一张“赛前清单”：中心、出子、国王的安全、强制着法。',
      '这盘 11 步的短对局是清单的完美示范：白方先占中心、快速出子、长易位通城堡，最后用弃后引出将杀。',
      '先看局面：白方刚完成长易位，d 线的城堡已经对准黑方阵地。接下来是强制着法的时刻。',
    ],
    reviewParagraphs: [
      '完整播放这盘 11 步短对局。每到关键节点，用清单检查：中心、出子、国王的安全、强制着法。',
      '回答暂停问题时，先问自己“有没有将军、吃子、威胁”的强制着法，再看安静着法。',
    ],
    summaryParagraphs: ['复盘结束。最后一道题，把整盘棋的顺序串起来。'],
    quiz: {
      question: '这盘棋的获胜顺序是？',
      options: [
        {
          label: '占中心 → 快速出子 → 长易位通城堡 → 弃后引国王 → 双主教将杀',
          correct: true,
          feedback: '正确。每一步都在为下一步服务，这就是大师的清单。',
        },
        { label: '先吃光对方的兵 → 再换后 → 最后升变', feedback: '这盘棋里没有贪吃兵，也没有升变。' },
        { label: '先弃后 → 再出子 → 最后易位', feedback: '弃后发生在出子和易位之后，顺序不能倒。' },
      ],
    },
    tool: {
      title: '大师清单：赛前 4 问',
      body: '1) 中心归谁？2) 我还有哪个子没出动？3) 国王安全吗？4) 有没有强制着法（将军/吃子/威胁）？',
    },
    introTitle: '综合大师思维：把五张卡合成一张',
    reviewTitle: '复盘：雷蒂 vs 塔塔科弗 1910',
    quizTitle: '用清单复述整盘棋',
  }),
]
