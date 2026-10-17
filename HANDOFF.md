# 交接说明

> 写给下一个接手的人（或未来的自己）。假设你**完全不了解**这里发生过什么。
> 最后更新：**2026-10-16**（上一版 2026-10-13）

---

## 〇、新会话从这里开始（30 秒上手）

**这个仓库现在的状态**（2026-10-18 02:50 更新）：`main` 与 `origin/main` 同步，工作区有一批**未提交**改动（见下面「本轮改动」），改动验证过：主站 `vitest` 139 项全绿、`vite build` 绿、博客 `astro build` 23 页绿、首页/归档/关于三页已截图核对。

**本轮改动（2026-10-18，去模板化收尾）**：

| 文件 | 改了什么 |
| --- | --- |
| `src/components/Footer.jsx` | 页脚「归档」「标签」原本指向 `/archive`、`/tags`——那两个路由随旧博客系统一起删了，点击会被通配路由弹回首页。改为博客子站的 `blog/archive/`、`blog/tags/`（标 `external` 走 `<a href>`）；顺带把重复的 `/about` 项（React key 冲突来源）去掉 |
| `blog/src/config/siteConfig.ts` | 按「有没有真内容」重定页面开关：`guestbook`/`dynamic`/`projects`/`gallery`/`sponsor` 全关（对应内容目录为空、评论系统未接、收款码未换），导航与 sitemap 一并消失；清空 mal/bangumi/vndb/bilibili 里模板作者的账号 |
| `blog/src/config/commentConfig.ts` | 清空 twikoo/waline/artalk/giscus/disqus 的模板作者与官方 demo 端点，避免哪天切 `type` 就把评论写进别人家 |
| `blog/src/config/backgroundWallpaper.ts` | 首页横幅从模板作者的流萤立绘换成 `scene-blog.jpg`（主站同场景壁纸副本）；标题 `Lovely firefly!` → `年下牧马`，六条流萤英文语录换成三句自己的；背景视频（`bed.twoleaf.cn` 上的作者视频）停用 |
| `blog/src/config/pioConfig.ts` | 看板娘开场白去掉「我是流萤~」 |
| `blog/src/pages/rss.xml.ts`、`blog/src/utils/feed-utils.ts` | RSS/Atom 的 channel link 与 `rel="self"` 原本掉到根域（`https://nianxiamuma.github.io/`），补上 `/portfolio/blog` base 前缀 |
| `blog/astro.config.mjs` | sitemap 过滤逻辑拿不含 base 的 `/gallery/` 去比含 base 的 pathname，永远不匹配 → 关掉的页面照样进 sitemap。改为先剥 base 再判断；补上模板漏掉的 `/projects/` 一条 |

**正在进行的计划**：`.rivet/plans/网站完成度设计-对标-6-个参照站-把展示站补成能长期用的小站.md`（一期，已完成）→ `.rivet/plans/网站完成度二期-站点小部件-首页片段叙事-pwa.md`（二期，已完成）；博客去模板化没有单独的计划文件，改动依据都在本段与 git log 里。

**二期新增（2026-10-16，对标参照站补完成度）**：
- **站点小部件**（Hero 底部）：时钟/问候语/时光进度条/今日一句 —— `src/lib/timeParts.js`、`src/lib/dailySlip.js`（按日期哈希从 52 条纸条库取当日一句，不引外部 API）、`src/components/SiteWidgets.jsx`。interval 在 `document.hidden` 时暂停（fps 纪律）。
- **片段叙事段**（About 与 Story 之间）：`src/components/Segments.jsx`，六片段单源数据（`SEGMENTS` 数组，编号↔路由↔配图只写一处——taozhiyy 双轨漂移的反面教材）；媒体用壁纸静帧；IO 揭示入场（复用 Story 模式，零新增常驻动画）。
- **PWA**：`public/manifest.webmanifest`（start_url/scope 用相对 `./`，子路径部署免改）+ `public/sw.js`（手写无插件；壳缓存 portfolio-shell-v1，导航 network-first 回退壳页，**88MB 壁纸池明确不缓存**）+ `src/lib/registerSW.js`（仅 PROD + https/localhost 注册）。图标三件套 `public/icons/`（SVG + 192/512 PNG，由 SVG 经 headless Chrome 渲染导出）。

