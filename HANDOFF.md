# 交接说明

> 写给下一个接手的人（或未来的自己）。假设你**完全不了解**这里发生过什么。
> 最后更新：2026-10-13

---

## 一、这是什么 · 在哪 · 怎么跑

个人展示站（壁纸 Hero + 藏书 + 游戏 + 文章 + 浮光集 + 友链 + 留言板）。

| 项 | 值 |
| --- | --- |
| 线上地址 | https://nianxiamuma.github.io/portfolio/ |
| 仓库 | https://github.com/nianxiamuma/portfolio （**public**） |
| 本地路径 | `D:\ai_work\Mywebeside\portfolio` |
| 技术栈 | React 18 · Vite 5 · Tailwind 3 · Framer Motion · GSAP(ScrollTrigger) |

**跑起来**：

```bash
npm install
node node_modules/vite/bin/vite.js --host 0.0.0.0 --open   # 本机 npm run 会被劫持，直接调入口
```

Windows 也可双击 `start.bat`（会自动开浏览器）。

**部署**：`git push origin main` → GitHub Actions 自动跑 **测试 → 构建 → 发布**。测试不过就不部署。

---

## 二、已完成

| 提交 | 内容 |
| --- | --- |
| `fe33b93` | 初始版本：首页六板块 + 5 个子页面 + 40 项测试 |
| `f61d59a` | 修复硬编码资源路径（否则子路径部署下壁纸/头像 404） |
| `6a229b9` | 修复 CI Node 版本不匹配（20 → 24） |
| `ee6733e` | 修复 BrowserRouter basename（否则子页面全被弹回首页） |
| `15ba6ff` | 壁纸层支持视频背景（仅桌面端加载） |
| `020e599` | 更换 4 张壁纸（取自本机 Wallpaper Engine 素材） |

**页面**：`/` `/about` `/glimmer` `/collection` `/friends` `/guestbook` `/blog` `/blog/:slug`
**测试**：8 个文件 40 项，全绿

---

## 三、关键决策与依据

| 决策 | 依据 |
| --- | --- |
| 静态托管用 GitHub Pages | 纯静态 SPA，无需服务器；push 即部署 |
| 路由用 `BrowserRouter` + `basename` | Hash 路由 URL 难看；子路径部署必须给 basename，否则子页面全失效 |
| 构建后生成 `404.html` | GitHub Pages **不支持 SPA rewrite**，直接访问子路径会 404；复制一份 index.html 兜底 |
| 视频**只在 ≥768px 加载** | 移动网络下几 MB 视频代价过大，且移动端自动播放常被系统限制 |
| 图片作为 video 的 `poster` | 视频加载中/失败都有画面，**不会黑屏**（这个坑踩过） |
| 站点身份集中在 `src/data/site.js` | 改名字/签名/入口只改一处 |

---

## 四、否决过的方案（**下一个人最容易在这里重走**）

| 考虑过 | 为什么没走 |
| --- | --- |
| **Git LFS 传大视频** | ❌ **陷阱**：LFS 能上传，但 **GitHub Pages 不解析 LFS 指针**——网站读到的是文本指针，视频 404。这条路看着通，实际不通 |
| 直传大视频（907MB 等） | GitHub 单文件硬限 **100MB**，直接被拒 |
| 用 Wallpaper Engine 的 `preview.jpg` 当壁纸 | 那是**列表缩略图**（256×256 ~ 1080×1080），全屏拉伸会糊 |
| 解开 `scene.pkg` 取原始画面 | 私有打包格式，无可靠解包工具 |
| 用 Netlify/Vercel 替 GitHub Pages | 支持私有仓库（不必公开源码），但要再注册账号；当时选了 Pages |
| 全站从 taozhiyy 克隆 | 那是完整全栈系统（24161 行 + Go 后端），且作者 README 明确未授权商用 |
| 用 canvas 粒子替代 CSS 动画 | 之前的 canvas 粒子每帧 O(n²) 连线，是卡顿主因之一，已移除 |

