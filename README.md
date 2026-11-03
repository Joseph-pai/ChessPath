# ChessPath — 10 段位 3D 西洋棋教学

纯前端、可直接部署到 Netlify 的 3D 互动西洋棋教学应用。从认识棋盘开始，走到用摩菲、塔尔、卡帕布兰卡、菲舍尔、卡斯帕罗夫的眼睛看局面。

## 运行

```bash
npm install
npm run dev      # 本地开发，默认 http://localhost:5173
npm run build    # 类型检查 + 生产构建，产物在 dist/
npm run preview  # 预览构建产物
```

要求 Node.js ≥ 18（Netlify 使用 Node 20）。

## 路由

| 路径 | 内容 |
|---|---|
| `/` | 段位地图，10 → 1 按进度解锁 |
| `/level/:levelId` | 段位课：左侧 3D 棋盘，右侧教学面板 |
| `/play` | 自由对弈：选执白/执黑与 4 档难度 |
| `/review/:reviewId` | 名局复盘：逐步播放、注释、暂停问题 |

## 十段位

| 段位 | 内容 |
|---|---|
| 10 | 棋盘、六种棋子、走法、易位/吃过路兵/升变、一步杀 |
| 9 | 莱加尔将杀：第一盘完整引导对局 |
| 8 | 将军、牵制、双攻 |
| 7 | 开局三原则：中心、出子、易位 |
| 6 | 摩菲 · 歌剧院对局 1858 · 带 tempo 出子 |
| 5 | 塔尔 · 布莱德 1965 · 时间 > 子力 |
| 4 | 卡帕布兰卡 · 卡尔巴德 1929 · 向有利结构简化 |
| 3 | 菲舍尔 · 伯恩 vs 菲舍尔 1963 · 动态不平衡 |
| 2 | 卡斯帕罗夫 · 维克安泽 1999 · 强制着法优先 |
| 1 | 雷蒂 vs 塔塔科弗 1910 · 赛前检查清单 |

## 技术栈

- React 18 + TypeScript + Vite
- React Three Fiber + drei + three（棋子用基础几何体拼合，无外部模型）
- chess.js（合法性、将杀/和棋、PGN 解析）
- Zustand（棋盘状态 + localStorage 进度，key `chesspath-progress-v1`）
- Tailwind CSS

`src/lib/ai.ts` 是内置的分级对弈引擎（negamax + alpha-beta + 材料/位置评估），按 4 档难度调整深度与随机率；本项目未引入 Stockfish WASM，以避免部署时的 Worker / WASM 路径问题，纯前端零额外资源即可运行。

## 部署到 Netlify

仓库根目录已包含 `netlify.toml`：

- Build command：`npm run build`
- Publish directory：`dist`
- SPA 回退：`/* → /index.html`（200）
- `NODE_VERSION = 20`

在 Netlify 里连接 GitHub 仓库后无需额外配置即可部署。

## 目录

```
src/
├── components/     # Shell、BoardStage、ProgressDots、ResultModal
├── data/           # level10/9/8/7、reviews、reviewLevels、levels
├── lib/            # chessEngine、pgn、ai
├── pages/          # Home、Level、Play、Review
├── scene/          # ChessScene、Board、Pieces、PieceModel、Highlights、Arrows、CameraRig
├── store/          # board、progress
└── types.ts
```
