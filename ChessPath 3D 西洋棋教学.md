ChessPath — 10 段位 3D 西洋棋教学 Web App

## 0. 角色与目标

你是一位资深前端架构师兼西洋棋教学内容设计师。请从零构建一个 **纯前端、可直接部署到 Netlify 的 3D 交互式西洋棋教学应用**，名称暂定 **ChessPath**。

核心目标：让一个完全不懂西洋棋的用户，通过 10 个段位（Level 10 → Level 1）的引导式课程，从认识棋子与棋盘开始，逐步学会下完第一盘棋，最终在 Level 6–1 中通过历史上著名棋手的对局与思路，理解高手如何布局与思考。

**交付标准**：代码放入 GitHub 仓库，Netlify 连接仓库后一键部署即可运行，无需后端服务。

---

## 1. 技术栈与硬性约束

| 层面 | 选型 | 说明 |
|---|---|---|
| 框架 | **React 18 + TypeScript + Vite** | 静态站点，Netlify 默认支持 |
| 3D 渲染 | **React Three Fiber (@react-three/fiber) + @react-three/drei** | 用 `Canvas`、`OrbitControls`、基础几何体构建 3D 棋盘与棋子 |
| 棋规引擎 | **chess.js** | 负责合法性校验、局面状态、走子记录、将杀/和棋判定 |
| AI 对手 | **stockfish.js**（WASM 版本） | 通过 `UCI_LimitStrength` + `UCI_Elo` / `Skill Level` 实现 10 档难度 |
| 样式 | **Tailwind CSS** 或 CSS Modules | 简洁、教学感强，不喧宾夺主 |
| 状态管理 | Zustand 或 React Context | 管理当前段位、课程进度、棋盘局面、教学模式 |
| 部署 | **Netlify**，提供 `netlify.toml` | Build: `npm run build`，Publish: `dist`，SPA fallback 到 `/index.html` |

**硬性约束**：
- 不引入后端、数据库或登录系统。进度用 `localStorage` 持久化。
- 所有棋子/棋盘资源用 3D 几何体或内嵌 GLTF 生成，不依赖外部 CDN 模型（避免部署后资源 404）。
- 移动端可用：Canvas 自适应容器尺寸，支持触控旋转/缩放。

---

## 2. 信息架构与路由

```
/                     → 首页：段位地图（10 → 1），显示解锁/完成状态
/level/:levelId       → 段位主界面：左侧 3D 棋盘，右侧教学面板
/play                 → 自由对弈模式（AI 难度手动选择）
/review/:gameId       → 经典对局复盘（只读，带注释）
```

段位 `levelId` 为 10 到 1 的整数。**Level 10 为入口，必须默认解锁**；完成当前段位的“通关任务”后解锁下一级。

---

## 3. 十段位教学大纲（内容层，必须逐条实现）

每个段位由 **3–5 个“微课步骤”** 组成，每一步对应一次棋盘上的高亮/动画/交互。右侧面板用卡片展示“概念 → 例子 → 你的任务”。

### Level 10：完全初学者——棋盘、棋子与基本规则

| 步骤 | 教学内容 | 3D/交互要求 |
|---|---|---|
| 10.1 | 棋盘：8×8 共 64 格，浅色/深色交替；a–h 列，1–8 行 | 3D 棋盘淡入，交替格子依次亮起，坐标轴以标签形式出现 |
| 10.2 | 6 种棋子名称与初始位置：兵、马、象、车、后、王 | 镜头依次聚焦每个棋子，右侧显示中文名 + 英文名 + 初始格 |
| 10.3 | 每种棋子的**基本走法**：兵向前 1 格（首步可 2 格，斜吃）；马走“日”；象走斜线；车走直线；后横直斜；王 1 格 | 选中一个棋子，棋盘上高亮所有合法目标格（用 chess.js 生成 legal moves 后映射到 3D） |
| 10.4 | 特殊规则：王车易位、吃过路兵、兵升变 | 分别用预设局面演示，每一步有箭头与文字说明 |
| 10.5 | 胜负标准：将杀（checkmate）、逼和（stalemate）、和棋条件 | 用 2–3 个极简局面演示“被将军 → 将杀”，弹出胜负弹窗 |