---

## 五、踩过的坑（都是「本地绿、线上红」）

1. **CI Node 版本**：workflow 写 `node 20`，本地是 24 → jsdom 加载 undici 报 `webidl.util.markAsUncloneable is not a function`，测试步骤崩。**教训：CI 版本对齐本地**。
2. **硬编码资源路径**：`'/avatar.png'`、`'/wallpapers/wpN.jpg'` 是字符串字面量，**Vite 不会改写**。部署到子路径后壁纸/头像全 404。修法：`import.meta.env.BASE_URL` 拼接。
3. **BrowserRouter 缺 basename**：地址 `/portfolio/blog` 匹配不上路由表里的 `/blog` → 落进通配路由 → **所有子页面被弹回首页**。curl 看 HTTP 200 完全正常，**只有截图才发现**。
4. **Git Bash 的 MSYS 路径转换**：`VITE_BASE=/portfolio/` 被当成 Windows 路径转成 `/Program Files/Git/portfolio/`，导致一次「子路径验证」**结论完全无效**。要加 `MSYS_NO_PATHCONV=1`。
5. **`vite preview` 不传 base**：构建产物是 `/portfolio/` 的，preview 用默认 `/` → 假白屏（8511 bytes）。**看到红先怀疑测量方法**。

---

## 六、待办

### 需要用户决定

1. **其余 3 张壁纸是否配视频**（现在只有 wp1 有 `bg1.webm`，5.7MB）
   - 候选：`884307090/video/*.webm`（1.6–32MB，36 个 <12MB）
   - 大视频需先压缩（要装 ffmpeg）或外部托管
2. **头像文件**：用户想换成一张黑白漫画图，但**对话里的图片无法落盘**，需他保存到 `public/avatar.png`
3. **版权**：现用壁纸/视频均来自其本机 Wallpaper Engine 素材（混合来源，含二手收集）。二次元插画来源不明，公开站上有风险。已排除带 `THE OTHER LIGHT` 文字的两张游戏美术

### 需要开发

4. **2 篇文章是代笔草稿**（`src/data/posts.js` 的《书架上的五本》《把喜欢的东西留在手边》），需用户用自己的话重写
5. **参考与致谢页**未做 —— taozhiyy 与 rainzt.cn 两位作者都声明了来源边界，建议补
6. **性能未实测**：连续几轮都只做代码层优化，**没有帧率数据**（开发机无性能测量工具）
7. **移动端 Hero 留白偏多**、签名离导航偏近（非 bug，是 `flex justify-between` 在窄屏的取舍）
8. `NovelReader.jsx`、`ParticleBackground.jsx`、`public/novel-manifest.json` 是早期遗留，**已无引用**（`novel.txt` 因版权已 gitignore）

---

## 七、未验证项（诚实清单）

- 平板（768）截图生成过但**未逐字复核内容**
- 「移动端不加载视频」已用 DOM 实测（375 视口 `<video>` 数量 = 0），但**未做网络层抓包**
- 40 项测试覆盖数据与渲染，**未覆盖端到端交互**（如真实点击跳转后的页面内容）

---

## 八、关键文件索引

| 想改什么 | 改哪 |
| --- | --- |
| 名字 / 签名 / 头像 / 名片卡入口 | `src/data/site.js` |
| 壁纸（4 张图 + 视频） | `public/wallpapers/` + `src/lib/wallpapers.js` |
| 文章 | `src/data/posts.js` |
| 藏书（书名 / 名句 / 外链） | `src/components/Bookshelf.jsx` |
| 游戏 | `src/components/GameShowcase.jsx` |
| 友链 / 常用工具 | `src/data/friends.js` · `src/data/tools.js` |
| 路由表 | `src/App.jsx` |
| 部署流程 | `.github/workflows/deploy.yml` |

**容易改坏的三处**：`src/App.jsx` 的 `BASE_PATH`（删了子页面全失效）、`vite.config.js` 的 `base`、`src/lib/wallpapers.js` 的资源路径拼接。