**Wave 6 布局实测结论（2026-10-16）**：罗盘 8 卡在 1440/768 两档实测零重叠零越界（几何探针），375 以下选择器整层 `hidden md:block` 不渲染——「窄屏拥挤」风险关闭，无需修复。
**性能定位修正（2026-10-16，fps-probe 实测）**：冷/热差异可忽略（avg 28.69 vs 28.37ms），「冷启动尖峰」假设证伪；掉帧真源是**常驻 CSS 动画**——`RIVET_KILL=anim` 后 avg 17.09ms、over33ms 6 次 vs 基线 59 次。若要做性能优化，方向是动画减量/降频（需用户拍板取舍，未动）。

**挂着等用户拍板的事**（不要自行执行）：
1. `git push origin main` —— 对外发布（本轮改动提交后由用户决定时机）
2. 博客内容：`blog/src/content/posts/` 目前只有 1 篇开篇文章，写什么由用户决定；主站旧文章（含 2 篇代笔草稿）随旧博客系统一起删了，没有迁移

**环境上的三个坑**（会浪费时间，先知道）：
- **dev server 会自己挂**（跑着跑着进程没了，`curl` 返回 `http=000`）。重启即可：`node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173`（本机 `npm run` 被劫持，必须直接调入口）
- **plan mode 下 `bash` 与 `git_scout` 都被拦**，只有 read/grep/glob/web_fetch/run_tests/delegate/todo/plan 可用
- **委派的只读 worker 不能联网**（`web_fetch`/`web_search` 在其上下文被审批门拦死）。外部调研必须主会话自己做

**验证探针都在 `.rivet/scratch/`**（会话工作区，不在仓库里）：`fps-probe.mjs` 帧率、`scene-probe.mjs` 背景分段、`friend-probe.mjs` 友链提交、`oracle-probe.mjs` 抽奖机、`hit-probe.mjs` 点击命中、`shot-click.mjs` 交互截图。它们都用同一套 CDP 连本机 Chromium（路径见文件头注释）。

---

## 一、这是什么 · 在哪 · 怎么跑

个人展示站（背景层 + 藏书 + 游戏 + 文章 + 浮光集 + 友链 + 留言板 + 唱机音乐 + 抽奖机）。

| 项 | 值 |
| --- | --- |
| 线上地址 | https://nianxiamuma.github.io/portfolio/ |
| 仓库 | https://github.com/nianxiamuma/portfolio （**public**） |
| 本地路径 | `D:\ai_work\Mywebeside\portfolio` |
| 技术栈 | React 18 · Vite 5 · Tailwind 3 · react-router 7 · Framer Motion · GSAP(ScrollTrigger) · lucide-react |
| 测试 | vitest + @testing-library/react + jsdom |

**跑起来**：

```bash
npm install
node node_modules/vite/bin/vite.js --host 0.0.0.0 --open   # 本机 npm run 会被劫持，直接调入口
```

**部署**：`git push origin main` → GitHub Actions 跑 **测试 → 构建 → 发布**（`.github/workflows/deploy.yml`）。测试不过就不部署。

---

## 二、已完成

### 2026-10-13 之前

| 提交 | 内容 |
| --- | --- |
| `fe33b93` | 初始版本：首页六板块 + 5 个子页面 + 40 项测试 |
| `f61d59a` | 修复硬编码资源路径（否则子路径部署下壁纸/头像 404） |
| `6a229b9` | 修复 CI Node 版本不匹配（20 → 24） |
| `ee6733e` | 修复 BrowserRouter basename（否则子页面全被弹回首页） |
| `15ba6ff` | 壁纸层支持视频背景 |
| `020e599` | 更换 4 张壁纸（取自本机 Wallpaper Engine 素材） |

### 2026-10-13 ~ 10-16 这一轮（10 个提交）

| 提交 | 内容 |
| --- | --- |
| `7ae2aa1` | 背景场景表（页面/区块 → 壁纸的唯一映射层） |
| `ab1f295` | 站点级背景层 + 场景解析 |
| `729b840` | 每个场景一张独立壁纸 + 首页分段联动 |
| `f96b835` | 头像换为 `avatar.jpg`（`IMG_6742.JPG`） |
| `1fca1ca` | 老式唱机音乐播放器 |
| `037173a` | 名片卡 z 序修复 + 播放器后台播放/进度条 + 覆盖 4→8 + 每页 2 张轮换 |
| `c4d27ef` | 音乐入口运行期探测（公开站上不再留死按钮） |
| `0f5a9f4` | 假 GitHub 链接收口 + 地址改单一真源 |
| `3456a44` | 抽奖机改为抽「纸条 + 壁纸」 |
| `a92bba8` | 友链申请从假动作改为真提交 |