**通关任务**：在引导下完成“一步杀”局面（给出 1 个合法将杀着法即可）。

### Level 9：第一盘完整对局引导

**这是用户第一次从头到尾下完一盘棋。** 不要求用户思考复杂战略，而是由系统作为“教练”，白方（用户）走一步，黑方（AI）按预设回应走一步，每一步右侧面板解释“你为什么可以这样走”以及“对手为什么这样应”。

实现方式：
- 预设一条**极简的 10–15 步教学对局线**（例如 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.O-O Nf6 等）。
- 用户走白方时，仅允许走教学线中的着法（或给出 2–3 个合法选择，其中一个是“推荐”）。黑方 AI 固定走预设回应，不走 Stockfish。
- 每一步的 3D 棋盘上：用户棋子拖拽/点击移动，黑方回应用动画移动；右侧显示“这一步在做什么”的一句话解释。
- 对局结束后展示“你完成了第一盘棋”与关键节点回顾。

### Level 8–7：基础战术与常见错误

- **Level 8**：将军、应将、闪击、牵制、双攻。用小型局面练习，用户需要在棋盘上指出“被牵制的棋子”或走出“双攻”。
- **Level 7**：开局三原则——控制中心、快速出子、尽早易位。用正误对比：两个开局前 5 步并排（或先后）演示，用户判断哪个更好。

### Level 6–1：以名棋手为“思维模型”的高手课

**每个段位绑定一位棋手的一种核心思维方式，并通过其经典对局的关键片段来教学。** 对局片段以 `review` 模式逐步播放，每一步有注释，暂停后用户回答一个理解性问题。

| 段位 | 棋手 | 核心思维 | 教学对局/片段 | 必须讲清的要点 |
|---|---|---|---|---|
| **Level 6** | **Paul Morphy** | 快速出子、用“ tempo” 逼迫对手 | **Opera Game（1858）** 前 16 回合 | 控制中心 → 带威胁出子 → 不为小利偏离出子 → 弃子打开线路 → 易位同时攻击 |
| **Level 5** | **Mikhail Tal** | 弃子换取主动权和进攻时间 | Tal vs Oll（1986）或 Tal 经典攻击对局片段 | “时间比子力更重要”；“数战场上的子，不数棋盘上的子”；攻击时进攻子力必须多于防守子力 |
| **Level 4** | **José Raúl Capablanca** | 局面简化、积累微小优势、限制对手 | Capablanca vs Treybal 或经典残局片段 | 先问“对手想干什么”；控制中心以限制对方子力；优势时向对自己有利的结构简化，而非随意兑子 |
| **Level 3** | **Alexander Alekhine** 或 **Bobby Fischer** | 动态不平衡、利用空间与子力协调 | 选一局经典片段 | 讲清“局面型弃子”与“子力活跃度”的评估 |
| **Level 2** | **Garry Kasparov** | 动态防守、计算强制着法、主动权 | 选一局 Kasparov 的典型进攻对局片段 | 强制着法优先；在对手反击前制造多重威胁 |
| **Level 1** | **综合大师思维** | 将 Level 6–2 的原则整合为“赛前清单” | 用一盘完整短对局做综合复盘 | 开局原则 → 中局战术检查 → 残局简化，用户需要在关键节点做出选择 |

> Level 3–1 的具体对局可选经典短对局，但每个段位必须绑定**一种可命名的思维工具**，并配有 2–3 个“暂停判断”问题。

---

## 4. 3D 棋盘与棋子实现规范

### 4.1 场景结构

