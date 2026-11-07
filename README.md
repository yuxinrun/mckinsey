# 把话想清楚 · 鱼心快跑

> 用大白话讲透公开可查的思维方法与模型：MECE、金字塔原理、假设驱动、7S、三层面增长、九宫格、七步法……不卖课，不卖焦虑，只讲今天下午就能用上的思考工具。

一个**纯静态中文科普站**：原生 HTML / CSS / JavaScript，无框架、无构建步骤、无运行时依赖、无 CDN。全站 **60 页** = 12 个手写页面 + **48 个逐招独立详解页**。

本站是「鱼心快跑 / Yuxin Runs」品牌下的独立科普作品，**不是 McKinsey & Company 的官方网站，与其无任何隶属、授权或代言关系**。所有方法与工具的归属逐条标注，示例数字一律注明为教学示意。详见「内容纪律」与 `about.html`。

---

## 目录

- [快速开始](#快速开始)
- [站点规模与页面地图](#站点规模与页面地图)
- [目录结构](#目录结构)
- [改内容：生成器工作流](#改内容生成器工作流)
- [改样式与交互](#改样式与交互)
- [设计与品牌](#设计与品牌)
- [内容纪律：事实、分级与归属](#内容纪律事实分级与归属)
- [发布前自检](#发布前自检)
- [部署](#部署)
- [维护约定与已知坑](#维护约定与已知坑)

---

## 快速开始

只需要一个浏览器；只有**重新生成 48 个单招页**时才需要 Python 3。

```powershell
# 方式一：直接打开（静态内容全部可看）
start index.html

# 方式二：本地静态服务器（推荐，朗读、主题、转场等行为与线上一致）
python -m http.server 8000
# 浏览器访问 http://localhost:8000/
```

- 没有 `package.json`、没有 `npm install`、没有 `dist/`：改完文件刷新即可。
- 站点全部使用**相对路径**，可直接放在任意子目录下托管。
- 朗读使用浏览器 Web Speech API（`speechSynthesis`），不同浏览器的中文语音与连播表现会有差异。

---

## 站点规模与页面地图

| 分组 | 页面 | 说明 |
| --- | --- | --- |
| 入口 | `index.html` | 首页：主张、四步示意图、板块导航 |
| 方法论全集 | `methods.html` | 48 招总目录表，每行链接到对应详解页 |
| 分类页 ×4 | `methods-solving.html`、`methods-strategy.html`、`methods-org.html`、`methods-comm.html` | 每页 12 张卡片，含「展开讲透这一招」入口 |
| 单招详解页 ×48 | `method-s01.html` … `method-s12.html`、`method-t01` … `t12`、`method-o01` … `o12`、`method-c01` … `c12` | **由 `build_methods.py` 生成，不要手改** |
| 内容页 ×6 | `business.html`、`thinking.html`、`models.html`、`practice.html`、`library.html`、`about.html` | 公司事实、底层思维、模型工具箱、七步演练、资料库、纪律与免责 |

四类各 12 招：`solving`（解题与分析，teal）、`strategy`（战略与增长，blue）、`org`（组织与运营，lime）、`comm`（表达与沟通，coral）。

**每个单招详解页固定包含**：一张结构图 + 三步上手 + 一个「周末咖啡摊」示意算例 + 第二张算例图 + 三条常见翻车 + 一个可玩组件 + 带走一句 + 归属与口径 + 相关三招 + 上一招/下一招翻页。

**朗读连播**由每个 `<body>` 上的 `data-next` 串成链：主链为 `index → methods → 四个分类页 → practice → library → about → index`，`business → thinking → models` 另成一段并汇入 `practice`；48 个单招页按 `S01 → … → C12 → methods.html` 顺序连播，从目录点进任一招即可接入。新增或删减页面时记得维护这条链。

---

## 目录结构

```
mckinsey/
├── index.html                  12 个手写页面
├── methods.html
├── methods-{solving,strategy,org,comm}.html
├── business.html / thinking.html / models.html
├── practice.html / library.html / about.html
├── method-*.html               48 个生成页面（勿手改）
├── build_methods.py            内容源 + 生成器（Python 标准库）
├── assets/
│   ├── style.css               设计 token、组件、图表、响应式、动效
│   ├── app.js                  导航/页脚/播放条注入、主题、朗读、交互
│   ├── logo.svg / logo-dark.svg / favicon.svg / mascot.svg
├── .qoder/
│   ├── research-mckinsey.md    事实库 A：公司事实、书目、报告（36 条）
│   └── research-methods.md     事实库 B：框架与工具归属（30 条）
└── README.md
```

`.qoder/` 是**内容依据而非 IDE 缓存**，应与站点一起纳入版本管理；`__pycache__/` 才是可忽略的临时产物。

---

## 改内容：生成器工作流

`build_methods.py` 是 48 招的唯一内容源。改内容改 `DATA`，重跑生成器：

```powershell
python build_methods.py
# generated 48 standalone pages
```

生成器会：

1. 校验 `len(DATA) == 48`；
2. 用 `TPL` + `page_html()` 重写 48 个 `method-<mid>.html`；
3. 用 `rewrite_links()` 回写 `methods.html` 的 48 条「展开讲 →」链接，以及四个分类页每张卡片的 `.mt-more` 详解入口。

**回写是幂等的**：`.mt-more` 已存在就跳过，重复运行不会产生重复标签；`methods.html` 的目录链接只在尚未改写时替换，另外只替换两处固定的旧口径句子，其余手写文案保持原样。因为链接已是最新，幂等重跑时可能**不打印**分类页的回写日志，这是正常的。

### 一条数据的结构

`DATA` 里每招是一个 `M(...)` 调用，按位置传 16 个字段：

| 字段 | 含义 |
| --- | --- |
| `mid` / `name` / `en` | 编号（如 `s01`）、中文名、英文名 |
| `grade` / `cat` | 归属分级 `A`/`B`/`C`；分类键 `solving`/`strategy`/`org`/`comm` |
| `ask` / `plain` | 这一招回答什么问题；一句话人话版 |
| `core` / `steps` | 两段核心解释；三步上手（3 条） |
| `example` / `traps` / `take` | 咖啡摊算例；3 条常见翻车；带走一句 |
| `chart` / `ex` | 两张图的配置（结构图、算例图） |
| `tool` | 一个微交互组件配置 |
| `related` / `keywords` | 3 个相关招式的 `mid`；关键词标签 |

文本里可用 `[[数字]]` 做高亮、`**词**` 做加粗；其余内容由 `fmt()` 自动 HTML 转义，不需要手写标签。

### 图表类型（`chart` / `ex` 的 `type`）

`flow`、`bars`、`table`、`matrix`、`cycle`、`layers`、`waterfall`、`scale`、`pyramid`、`formula`、`compare`、`tree` 共 12 种，由 `render_chart()` 渲染。`norm(items, n)` 会把每项字段数补齐/截断到目标长度，因此配置里多写或少写一个字段不会让生成中断。每个图表都自带「结论」与「口径」两行，改动时不要删掉。

### 微交互类型（`tool`）

| 值 | 效果 | 配置形态 |
| --- | --- | --- |
| `check` | 勾选自检并给一句反馈 | `('check', [条目…])` |
| `flip` | 翻卡对照 | `('flip', [条目…])` |
| `quiz` | 一题小测，选完给对错解释 | `('quiz', (题干, 正确项, [干扰项…]))` |
| `slider` | 拖动滑块看公式与结果变化 | `('slider', {mn, mx, step, val, calc, formula, label})` |

生成的是静态 HTML，交互逻辑在 `assets/app.js` 的 `initMethodTools()` 里，靠 `data-mp-tool` 分派。

### 常见维护动作

| 想做什么 | 改哪里 |
| --- | --- |
| 改某一招的文案、数字、图 | `build_methods.py` 的 `DATA` 对应条目，然后重跑生成器 |
| 改所有详解页的版式 / 段落 / 归属声明 | `TPL` 与 `page_html()`，然后重跑生成器 |
| 改 12 个主页面的内容 | 直接改对应 `.html` |
| 改分类名、配色、分类页文件名 | `CATS` 字典（同时检查 `assets/app.js` 的 `PAGES`） |
| 改视觉、图表样式、动效 | `assets/style.css` |
| 改导航、朗读、主题、微交互逻辑 | `assets/app.js` |

> 若招式数量不再是 48，请同步改 `main()` 里的断言、`page_html()` 中的 `/ 48` 文案、`methods.html` 表格、`about.html` 的页数口径以及首页文案。

---

## 改样式与交互

- `assets/style.css`：`:root` / `html.dark` 定义全部设计 token；`.mp-*` 是单招页组件；`.mp-matrix` 等是 12 类图表；断点为 `960px` / `760px`，并带 `prefers-reduced-motion` 降级。图表默认可见，滚动进入时由 `.fig.in` / `.reveal.in` 播放进场动画——**不要用 `opacity: 0` 做门控**，否则观察器未触发时图会隐形。
- `assets/app.js`：单文件 IIFE，页面加载后注入导航、页脚与底部播放条。主要入口为 `buildNav()` / `buildFooter()` / `buildAudioBar()` / `initAudio()` / `initVisuals()` / `initPageTransition()` / `initMotion()` / `initMethodTools()`，另有一组主内容页的交互初始化（`initRadar()`、`initNineBox()`、`initMece()` 等）。
- 单招页的 `data-page="m-<mid>"` 会让导航把「方法论全集」标为当前项。
- 单招页支持键盘 `←` / `→` 翻招；卡片光斑、点击涟漪、返回顶部、目录跟随高亮都由 `initMotion()` 统一绑定。

---

## 设计与品牌

「鱼心快跑 / Yuxin Runs」有一套跨站设计系统（配色、字体排印、尺寸节奏、组件版式、七条不可让步的纪律，以及大众科普站的六条附加纪律），本站是它在纯静态站上的落地；真正生效的值都在 `assets/style.css`。要点：

- 暖白纸面 + 深海墨绿，青色 `--accent` 作唯一主强调、珊瑚红 `--coral` 表示风险、蓝色 `--blue`、柠檬绿 `--lime` 作第三/四系列。
- 明暗主题只换 CSS 变量（`html.dark`），`meta[name=theme-color]` 与 logo 由 `app.js` 同步；主题选择存 `localStorage`。
- 元信息用等宽大写小字，正文用 sans；虚线、点阵、大扩散阴影构成「工程蓝图」质感。
- 窄屏做**结构变形**而非等比缩放；`prefers-reduced-motion: reduce` 时关闭动效。
- 品牌资产（logo / favicon / 吉祥物）在 `assets/`，按主题重画，明暗两版仅换 `fill`。

---

## 内容纪律：事实、分级与归属

两份事实库是正文的依据，调研日期 **2026-11-07**：

| 文件 | 内容 |
| --- | --- |
| `.qoder/research-mckinsey.md` | 36 条：公司事实、书目、报告与出处 |
| `.qoder/research-methods.md` | 30 条：框架与工具的归属（A 16 / B 9 / C 5） |

**A / B / C 分级**（对应生成器里的 `GRADE`）：

- **A · 一手可核**：官网专文、官方解决方案页、原书或权威书目可直接核到；本站只做通俗化转述。
- **B · 需带限定词**：通用工具被这套流程收编、合作开发，或仅有二手来源。好用，但别写成「麦肯锡发明」。
- **C · 流传说法**：归属常被误传或只是业内口头说法，收录是为了讲清它是什么，不是给它认爹。

红线（详见 `about.html`）：

1. 正文里出现的每个数字都要能在事实库里找到出处；查不到就写「不知道」。
2. 所有示例（周末咖啡摊、人数、比例、评分）都是**教学示意**，必须在图表或段落里标口径；不装成调研数据，不用于论证真实世界。
3. 每 400–600 字至少一个可视化；每张图自带一句结论，供听书场景使用。
4. 不冒充官方模板，可填表标注「本站改编，非官方」；不替读者下投资、法律、税务、经营、医疗或职业变动的个案结论。
5. 每页保留归属说明、免责声明与「下一步该找谁」。
6. 与 McKinsey & Company 无隶属、授权或代言关系，不代表其立场，也不构成对其服务的推荐或评价。

---

## 发布前自检

```powershell
python -m py_compile build_methods.py     # 生成器语法
python build_methods.py                   # 重新生成：打印 generated 48 standalone pages
node --check assets/app.js                # 可选：JS 语法（需 Node.js）
git status --short                        # 确认改动范围
```

人工核对清单：

- [ ] `method-*.html` 恰好 48 个，站内 HTML 总数 60 个；`DATA` 断言通过。
- [ ] `methods.html` 48 行编号与文件名一一对应（`S01 → method-s01.html` … `C12 → method-c12.html`）。
- [ ] 四个分类页各有 12 个 `.mt-more`，`methods-comm.html` 的卡片 id 是 `p1`–`p12` 但文件名是 `method-c01`–`c12`。
- [ ] 无残留占位符 `{{...}}`、无指向不存在文件的站内链接。
- [ ] 每页 2 张 `<figure>`、1 个 `.mp-tool`、`.mp-pager` 与 `.mp-credit` 齐全。
- [ ] 桌面与 375px 窄屏各抽查一页：图表可见、无横向溢出、导航 active 正确、翻页与四类微交互（各挑一页）可用。
- [ ] `prefers-reduced-motion` 下动画关闭，键盘可操作。

---

## 部署

仓库根目录**就是站点根目录**，无需构建产物，任何静态托管（GitHub Pages、对象存储静态网站、Nginx 等）直接发布整个目录即可。

- 部署前跑一次 `python build_methods.py`，保证生成页与 `DATA` 一致。
- 站点内链接均为相对路径，放在子路径下也能工作。
- 建议一并发布 `.qoder/`（正文数字与归属的依据）；可忽略 `__pycache__/` 等本地临时产物。
- 仓库目前**没有** CI workflow 与 `.gitignore`；如需自动化发布或忽略规则，请自行添加。

---

## 维护约定与已知坑

- **不要直接编辑 48 个 `method-*.html`**：下次生成会被整体覆盖。同理，别在 `methods.html` 的手写表格里直接改「展开讲」链接。
- `CATS['comm']` 有 `anchor='p'` + `mid='c'` 两个值：分类页卡片锚点沿用了 `p1`–`p12`，但生成文件名用 `c01`–`c12`。`rewrite_links()` 用 `cat.get('mid', cat['anchor'])` 处理这个例外，改分类页时别把这个特例「顺手统一」掉。
- 生成器只依赖 Python 标准库（`os` / `re` / `html`），写文件固定 `encoding='utf-8'`、`newline=''`。日志用 ASCII 是有意的：Windows 控制台默认 cp1252，中文 `print` 会抛 `UnicodeEncodeError`。
- `page_html()` 会读取相邻 `DATA` 项生成上一招/下一招与相关招式，因此 `related` 里必须是存在的 `mid`，删招时要一并清理。
- 朗读链、导航高亮、页脚、播放条都由 `app.js` 在运行时注入；新增主页面时记得同步 `PAGES` / `MAIN_IDS` / `MORE_GROUPS`。
- 修改归属分级、免责声明或事实库时，`library.html` 与 `about.html` 的口径要一起核对。