**页面**：`/` `/about` `/glimmer` `/collection` `/friends` `/guestbook` `/blog` `/blog/:slug` `/archive` `/tags` `/tags/:tag` `/sources`
**测试**：17 个文件 **138 项**，全绿

**素材规模**：`public/wallpapers/scene/` 22 张（场景壁纸）、`public/wallpapers/oracle/` 42 张（抽奖机壁纸池），合计约 88MB。

---

## 三、关键决策与依据

| 决策 | 依据 |
| --- | --- |
| 静态托管用 GitHub Pages | 纯静态 SPA，无需服务器；push 即部署 |
| 路由用 `BrowserRouter` + `basename` | Hash 路由 URL 难看；子路径部署必须给 basename，否则子页面全失效 |
| 构建后生成 `404.html` | GitHub Pages **不支持 SPA rewrite**，直接访问子路径会 404；复制一份 index.html 兜底 |
| **不引入后端**（贯穿始终的硬约束） | 站上所有交互都必须能在纯静态条件下真跑通；做不到的宁可显式说明，也不做假动作 |
| 背景用**站点级 fixed 背景层** + 场景表 | 一处真源；页面/区块只声明「我是哪个场景」 |
| 背景切换只动 `opacity` | 两个槽位交叉淡入；不用 `filter`/尺寸变化，那些属性会触发重绘 |
| 音乐 `<audio>` 挂在面板**外面** | 关掉面板/切路由都不能中断播放 |
| 音频文件 `.gitignore`（清单进仓库、文件不进） | 仓库 public + Pages 公开传播，托管完整录音会触发 DMCA |
| 抽奖机「纸条 + 壁纸」用**互质步长**错开 | 纸条 `n % 52`，壁纸 `(n*31+7) % 42`；31 与 42 互质保证每张都够得着 |
| 友链申请走 **GitHub Issue 链接** | 无后端条件下唯一真正能把申请发出去的路径 |
| 站点身份 / 社交地址**单一真源**（`src/data/site.js`） | 之前名片卡/页脚/关于我各写一份，漂移成了裸 `https://github.com/` 假链接 |

---

## 四、否决过的方案（**下一个人最容易在这里重走**）

| 考虑过 | 为什么没走 |
| --- | --- |
| **Git LFS 传大视频** | ❌ **陷阱**：LFS 能上传，但 **GitHub Pages 不解析 LFS 指针**——网站读到的是文本指针，视频 404 |
| 直传大视频（907MB 等） | GitHub 单文件硬限 **100MB** |
| 用 Wallpaper Engine 的 `preview.jpg` 当壁纸 | 那是列表缩略图（256×256 ~ 1080×1080），全屏拉伸会糊 |
| 解开 `scene.pkg` 取原始画面 | 私有打包格式，无可靠解包工具 |
| 用 Netlify/Vercel 替 GitHub Pages | 要再注册账号；当时选了 Pages |
| 全站从 taozhiyy 克隆 | 完整全栈系统（React + Hexo + Go 后端），作者 README 明确未授权商用 |
| 用 canvas 粒子替代 CSS 动画 | 早期 canvas 粒子每帧 O(n²) 连线，是卡顿主因之一 |
| **给 Hero 配视频背景** | 用户看过 53 个候选后判定「视频太丑，不用了」。相关配置已摘除，`bg1.webm` 文件保留未删 |
| **改 `filter: brightness` 治卡顿** | **实测证伪**：废掉它 29.19ms vs 正常 29.44/31.38ms，无改善。真正嫌疑是首次交互的冷启动尖峰（冷启 266ms / 热态 max 12.6ms） |
| **从 Lively（rocksdanister/lively）取壁纸** | 那是**播放器软件**不是素材库，仓库里只有源码。开源的是代码，不是素材 |
| 直接抓 Pixabay | 403 + Cloudflare。最终走 wallhaven 公开 API |
| `curl` 下载 wallhaven 图片 | 本机 `curl` 到 `w.wallhaven.cc` 返回 `http=000`（不通），**但 Chromium 能通**。改用 CDP `Network.getResponseBody` 取二进制 |
| 从 pixiv 抓动漫图 | 需登录，且逐张授权不同、多数禁止转载 |

---

## 五、踩过的坑