```
Canvas (camera: PerspectiveCamera, position: [0, 7, 9], fov: 45)
  ├─ ambientLight + directionalLight（投射阴影）
  ├─ Board (8×8 格子，用 BoxGeometry 薄板，深/浅材质)
  ├─ Pieces (每个棋子一个 group，由基础几何体拼合)
  ├─ HighlightLayer (透明薄片，高亮选中格/合法目标格/上一步)
  ├─ ArrowLayer (用 TubeGeometry 或 drei 的 Line 绘制走法箭头)
  └─ OrbitControls (enablePan: false, minDistance: 6, maxDistance: 16)
```

### 4.2 棋子几何体方案（不依赖外部模型）

为降低部署风险，**优先用基础几何体拼合可辨识的棋子**：

- **兵**：小圆柱 + 球体顶部
- **车**：圆柱底座 + 方柱体 + 顶部小圆柱（城垛感）
- **马**：底座 + 倾斜的盒体 + 球体头部（简化马头）
- **象**：底座 + 细圆柱 + 球体 + 小尖锥
- **后**：底座 + 高圆柱 + 球体 + 小圆环（皇冠感）
- **王**：底座 + 高圆柱 + 球体 + 十字（两个薄盒体交叉）

白方与黑方用材质颜色区分（白：米白/浅灰；黑：深灰/炭黑），选中时加发光描边或轻微抬升。

### 4.3 走子交互

- **点击选中**：Raycaster 检测点击的棋子 → 若属于当前走子方，设为选中，调用 `chess.moves({ square, verbose: true })` 获取合法目标格，在对应格子显示半透明高亮。
- **移动**：点击高亮格 → `chess.move({ from, to, promotion: 'q' })` → 棋子从 from 动画插值到 to（约 0.25s），棋盘状态更新。
- **非法移动**：点击非高亮格取消选中；点击对方棋子切换选中（如果合法）。
- **吃子**：目标格有敌方棋子时，敌方棋子先缩放消失，再移入我方棋子。

---

## 5. 教学模式 vs 对弈模式

应用需要明确区分两种棋盘行为，用 `boardMode: 'lesson' | 'play' | 'review'` 控制。

### 5.1 lesson 模式（Level 10–7 及 Level 6–1 的引导阶段）

- 棋盘可以处于“锁定走子”状态，只允许用户执行教学线中的着法；或处于“自由走子但仅限合法着法”状态。
- 右侧面板显示当前步骤的标题、解释文本、以及“下一步”按钮。
- 需要支持“高亮某个棋子”“高亮某些格子”“在棋盘上画箭头”“播放一段自动走子序列”。
- 每一步教学步骤可以附带一个 `onStepEnter` 回调，用来设置 3D 场景状态（镜头位置、高亮、箭头）。

### 5.2 play 模式（Level 9 第一盘棋 + 自由对弈 + 段位通关对局）

- 用户执白（默认）或选择执黑。
- AI 对手的难度由当前段位映射到 Stockfish 设置：
  - Level 10–9：不使用 Stockfish，走预设线或从“极弱合法着法池”中随机选择。
  - Level 8–7：`UCI_LimitStrength = true`, `UCI_Elo = 600–900`，或 `Skill Level = 0–2`。
  - Level 6–4：`UCI_Elo = 1000–1400`。
  - Level 3–1：`UCI_Elo = 1500–2000`（仍低于人类高手，但足以演示原则）。
- Stockfish 以 Web Worker 运行，`postMessage` 发送 `position fen ...` / `go movetime 200`，接收 `bestmove` 后映射到 chess.js 走子。
- 走子后检测 `chess.isCheckmate()` / `isStalemate()` / `isDraw()`，弹出结果面板。

### 5.3 review 模式（名局复盘）

- 加载一个 PGN 字符串（内嵌在代码中，不请求外部），用 `chess.loadPgn()` 解析。
- 提供“上一步 / 下一步 / 自动播放”控制，棋盘随 PGN 着法更新。
- 每一步可以绑定一条注释（`annotations[moveIndex]`），右侧显示。
- 在预设的关键节点暂停，弹出选择题或“你认为下一步走哪里？”的交互，用户点击棋盘后再继续。

---

## 6. 进度与段位解锁

