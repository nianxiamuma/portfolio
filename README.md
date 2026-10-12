# 年下牧马 · 个人收藏站

个人展示站：壁纸 Hero（带指南针封面选择器）、藏书（书脊可抽出翻开）、游戏（Switch 外观）、
文章、浮光集、友链、留言板。

**技术栈**：React 18 · Vite 5 · Tailwind CSS 3 · Framer Motion · GSAP (ScrollTrigger)

---

## 本地运行

```bash
npm install
npm run dev
```

> 若本机的 `npm run` 被环境劫持（表现为 `tianshu-runtime.exe 不是内部或外部命令`），直接调入口：
> ```bash
> node node_modules/vite/bin/vite.js --host 0.0.0.0 --open
> ```

Windows 上也可以直接双击 **`start.bat`**：自动装依赖、启动、打开浏览器。

## 测试

```bash
npx vitest run
```

## 构建 / 部署

```bash
npx vite build      # 产物在 dist/
```

部署到 **GitHub Pages** 是自动的（`.github/workflows/deploy.yml`）：
推到 `main` 分支即触发 —— **装依赖 → 跑测试 → 构建 → 校验 404 兜底 → 发布**。测试不过就不部署。

两个容易踩的坑，已在配置里处理：

| 坑 | 现象 | 处理 |
| --- | --- | --- |
| 子路径 | 部署后资源全 404、白屏 | `vite.config.js` 读 `VITE_BASE`，CI 注入 `/<repo>/` |
| SPA 刷新 404 | 在 `/blog` 刷新页面就 404 | 构建插件把 `index.html` 复制为 `404.html` 兜底 |

## 内容怎么改

| 想改什么 | 改哪个文件 |
| --- | --- |
| 名字 / 签名 / 头像 / 名片卡入口 | `src/data/site.js` |
| 壁纸（4 张） | 替换 `public/wallpapers/wp1~4.jpg`（代码不用动） |
| 头像 | 替换 `public/avatar.png` |
| 文章 | `src/data/posts.js` |
| 藏书（书名 / 名句 / 外链） | `src/components/Bookshelf.jsx` |
| 游戏 | `src/components/GameShowcase.jsx` |
| 友链 | `src/data/friends.js` |
| 常用 AI 工具 | `src/data/tools.js` |

---

## 参考与致谢

本项目的**结构组织与若干交互设计**参考了以下开源项目 / 站点，特此致谢：

- **bistutzyy/taozhiyy** —— 首页 Hero 的指南针封面选择器、
  多路由骨架、滚动交互的参考来源。该仓库声明其首页参考了
  adrianhajdin/award-winning-website，
  并且**未授权**将其内容视为可直接商用的来源。
- **rainzt.cn** —— 首页个人名片卡、花瓣氛围层的参考来源。

**本项目仅作个人学习与展示使用，不用于商业用途。**
若上述作者认为其中任何部分不妥，将立即修改或移除。

## 未做的事 / 已知限制

- **不含后端**。留言板数据存在浏览器 `localStorage`，换设备即丢。
  `src/services/api.js` 已预留 `VITE_API_BASE`，接上后端即生效（失败会静默降级，不会白屏）。
- **未实现**参考站的 AI 助手、AI 生图、服务器遥测、站长控制台 —— 它们依赖 Go 服务与第三方 API key。
- **性能未实测**：开发机没有性能测量工具，滚动帧率没有量化数据。
- `novel.txt` 是第三方小说全文（5.7MB），**已在 `.gitignore` 中排除**，不会进入公开仓库。