### 部署类（本地绿、线上红）

1. **CI Node 版本**：workflow 写 `node 20`、本地 24 → jsdom 加载 undici 报 `webidl.util.markAsUncloneable is not a function`。**版本必须对齐**。
2. **硬编码资源路径**：`'/avatar.png'` 这类字符串字面量 **Vite 不会改写**，子路径部署后全 404。用 `import.meta.env.BASE_URL` 拼接。
3. **BrowserRouter 缺 basename**：所有子页面被弹回首页；curl 看 HTTP 200 完全正常，**只有截图才发现**。
4. **Git Bash 的 MSYS 路径转换**：`VITE_BASE=/portfolio/` 被当成 Windows 路径改写，一次「子路径验证」**结论完全无效**。加 `MSYS_NO_PATHCONV=1`。
5. **`vite preview` 不传 base** → 假白屏。**看到红先怀疑测量方法**。

### 这一轮新踩的

6. **z 序吞掉点击**：Hero 名片卡是 `z-40`，主文案层 `absolute inset-0 z-40` 且在 DOM 里更靠后 → 名片卡被盖住，**卡里所有按钮都点不到**。用 `elementFromPoint` 命中测试取证（`reachable: false` → 改后 `true`）。**界面上的按钮看起来正常，不代表能点**。
7. **在面板里的 `<audio>`**：关掉面板 = 组件卸载 = 歌断。音频元素必须挂在面板外。
8. **判据选错导致死按钮**：音乐入口原先只判「清单非空」，但 `.gitignore` 把音频挡在仓库外 → 公开站上清单非空、文件 404，按钮点了没反应。改成**运行期 HEAD 探测**，且判据不能只看 `res.ok`——缺失资源在 SPA 站点会被回退成 index.html 并返回 **200**，还要排除 `content-type: text/html`。
9. **`html { scroll-behavior: smooth }` 坑了两次**：`scrollIntoView` 是**动画**的，紧接着取 `getBoundingClientRect` 拿到的是滚动前坐标，真鼠标点击会落空；另外用 `scrollBy` 的推进距离当性能指标也会被它污染（smooth 下 4s 只推进 ~400px，auto 下 ~3486px）。
10. **CDP 事件里没有 `params.sessionId`**：sessionId 在消息外层，不在 `params`。我下载器一开始在回调里读 `p.sessionId`，导致每条事件都被提前 return，表现为「图片明明能加载但一张都下不来」。
11. **React 受控输入要用元素自身原型的 setter**：用 `HTMLInputElement` 的 setter 去填 `textarea` 会静默失效（两个不同原型）。探针里踩到，导致 body 里一个字段是占位符。
12. **「写入已确认」可能是假的**：会话中断时工具结果丢失，会合成一条「磁盘证据：文件已存在」的占位提示——**它只证明文件存在，不证明内容已改**。改完必须 grep 复核。
13. **fs 全量 `read_file` 把大图当文本**：多文件读取不会把图片交给视觉模型；要逐张单独读。

---

## 六、待办

### 需要用户拍板

1. ~~**删除死代码** `src/lib/slotMachine.js` + `src/__tests__/slotMachine.test.js`~~ ✅ 已删（连同旧博客的 posts.js / postOutline / searchIndex / SearchPanel 与四个文章页）
2. **push**（本轮改动提交后仍需用户点头）
3. **6 个项目卡的真实地址**：`src/data/projects.js` 里 6 条 `url` 全是裸 `https://github.com/`，点进去等于没去。真实地址只有作者知道，不要替他编
4. **仓库体积**：`public/wallpapers` 已 88MB，要不要砍

### 计划内待开发（方案 B）

5. ~~**Wave 5**：`/sources` 来源与致谢页~~ ✅ 已完成（`24e9356`）
6. ~~**Wave 3**：文章系统结构能力~~ ✅ 已完成（`0abd7ef`）：`/archive` 归档、`/tags` 标签云、`/tags/:tag`、`searchIndex.js` + Cmd/Ctrl+K 搜索面板、`postOutline.js` TOC、阅读进度条、相关文章、构建期 `feed.xml`
   - ⚠ 仍成立：**文章只有 3 篇**（`src/data/posts.js:20` `:42` `:63`），其中 2 篇是代笔草稿待用户重写。结构已就绪，价值要等内容