```ts
type Progress = {
  completedLevels: number[];       // 已完成段位 id
  currentLevel: number;            // 当前解锁的最高段位（10 为起点）
  levelStepIndex: Record<number, number>; // 每个段位内已完成到第几步
};
```

- 初始 `currentLevel = 10`，`completedLevels = []`。
- 每个段位有一个“通关条件”函数（例如：完成所有教学步骤 + 在 play 模式中赢下一盘简化对局 / 答对 3 个关键问题）。
- 通关后：`completedLevels.push(levelId)`，`currentLevel = Math.min(currentLevel, levelId - 1)`，写入 `localStorage`。
- 首页段位地图根据进度显示：已解锁可进入 / 未解锁置灰 / 已完成打勾。

---

## 7. 代码结构与关键文件

```
src/
├── main.tsx
├── App.tsx                    # 路由
├── types/
│   └── chess.ts               # Square, Piece, LessonStep, GameReview 等类型
├── lib/
│   ├── chessEngine.ts         # chess.js 封装：legalMoves, makeMove, status
│   ├── stockfish.ts           # Worker 初始化、难度配置、getBestMove
│   └── pgn.ts                 # PGN 加载与注释映射
├── data/
│   ├── levels.ts              # 10 个段位的元数据、步骤、通关条件
│   ├── lessons/               # 各段位的 lesson step 数组
│   └── reviews/               # 名局 PGN + 注释 + 关键节点问题
├── scene/
│   ├── ChessScene.tsx         # Canvas + 灯光 + OrbitControls
│   ├── Board.tsx
│   ├── Piece.tsx              # 按类型渲染几何体
│   ├── Highlights.tsx
│   └── Arrows.tsx
├── components/
│   ├── LessonPanel.tsx
│   ├── LevelMap.tsx
│   ├── GameControls.tsx
│   └── ResultModal.tsx
├── store/
│   └── useProgress.ts
└── netlify.toml
```

**`netlify.toml` 必须包含**：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 8. 分阶段开发指令（按顺序执行，每阶段完成后暂停等待确认）

### 阶段 1：项目骨架 + 3D 棋盘 + chess.js 走子

1. 初始化 Vite + React + TS 项目，安装依赖：`@react-three/fiber @react-three/drei three chess.js stockfish zustand`。
2. 实现 `ChessScene`：深色/浅色 8×8 棋盘，`OrbitControls` 可旋转缩放。
3. 用基础几何体实现 6 种棋子的 `Piece` 组件，按 chess.js 的初始 FEN 摆放。
4. 实现点击选中与合法走子：选中棋子 → 高亮 `legalMoves` → 点击目标格 → `chess.move` → 动画更新。
5. 在页面角落显示当前 FEN 和走子方，用于调试。

**验收**：可以在 3D 棋盘上完整走完一盘随机对局，所有非法走子被拒绝。

### 阶段 2：教学框架 + Level 10

1. 建立 `levels.ts` 与 `LessonStep` 类型，定义 `highlightSquares`、`arrows`、`cameraTarget`、`lockedMoves` 等教学指令字段。
2. 实现 `LessonPanel` 与步骤推进逻辑。
3. 完成 Level 10 的 5 个步骤，每个步骤按大纲实现 3D 演示与交互。
4. 实现首页段位地图（10 默认解锁，其余置灰）。

**验收**：新用户可以从首页进入 Level 10，依次完成 5 个步骤，每个步骤的棋盘状态与文字说明一致。

### 阶段 3：Level 9 第一盘引导对局

1. 在 `data/lessons/level9.ts` 中定义一条 10–15 步的教学对局线，每步包含：用户可选着法、黑方预设回应、解释文本。
2. 实现 `play` 模式下的“引导线”逻辑：用户只能走教学线着法或合法备选，黑方按预设回应。
3. 走完对局后弹出完成面板。

**验收**：一个从未下过棋的用户可以按照提示，从第一步走到将杀/结束，每一步都有解释。

### 阶段 4：Level 8–7 战术与开局原则

