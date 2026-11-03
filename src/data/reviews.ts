import type { Review } from '../types'

const operaPgn = `[Event "Casual Game"]
[Site "Paris FRA"]
[Date "1858.??.??"]
[White "Paul Morphy"]
[Black "Duke Karl / Count Isouard"]
[Result "1-0"]

1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6
7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7
12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8
17. Rd8# 1-0`

const retiPgn = `[Event "Vienna"]
[Site "Vienna AUT"]
[Date "1910.??.??"]
[White "Richard Reti"]
[Black "Savielly Tartakower"]
[Result "1-0"]

1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Nf6 5. Qd3 e5 6. dxe5 Qa5+
7. Bd2 Qxe5 8. O-O-O Nxe4 9. Qd8+ Kxd8 10. Bg5+ Kc7 11. Bd8# 1-0`

export const REVIEWS: Review[] = [
  {
    id: 'morphy',
    levelId: 6,
    player: '保罗·摩菲',
    playerEn: 'Paul Morphy',
    title: '歌剧院对局 · 1858',
    subtitle: '巴黎歌剧院包厢里的即兴表演',
    model: '带 tempo 出子',
    modelEn: 'Development with tempo',
    pgn: operaPgn,
    summary: [
      '摩菲在这盘棋里几乎没有停手：每一步出子都带着威胁，黑方只能不断回应。你不需要记住所有着法，只要观察“白方每出一子，黑方就必须救火”的节奏。',
      '当所有轻子都参与进攻，白方用弃子打开线路，最后用底线将杀收尾。这就是 tempo：不是走得更快，而是让对手没有时间完成自己的计划。',
    ],
    annotations: [
      { ply: 1, text: '1.e4 占住中心，同时打开 f1 主教和后的线路。', tag: '[Morphy: 中心 + 出子线路]' },
      { ply: 2, text: '1...e5 对称回应，黑方也占住中心。' },
      { ply: 3, text: 'Nf3 出骑士并立刻攻击 e5。出子带威胁，黑方必须回应。', tag: '[Morphy: 带 tempo 出子]' },
      { ply: 4, text: '2...d6 保护 e5，但把 c8 的主教关在家里。' },
      { ply: 5, text: '3.d4 立刻打开中心。白方已经有两个子出动，打开线路只会对自己有利。', tag: '[Morphy: 先完成出子再开线]' },
      { ply: 6, text: '3...Bg4 牵制 f3 骑士，黑方也想争取主动。' },
      { ply: 7, text: '4.dxe5 先吃，逼黑主教做决定。' },
      { ply: 8, text: '4...Bxf3 交换骑士。' },
      { ply: 9, text: '5.Qxf3 用后吃回，白后提前进入战斗。' },
      { ply: 10, text: '5...dxe5 黑方吃回 e5 兵。' },
      { ply: 11, text: '6.Bc4 主教直接瞄准 f7——黑国王身边最弱的一格。', tag: '[Morphy: 瞄准 f7]' },
      { ply: 12, text: '6...Nf6 出骑士挡线。' },
      { ply: 13, text: '7.Qb3 后同时盯住 f7 和 b7。黑方两个目标都要照顾。', tag: '[Morphy: 一子双目标]' },
      { ply: 14, text: '7...Qe7 保住 f7。' },
      { ply: 15, text: '8.Nc3 继续出子。白方没有去贪 b7 的兵，而是让最后一个轻子也参与。', tag: '[Morphy: 不为小利偏离出子]' },
      { ply: 16, text: '8...c6 给后留一条退路。' },
      { ply: 17, text: '9.Bg5 牵制 f6 骑士：它一动，黑后就暴露。', tag: '[Morphy: 牵制]' },
      { ply: 18, text: '9...b5 黑方在后翼反击，想赶走 c4 的主教。' },
      { ply: 19, text: '10.Nxb5! 弃骑士打开 b 线。摩菲已经算清后面的强制着法。', tag: '[Morphy: 弃子打开线路]' },
      { ply: 20, text: '10...cxb5 黑方接受弃子。' },
      { ply: 21, text: '11.Bxb5+ 将军。白方顺手赢得 tempo。' },
      { ply: 22, text: '11...Nbd7 挡将，同时把骑士送到 d7。' },
      { ply: 23, text: '12.O-O-O! 易位同时把城堡放到 d 线，直接攻击 d7 的骑士。', tag: '[Morphy: 易位即进攻]' },
      { ply: 24, text: '12...Rd8 黑城堡占住 d 线，试图对顶。' },
      { ply: 25, text: '13.Rxd7! 用交换清掉防守者，把 d 线彻底打开。', tag: '[Morphy: 清掉防守者]' },
      { ply: 26, text: '13...Rxd7 黑城堡吃回。' },
      { ply: 27, text: '14.Rd1 最后一个城堡加入进攻。白方所有子力都到位了。', tag: '[Morphy: 全员参与]' },
      { ply: 28, text: '14...Qe6 黑后挡在 d 线。' },
      { ply: 29, text: '15.Bxd7+ 清掉最后一道防线。' },
      { ply: 30, text: '15...Nxd7 黑骑士被迫吃回。' },
      { ply: 31, text: '16.Qb8+! 弃后引开黑骑士，为最后的城堡让路。', tag: '[Morphy: 弃后引离]' },
      { ply: 32, text: '16...Nxb8 黑骑士只能吃后。' },
      { ply: 33, text: '17.Rd8# 底线将杀。白城堡沿第 8 行封死黑国王。', tag: '[将杀]' },
    ],
    questions: [
      {
        ply: 13,
        question: '白后在 b3 同时盯着 f7 和 b7。这个“一子双目标”的作用是什么？',
        options: [
          { label: '让黑方必须分心防守，白方可以继续出子', correct: true, feedback: '正确。双重威胁不一定要立刻得分，它能让对手没有时间完成自己的计划。' },
          { label: '立刻吃掉 b7 的兵', feedback: '吃 b7 只是一兵，黑方反而有时间出子。摩菲选择继续出子。' },
          { label: '把后换掉', feedback: '此时换后会放弃进攻。' },
        ],
      },
      {
        ply: 19,
        question: '如果你是白方，下一步最符合摩菲思维的是？',
        options: [
          { label: 'Nxb5，弃骑士打开 b 线', correct: true, feedback: '正确。白方所有子力都已出动，打开线路的收益远大于一个骑士。' },
          { label: 'Nxe5，再吃一个兵', feedback: '黑方可以 Nxe5 吃回，白方只是交换，没有打开线路。' },
          { label: 'Bxf6，先换掉黑骑士', feedback: '过早交换会让黑方减轻压力，白方少了一个进攻子力。' },
        ],
      },
      {
        ply: 22,
        question: '白方下一步为什么选择 O-O-O，而不是短易位？',
        options: [
          { label: '长易位让城堡直接进入 d 线，攻击 d7 的骑士', correct: true, feedback: '正确。易位不只是保护国王，更重要的是让城堡立刻参与进攻。' },
          { label: '长易位后国王更安全', feedback: '两边都可以安全，但 d 线才是这步的关键。' },
          { label: '因为短易位不合法', feedback: '短易位在这里也合法，只是没有进攻价值。' },
        ],
      },
      {
        ply: 30,
        question: '最后的 Qb8+ 是弃后。它换来了什么？',
        options: [
          { label: '引开黑骑士，让 Rd8 将杀', correct: true, feedback: '正确。弃后的唯一目的，是让黑骑士离开 b8，为城堡清空底线。' },
          { label: '想用后换掉黑骑士', feedback: '换子不是目的，将杀才是。' },
          { label: '拖延时间', feedback: '这一步是强制着法，不是拖延。' },
        ],
      },
    ],
  },
  {
    id: 'reti',
    levelId: 1,
    player: '综合大师思维',
    playerEn: 'Master Checklist',
    title: '雷蒂 vs 塔塔科弗 · 1910',
    subtitle: '一盘 11 步的完整短对局',
    model: '赛前检查清单',
    modelEn: 'Pre-game checklist',
    pgn: retiPgn,
    summary: [
      '这是一盘只有 11 步的完整对局。请用前九个段位学到的清单来看它：开局有没有占中心？子力有没有全部出动？国王有没有易位？最后的关键是不是强制着法？',
      '看完后，你会看到：弃后不是灵感，而是“强制着法优先”的自然结果。',
    ],
    annotations: [
      { ply: 1, text: '1.e4 占中心。清单第一项：中心。' },
      { ply: 2, text: '1...c6 卡罗-坎防御，黑方准备用 d5 挑战中心。' },
      { ply: 3, text: '2.d4 白方也占中心，形成 d4/e4 双兵。' },
      { ply: 4, text: '2...d5 黑方立刻反击中心。' },
      { ply: 5, text: '3.Nc3 出子并增加对 d5 的压力。' },
      { ply: 6, text: '3...dxe4 黑方交换。' },
      { ply: 7, text: '4.Nxe4 白方吃回，骑士站到中心。' },
      { ply: 8, text: '4...Nf6 黑方出骑士攻击 e4。' },
      { ply: 9, text: '5.Qd3 后提前出动，瞄准 d8 和 h7。', tag: '[Réti: 后提前参与]' },
      { ply: 10, text: '5...e5 黑方也打开中心。' },
      { ply: 11, text: '6.dxe5 白方交换，打开 d 线。' },
      { ply: 12, text: '6...Qa5+ 黑后将军，想打乱白方节奏。' },
      { ply: 13, text: '7.Bd2 挡将。注意：这一步同时让 d1 的城堡看到了 d 线。', tag: '[Réti: 挡将兼通城堡]' },
      { ply: 14, text: '7...Qxe5 黑后吃回 e5，站在中心。' },
      { ply: 15, text: '8.O-O-O! 白方长易位，城堡立刻进入 d 线，对准黑后和 d8。', tag: '[Réti: 易位即进攻]' },
      { ply: 16, text: '8...Nxe4 黑骑士吃骑士，看似赚了子力。' },
      { ply: 17, text: '9.Qd8+! 弃后！后走到 d8 将军，逼黑国王离开 e8。', tag: '[Réti: 强制着法优先]' },
      { ply: 18, text: '9...Kxd8 黑国王只能吃后。' },
      { ply: 19, text: '10.Bg5+ 主教将军，逼国王走到 c7。', tag: '[Réti: 逼国王入陷阱]' },
      { ply: 20, text: '10...Kc7 黑国王唯一相对安全的格子。' },
      { ply: 21, text: '11.Bd8# 将杀。d 线的城堡封住 d6，黑国王无路可走。', tag: '[将杀]' },
    ],
    questions: [
      {
        ply: 15,
        question: '白方为什么选择长易位，而不是先把 e4 的骑士换掉？',
        options: [
          { label: '让城堡进入 d 线，参与对 d8 的进攻', correct: true, feedback: '正确。d1 的城堡一旦通城堡，黑后的 d 线和 d8 都变成目标。' },
          { label: '单纯为了国王的安全', feedback: '国王的安全只是附带收益，真正价值是城堡进入 d 线。' },
          { label: '因为长易位可以多走一步', feedback: '易位仍然只算一步棋。' },
        ],
      },
      {
        ply: 16,
        question: '黑方下一步吃骑士 Nxe4。白方此时应该问自己什么？',
        options: [
          { label: '有没有强制着法可以直接威胁国王？', correct: true, feedback: '正确。白方没有去救骑士，而是寻找 Qd8+ 这样的强制着法。' },
          { label: '怎样把骑士救回来？', feedback: '救骑士会失去进攻时间，黑国王才是目标。' },
          { label: '要不要先吃回一兵？', feedback: '子力不是当前最重要的变量。' },
        ],
      },
      {
        ply: 18,
        question: 'Qd8+ 弃后之后，白方靠什么完成将杀？',
        options: [
          { label: 'Bg5+ 逼国王到 c7，再用 Bd8 将杀', correct: true, feedback: '正确。弃后只是把国王引到 d8，两主教接力完成最后一击。' },
          { label: '用城堡直接吃后', feedback: '黑后已经不在 d 线，城堡的作用是封锁。' },
          { label: '升变一个兵', feedback: '局面里没有可升变的兵。' },
        ],
      },
    ],
  },
  {
    id: 'tal',
    levelId: 5,
    player: '米哈伊尔·塔尔',
    playerEn: 'Mikhail Tal',
    title: '塔尔 vs 拉尔森 · 布莱德 1965',
    subtitle: '对向易位后的国王翼风暴（前 17 回合片段）',
    model: '时间 > 子力',
    modelEn: 'Time over material',
    pgn: `1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 e6 5. Nc3 d6 6. Be3 Nf6
7. f4 Be7 8. Qf3 O-O 9. O-O-O Qc7 10. Ndb5 Qb8 11. g4 a6 12. Nd4 Nxd4
13. Bxd4 b5 14. g5 Nd7 15. Bd3 b4 16. Nd5 exd5 17. exd5`,
    summary: [
      '塔尔的核心不是“算得更深”，而是“让对手一直站在悬崖边”。他愿意交出子力，换取对手没有时间组织防守。',
      '在这段片段里，白方先占空间，再把所有子力压向国王翼，最后用 Nd5! 打开 e 线。数一数：进攻方有多少子参与？防守方又有多少子能回来？',
    ],
    annotations: [
      { ply: 1, text: '1.e4 占中心。塔尔也遵守基本规则，只是他推进得更快。' },
      { ply: 6, text: '3...cxd4 西西里防御，黑方用 c 兵换掉白方中心兵。' },
      { ply: 16, text: '8.Qf3 后提前走到 f3，直接对准国王翼。', tag: '[Tal: 后提前压上]' },
      { ply: 18, text: '8...O-O 黑方短易位。' },
      { ply: 17, text: '9.O-O-O 双方对向易位。国王翼的进攻速度，往往决定这盘棋。', tag: '[Tal: 对向易位，速度优先]' },
      { ply: 21, text: '11.g4 先抢空间，不急着交换。空间本身就是进攻资源。', tag: '[Tal: 空间换时间]' },
      { ply: 27, text: '14.g5 兵浪推进，把黑骑士从 f6 赶走，国王翼的防线开始松动。', tag: '[Tal: 兵浪赶走防守者]' },
      { ply: 29, text: '15.Bd3 主教转到 b1–h7 斜线，直接瞄准黑国王身边。' },
      { ply: 30, text: '15...b4 黑方在后翼反击，但速度明显慢了一拍。' },
      { ply: 31, text: '16.Nd5!! 弃骑士！白方打开 e 线，让 e4 兵和后一起加入进攻。', tag: '[Tal: 时间 > 子力]' },
      { ply: 32, text: '16...exd5 黑方接受弃子。' },
      { ply: 33, text: '17.exd5 白方吃回，e 线半开。黑方的防守子力仍然回不来。', tag: '[Tal: 数进攻子，不数棋盘上的子]' },
    ],
    questions: [
      {
        ply: 21,
        question: '白方为什么先走 11.g4，而不是立刻交换或吃子？',
        options: [
          { label: '先扩大空间，让更多子力能进入国王翼', correct: true, feedback: '正确。空间让进攻子力有地方展开，也让防守方更难调动。' },
          { label: '因为 g4 可以直接吃黑主教', feedback: '这个局面里 g4 没有可吃的目标。' },
          { label: '为了逼黑方认输', feedback: '认输不会因为一步推兵发生。' },
        ],
      },
      {
        ply: 30,
        question: '如果你是白方，下一步最符合塔尔思维的是？',
        options: [
          { label: 'Nd5! 弃骑士打开 e 线，让所有子力一起进攻', correct: true, feedback: '正确。塔尔愿意用子力换时间和线路。' },
          { label: '先吃回 b4 的兵', feedback: '后翼的小利会让国王翼进攻慢下来。' },
          { label: '把主教换掉，简化局面', feedback: '简化等于给黑方喘息时间。' },
        ],
      },
      {
        ply: 32,
        question: '“数战场上的子，不数棋盘上的子”是什么意思？',
        options: [
          { label: '进攻区域里参与的子力数量，比总子力价值更重要', correct: true, feedback: '正确。塔尔关心的是有多少子能参与进攻，而不是账面上谁多一个骑士。' },
          { label: '棋子越少越好', feedback: '不是少，而是把子力集中到关键战场。' },
          { label: '只看兵的数量', feedback: '子力类型和位置同样重要。' },
        ],
      },
    ],
  },
  {
    id: 'capablanca',
    levelId: 4,
    player: '何塞·卡帕布兰卡',
    playerEn: 'José Raúl Capablanca',
    title: '卡帕布兰卡 vs 特雷巴尔 · 卡尔巴德 1929',
    subtitle: '用空间与简化慢慢收紧局面（前 21 回合片段）',
    model: '向有利结构简化',
    modelEn: 'Simplify into a favorable structure',
    pgn: `1. d4 d5 2. c4 c6 3. Nf3 e6 4. Bg5 Be7 5. Bxe7 Qxe7 6. Nbd2 f5
7. e3 Nd7 8. Bd3 Nh6 9. O-O O-O 10. Qc2 g6 11. Rab1 Nf6 12. Ne5 Nf7
13. f4 Bd7 14. Ndf3 Rfd8 15. b4 Be8 16. Rfc1 a6 17. Qf2 Nxe5 18. Nxe5 Nd7
19. Nf3 Rdc8 20. c5 Nf6 21. a4`,
    summary: [
      '卡帕布兰卡很少追求华丽的将杀。他先问“对手想干什么”，再用空间和交换，把对手的选择一个个拿走。',
      '这段片段里，白方没有急着进攻，而是把黑方的骑士和主教逐步限制住，再把局面引向对自己有利的兵结构。',
    ],
    annotations: [
      { ply: 1, text: '1.d4 先占中心，节奏比 e4 更慢，但更持久。' },
      { ply: 8, text: '4.Bg5 主动交换黑格主教。卡帕布兰卡愿意简化，只要结果对自己有利。', tag: '[Capablanca: 为结构而交换]' },
      { ply: 10, text: '5...Qxe7 黑后被迫 recapture，黑方的防守资源少了一件。' },
      { ply: 11, text: '6.Nbd2 骑士从 d2 出发，保持中心弹性。' },
      { ply: 15, text: '8.Bd3 主教对准 h7，同时支持 e4 的计划。' },
      { ply: 21, text: '11.Rab1 后翼城堡提前就位，准备 b4 扩张。', tag: '[Capablanca: 先占位，再行动]' },
      { ply: 23, text: '12.Ne5 骑士站到 e5 强点，黑方很难把它赶走。', tag: '[Capablanca: 强点]' },
      { ply: 25, text: '13.f4 巩固 e5，也让白方的空间优势落地。' },
      { ply: 29, text: '15.b4 后翼空间扩张，黑方被迫不断防守。' },
      { ply: 32, text: '16...a6 黑方只能等待。卡帕布兰卡已经控制了节奏。' },
      { ply: 39, text: '20.c5 把空间优势变成封锁：黑方的骑士失去 c6 和 d5 的入口。', tag: '[Capablanca: 空间转为限制]' },
      { ply: 41, text: '21.a4 继续扩大后翼，准备把黑方逼到被动结构。' },
    ],
    questions: [
      {
        ply: 8,
        question: '白方为什么主动走 4.Bg5，准备交换自己的黑格主教？',
        options: [
          { label: '减少黑方的防守子力，把局面引向对自己有利的结构', correct: true, feedback: '正确。卡帕布兰卡不害怕交换，只要交换后的结构对自己更好。' },
          { label: '因为白主教没有别的格子可去', feedback: '白主教还有其他选择，交换是主动计划。' },
          { label: '为了立刻将杀黑国王', feedback: '这个阶段离将杀还很远。' },
        ],
      },
      {
        ply: 22,
        question: '轮到白方，最符合卡帕布兰卡思维的计划是？',
        options: [
          { label: 'Ne5 占据强点，同时准备 f4 巩固空间', correct: true, feedback: '正确。先把棋子放到对手赶不走的位置，再推进。' },
          { label: '立刻把后换掉', feedback: '随意兑后会让局面失去控制力。' },
          { label: '把所有的兵都推到国王翼', feedback: '没有准备的进攻只会削弱自己的结构。' },
        ],
      },
      {
        ply: 38,
        question: '白方下一步怎样把空间优势变成真正的限制？',
        options: [
          { label: 'c5，封锁黑骑士的活动格', correct: true, feedback: '正确。空间本身不是目的，让对手的子力无处可去才是。' },
          { label: '交换所有的城堡', feedback: '交换不会自动带来优势。' },
          { label: '把国王走到 h1', feedback: '这一步没有限制作用。' },
        ],
      },
    ],
  },
  {
    id: 'fischer',
    levelId: 3,
    player: '鲍比·菲舍尔',
    playerEn: 'Bobby Fischer',
    title: 'R. 伯恩 vs 菲舍尔 · 1963',
    subtitle: '用连续弃子把国王拖到开阔地',
    model: '动态不平衡',
    modelEn: 'Dynamic imbalance',
    pgn: `1. d4 Nf6 2. c4 g6 3. g3 c6 4. Bg2 d5 5. cxd5 cxd5 6. Nc3 Bg7
7. e3 O-O 8. Nge2 Nc6 9. O-O b6 10. b3 Ba6 11. Ba3 Re8 12. Qd2 e5
13. dxe5 Nxe5 14. Rfd1 Nd3 15. Qc2 Nxf2 16. Kxf2 Ng4+ 17. Kg1 Nxe3
18. Qd2 Nxg2 19. Kxg2 d4 20. Nxd4 Bb7+ 21. Kf1 Qd7`,
    summary: [
      '菲舍尔在这盘棋里没有追求“子力平衡”。他连续用骑士吃兵、吃子，把白国王从 g1 拖到开阔地，同时让自己的主教和后在 d 线上获得最大活动力。',
      '动态不平衡的意思是：账面子力可以暂时不平衡，只要你的子力更活跃、对手的国王更危险。',
    ],
    annotations: [
      { ply: 1, text: '1.d4 白方占中心，准备用 c4 建立空间。' },
      { ply: 10, text: '5.cxd5 cxd5 双方交换，黑方获得一个可以活动的中心。' },
      { ply: 24, text: '12...e5! 黑方用中心反击，打开 e 线和 b7 主教的斜线。', tag: '[Fischer: 用中心反击]' },
      { ply: 26, text: '13...Nxe5 黑骑士吃回，站到中心。' },
      { ply: 28, text: '14...Nd3! 骑士深入白方阵地，直接威胁 f2。', tag: '[Fischer: 动态不平衡]' },
      { ply: 30, text: '15...Nxf2! 弃子换国王的安全与主动权。账面上黑方暂时少子，但白国王被迫离开 g1。' },
      { ply: 32, text: '16...Ng4+ 将军，把白国王继续往开阔地赶。' },
      { ply: 34, text: '17...Nxe3 继续吃子，同时打开后翼的线路。' },
      { ply: 36, text: '18...Nxg2 再把白国王向 g2 拖。', tag: '[Fischer: 国王的位置就是子力]' },
      { ply: 38, text: '19...d4! 冲兵打开 b7 主教的斜线，并制造第二个战场。', tag: '[Fischer: 打开第二条线]' },
      { ply: 40, text: '20...Bb7+ 主教终于沿长斜线将军，白国王只能走到 f1。' },
      { ply: 42, text: '21...Qd7 黑后加入，白方的国王已经暴露在三条线交叉火力下。白方认输。' },
    ],
    questions: [
      {
        ply: 28,
        question: '14...Nd3 和接下来的 Nxf2，属于哪种思维？',
        options: [
          { label: '动态不平衡：用子力换国王的安全与子力活跃度', correct: true, feedback: '正确。菲舍尔算的是“谁的子力更活跃、谁的国王更危险”，而不是账面子力。' },
          { label: '单纯为了多吃两个兵', feedback: '兵只是副产品，核心是把白国王拖出来。' },
          { label: '因为黑方没有别的合法着法', feedback: '黑方有很多安静着法，弃子是主动选择。' },
        ],
      },
      {
        ply: 34,
        question: '白国王被迫从 g1 走到 g2 后，黑方最大的收益是什么？',
        options: [
          { label: '白国王失去易位后的保护，黑方的主教与后获得开放线路', correct: true, feedback: '正确。国王的位置一变，整盘棋的攻防价值都变了。' },
          { label: '黑方多了一个兵', feedback: '兵的数量不是核心。' },
          { label: '白方少了一个城堡', feedback: '这个片段里城堡并没有被吃。' },
        ],
      },
      {
        ply: 38,
        question: '19...d4 这一冲兵的目的是什么？',
        options: [
          { label: '打开 b7 主教的长斜线，同时制造第二个战场', correct: true, feedback: '正确。黑方要让所有子力同时参与，而不是只在一个角落进攻。' },
          { label: '为了升变', feedback: 'd 兵离升变还很远。' },
          { label: '为了和 white 换后', feedback: '黑方要的是进攻，不是简化。' },
        ],
      },
    ],
  },
  {
    id: 'kasparov',
    levelId: 2,
    player: '加里·卡斯帕罗夫',
    playerEn: 'Garry Kasparov',
    title: '卡斯帕罗夫 vs 托帕洛夫 · 1999',
    subtitle: '“卡斯帕罗夫不朽”中的强制着法与国王的长途跋涉（前 27 回合）',
    model: '强制着法优先',
    modelEn: 'Forcing moves first',
    pgn: `1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Be3 Bg7 5. Qd2 c6 6. f3 b5
7. Nge2 Nbd7 8. Bh6 Bxh6 9. Qxh6 Bb7 10. a3 e5 11. O-O-O Qe7 12. Kb1 a6
13. Nc1 O-O-O 14. Nb3 exd4 15. Rxd4 c5 16. Rd1 Nb6 17. g3 Kb8 18. Na5 Ba8
19. Bh3 d5 20. Qf4+ Ka7 21. Rhe1 d4 22. Nd5 Nbxd5 23. exd5 Qd6 24. Rxd4 cxd4
25. Re7+ Kb6 26. Qxd4+ Kxa5 27. b4+ Ka4`,
    summary: [
      '卡斯帕罗夫在这盘棋里连续做出“不自然”的弃子，但每一步都先算出强制着法：将军、吃子、威胁。对手没有选择，只能被一步步赶着走。',
      '当你能把对手的应手压缩到一条线时，物质优势往往要让位于主动权。',
    ],
    annotations: [
      { ply: 1, text: '1.e4 占中心。' },
      { ply: 9, text: '5.Qd2 白后走到 d2，准备长易位，形成对向国王翼进攻的布局。' },
      { ply: 15, text: '8.Bh6 主动交换黑格主教，减少黑国王身边的防守。' },
      { ply: 21, text: '11.O-O-O 长易位，国王翼进攻与后翼安全同时完成。' },
      { ply: 25, text: '13.Nc1 骑士主动回撤，准备经 b3 转到 a5。看似后退，实为重新部署。', tag: '[Kasparov: 重新部署]' },
      { ply: 35, text: '18.Na5 骑士跳到边缘，盯住 b7 和 c4，黑方的后翼开始松动。', tag: '[Kasparov: 边线也是强点]' },
      { ply: 37, text: '19.Bh3 主教换到 h3，瞄准 d7，准备配合后进攻。' },
      { ply: 39, text: '20.Qf4+ 先将军，把黑国王赶向 a7。强制着法优先。', tag: '[Kasparov: 将军优先]' },
      { ply: 43, text: '22.Nd5! 弃骑士，打开 e 线并清除 d5 的防守者。', tag: '[Kasparov: 弃子打开线路]' },
      { ply: 47, text: '24.Rxd4! 再弃城堡，把 d 线彻底打开。', tag: '[Kasparov: 弃城堡继续施压]' },
      { ply: 49, text: '25.Re7+ 强制将军，黑国王被迫走到 b6。' },
      { ply: 51, text: '26.Qxd4+ 继续将军，国王只能走向 a5。' },
      { ply: 53, text: '27.b4+ 兵将军，把黑国王逼到 a4。黑国王开始了著名的长途跋涉。', tag: '[Kasparov: 国王被赶到开阔地]' },
    ],
    questions: [
      {
        ply: 42,
        question: '轮到白方，为什么选择 22.Nd5 弃骑士？',
        options: [
          { label: '打开 e 线并清除 d5 防守者，让后和城堡一起进攻', correct: true, feedback: '正确。强制着法优先：先看能不能用将军或威胁压缩对手的选择。' },
          { label: '白方少一个骑士，但多一个兵', feedback: '物质账不是这步的核心。' },
          { label: '为了让黑方认输', feedback: '认输不会因为一步弃子发生。' },
        ],
      },
      {
        ply: 46,
        question: '24.Rxd4 的目的，最准确的是？',
        options: [
          { label: '弃城堡打开 d 线，把黑后钉在 d6 上', correct: true, feedback: '正确。d 线一开，白方的后和城堡就能持续将军。' },
          { label: '为了吃回一个兵', feedback: '一兵不值得一个城堡。' },
          { label: '为了交换后', feedback: '白方要的是进攻，不是简化。' },
        ],
      },
      {
        ply: 48,
        question: '25.Re7+ 与直接吃后相比，为什么更好？',
        options: [
          { label: '强制将军优先：先把黑国王赶到 b6，再继续计算', correct: true, feedback: '正确。强制着法让对手没有选择，也让你能少算很多分支。' },
          { label: '因为吃后会立刻和棋', feedback: '局面远未到和棋。' },
          { label: '因为城堡在 e7 更安全', feedback: '安全不是这一步的理由。' },
        ],
      },
    ],
  },
]

export function getReview(id: string): Review | undefined {
  return REVIEWS.find((r) => r.id === id)
}