7. ~~**Wave 6**：罗盘 8 张封面卡窄屏布局~~ ✅ 已实测关闭（1440/768 零重叠零越界；<768 选择器不渲染）；键盘可达性已补齐：SearchPanel（Ctrl+K/Esc/Enter/↑↓ 全实测）、Navbar 抽屉 Esc、MusicPlayer Esc 原有、全局 `:focus-visible` 原有
8. ~~**Wave 1**：抽奖机两项受阻验收~~ ✅ 已补跑通过（纸条两次不同 + 壁纸 naturalWidth 1920x1080）；~~冷启动性能~~ ✅ 已定位（结论：冷启假设证伪，真源是常驻 CSS 动画，优化方向待用户拍板）

### 更早遗留

9. **2 篇文章是代笔草稿**（《书架上的五本》《把喜欢的东西留在手边》），需用户用自己的话重写
10. `NovelReader.jsx`、`ParticleBackground.jsx`、`public/novel-manifest.json` 是早期遗留、**已无引用**（`novel.txt` 因版权已 gitignore）
11. 移动端 Hero 留白偏多、签名离导航偏近（非 bug，是 `flex justify-between` 在窄屏的取舍）

---

## 七、未验证项（诚实清单）

- ~~**抽奖机「再抽一张」能换纸条**~~ ✅ 已验证（2026-10-16，oracle-probe 两次实跑 `textChangedBetweenDraws: true`、壁纸 `naturalWidth 1920x1080`）
- ~~**移动端罗盘 8 张卡片**~~ ✅ 已验证关闭（2026-10-16 几何探针：1440/768 零重叠零越界；375 以下选择器 `hidden md:block` 不渲染，无布局可言）
- **扬声器真的出声**：headless 无音频输出设备。能确证的是浏览器层面播放已启动（`paused=false`）、文件 200、src 正确
- **平板（768）截图**已补（罗盘探针），其余页面未逐字复核
- 「移动端不加载视频」用 DOM 实测过（375 视口 `<video>` 数 = 0），**未做网络层抓包**
- **Cmd+K 搜索面板**：唤出/搜索/Esc/Enter 跳转已用 CDP 实测（DOM keydown 路径）；真实组合键在 headless 下无法注入验证，真人浏览器行为待用户自测
- 测试覆盖数据与渲染，**端到端交互**靠 `.rivet/scratch/` 那批 CDP 探针补，不是 CI 的一部分

---

## 八、关键文件索引

| 想改什么 | 改哪 |
| --- | --- |
| 名字 / 签名 / 头像 / 社交地址（**单一真源**） | `src/data/site.js` |
| 页面/区块用哪张壁纸 | `src/lib/backgrounds.js`（`SCENES`） |
| Hero 罗盘 8 张封面（角度/方位/诗句/配色） | `src/lib/wallpapers.js` |
| 背景层渲染逻辑 | `src/components/BackgroundStage.jsx` · `src/context/BackgroundContext.jsx` |
| 抽奖机纸条库 / 壁纸池清单 | `src/data/oracle.js` + `src/lib/oracle.js` |
| 文章 | `src/data/posts.js` |
| 文章正文结构（## 标题/代码块/引用 → TOC） | `src/lib/postOutline.js` |
| 全文搜索（权重/分词） | `src/lib/searchIndex.js` · `src/components/SearchPanel.jsx` |
| RSS 订阅（构建期生成） | `vite.config.js` 的 `rssFeed()` |
| 素材来源声明 | `src/pages/SourcesPage.jsx` |
| 归档/标签 | `src/pages/ArchivePage.jsx` · `src/pages/TagsPage.jsx` |
| 音乐曲目清单 | `src/data/music.js`（音频放 `public/music/`，**不进仓库**） |
| 藏书 / 游戏 | `src/components/Bookshelf.jsx` · `src/components/GameShowcase.jsx` |
| 友链数据 / 友链申请 | `src/data/friends.js` · `src/lib/friendLink.js` · `.github/ISSUE_TEMPLATE/friend-link.yml` |
| 路由表 | `src/App.jsx` |
| 部署流程 | `.github/workflows/deploy.yml` |

**容易改坏的地方**：
- `src/App.jsx` 的 `BASE_PATH`（删了子页面全失效）
- `vite.config.js` 的 `base`
- 任何字符串形式的资源路径（`/wallpapers/…` 这类**必须**拼 `import.meta.env.BASE_URL`）
- `src/data/site.js` 的 `socials`（多处消费，改了要跑全量测试）