1. 实现可交互的“找出被牵制棋子”“走出双攻”等小练习。
2. 用两个简短开局序列做正误对比演示。
3. 绑定通关条件。

### 阶段 5：Stockfish 分级 AI + 自由对弈

1. 将 `stockfish.js` 放入 `public/` 或通过 Vite worker 方式引入，确保 Netlify 构建后 Worker 路径正确。
2. 实现 `stockfish.ts`：初始化 Worker，接收难度配置，返回 `bestmove`。
3. 实现 `play` 模式：用户走子 → 若对局未结束，请求 Stockfish → 走黑方回应。
4. 难度映射按第 5.2 节执行，确保 Level 10–9 不走 Stockfish 强制引擎。

**验收**：用户可以选择执白或执黑，与分级 AI 完成整盘对局，强度随段位变化。

### 阶段 6：Level 6–1 名局复盘

1. 在 `data/reviews/` 中内嵌 Morphy Opera Game、Tal、Capablanca 等 PGN 字符串与逐步注释。
2. 实现 `review` 模式：PGN 逐步播放、上一步/下一步、自动播放、注释面板。
3. 在每个段位的关键节点插入“暂停判断”问题（选择题或点击棋盘选点）。
4. 每个段位绑定一个“思维工具总结卡”，完成后进入下一级。

**验收**：Level 6–1 每一级都能加载对应 PGN，注释与棋盘同步，暂停问题可交互。

### 阶段 7：Netlify 部署配置与打磨

1. 添加 `netlify.toml`（见第 7 节）和 `README.md`（含 `npm install` / `npm run dev` / `npm run build` 说明）。
2. 确保 `stockfish.js` 和相关 WASM 文件在构建产物中可被 Worker 加载；如遇路径问题，使用 `new Worker(new URL('...', import.meta.url))` 或放在 `public/` 并用绝对路径。
3. 移动端适配：棋盘区域在窄屏下占满宽度，教学面板折叠到下方。
4. `localStorage` 进度读写测试。

**验收**：GitHub 仓库连接到 Netlify 后，零配置即可部署成功，首页可访问，Level 10 可进入并完成第一步。

---

## 9. 内容编写要求（给 AI 的写作约束）

- 所有教学文本用**简体中文**，语气友好、具体、无术语堆砌。首次出现的术语（如“牵制”“易位”）必须附带一句白话解释。
- 每个教学步骤的文本控制在 **60–120 字**，不一次性灌输过多。
- 举例必须**在棋盘上可见**：说到哪个格子，棋盘上就高亮哪个格子；说到某条线路，就画出箭头。
- Level 6–1 的注释必须明确标注“这一步体现的思维模型”，例如 `[Morphy: 带 tempo 出子]`、`[Tal: 时间 > 子力]`、`[Capablanca: 向有利结构简化]`，让用户能形成可迁移的思考工具。
- 不要使用“显然”“众所周知”等预设用户已懂的措辞。

---

## 10. 最终验收清单

- [ ] 首页 10 个段位可见，Level 10 可进入，其余按进度解锁。
- [ ] Level 10 的 5 个步骤均可在 3D 棋盘上交互完成。
- [ ] Level 9 用户可以完整走完第一盘引导对局，每一步有解释。
- [ ] Level 8–7 的战术/开局练习可交互并判定正确/错误。
- [ ] Level 6–1 每一级绑定一位棋手、一种思维模型、一盘内嵌 PGN 的复盘，关键节点有暂停问题。
- [ ] Stockfish 分级 AI 在 play 模式中工作，Level 10–9 不使用 Stockfish。
- [ ] `netlify.toml` 存在，`npm run build` 成功，`dist` 可部署。
- [ ] 进度写入 `localStorage`，刷新不丢失。
- [ ] 移动端可正常旋转棋盘、走子、阅读面板。

---

**开始执行时**：先完成“阶段 1”，将项目跑起来，把可交互的 3D 棋盘截图或运行结果反馈给我确认，再继续阶段 2。不要一次性生成全部代码，按阶段验证，确保每一步都可运行。