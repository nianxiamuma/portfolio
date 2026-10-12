/**
 * 文章数据。
 *
 * ⚠️ 这三篇是**占位草稿**，除第一篇（建站记录，事实性）外，其余两篇是我
 * 代替你起的调子，请按你自己的话替换。结构照抄即可，改完自动生效。
 *
 * 字段：
 *   slug     路由标识（/blog/:slug），唯一
 *   title    标题
 *   date     YYYY-MM-DD
 *   category 分类（列表页可按它筛）
 *   tags     标签数组
 *   summary  卡片上的摘要
 *   cover    封面图地址；留空则用主题色渐变占位
 *   body     正文，段落之间用空行分隔
 */

export const POSTS = [
  {
    slug: 'how-this-site-was-built',
    title: '这个站是怎么搭起来的',
    date: '2026-10-12',
    category: '建站',
    tags: ['React', 'Tailwind', 'GSAP'],
    summary:
      '记录一下这个站的技术选型、踩过的坑，以及几个我当时拿不准的取舍。',
    cover: '',
    accent: '#edff66',
    body: `这个站从零搭起来，中间推翻过两次。

技术栈是 React + Vite + Tailwind + Framer Motion，滚动相关的复杂动效另外引了 GSAP 的 ScrollTrigger。粒子、花瓣这些开销小的东西全部自己用 CSS 和 canvas 写，没有引第三方粒子库。

最先踩的坑是白屏。屏幕上什么都没有，控制台报了一个语法错误：某个组件从 framer-motion 里 import 了一个只有 TypeScript 才有的类型，运行时那个名字根本不存在，整个模块图直接崩掉，React 连挂载的机会都没有。这件事说明一件事——白屏的第一反应应该是打开控制台看第一条报错，而不是去改样式。

第二个坑是性能。首页背景原本用了两个 60vw 的圆形加 90px 的高斯模糊，静态看很好看，动起来掉帧掉得厉害。后来想明白：径向渐变本身就是柔和的，再叠一层大模糊是双重柔化，又贵又暗。去掉模糊之后亮度反而更好。

还有一个取舍是卡片跟随鼠标的倾斜。第一版用 setState 存角度，结果每次 mousemove 都会重渲染整棵子树。改成直接改 DOM 的 style，再用 requestAnimationFrame 节流，才顺畅。

最后记一条：这个项目所在的目录不是 git 仓库。所以没有提交历史，也没有任何 diff 可回溯。这是个遗憾，改坏了只能靠记忆。`,
  },
  {
    slug: 'five-books-on-the-shelf',
    title: '书架上的五本',
    date: '2026-10-11',
    category: '书',
    tags: ['书单', '摘抄'],
    summary: '这五本摆在一起没什么体系，只是都在某个时刻接住过我。',
    cover: '',
    accent: '#10b981',
    body: `书架区放了五本，选的时候没有按门类来，纯粹是想到哪本放哪本。

《龙族》是少年时期的东西。「世界很大，比我们想象的要大得多。」——这句话放在别处挺鸡汤的，但放在那个故事里不轻飘。

《挪威的森林》里写「死并非生的对立面，而作为生的一部分永存。」村上把那种钝痛写得很轻，轻到合上书才觉得心里空了一块。

《恶意》的谜题从来不是凶手，是动机。东野圭吾在第一页就让人落网，然后用整本书告诉你为什么。

《兄弟》里那句「就是天翻地覆慨而慷了，我们还是兄弟」，后面还有半句更重的。余华写苦难从不煽情，只是让它在日常里慢慢发生。

最后一本还在追，名句先空着——剧透比留白更糟。`,
  },
  {
    slug: 'keeping-things-close',
    title: '把喜欢的东西留在手边',
    date: '2026-10-10',
    category: '随笔',
    tags: ['收藏', '生活'],
    summary: '收藏这件事本身有点奇怪，囤着，偶尔翻出来看看。',
    cover: '',
    accent: '#7c5cff',
    body: `收藏这件事本身有点奇怪。

东西放在那里，绝大多数时间你都不会去碰。但你知道它在，这个"在"本身就有重量。像是手里存着很多个不同的侧面，有些连自己都忘了。

我不太喜欢"整理癖"这个说法，那太整齐了。真实情况是散的——书在这个架子，游戏在那边，工具站堆在浏览器书签里从来不清。它们唯一的共同点是都被我留下来了。

这个站算是个落点。不是为了展示，也没打算做成作品集。只是把散的这些东西摆到一处，让它们看起来像一个整体。

摆出来之后才发现，原来喜欢的东西之间是有关系的。`,
  },
]

export const getPost = (slug) => POSTS.find((post) => post.slug === slug)

/** 正文字数（不计空白） */
export const wordCount = (post) =>
  typeof post?.body === 'string' ? post.body.replace(/\s/g, '').length : 0

/** 阅读时长（分钟，按 400 字/分钟估算，至少 1 分钟） */
export const readingMinutes = (post) => Math.max(1, Math.round(wordCount(post) / 400))

/** 全部出现过的分类 */
export const allCategories = () => [...new Set(POSTS.map((post) => post.category))]

/** 按日期倒序 */
export const sortedPosts = () =>
  [...POSTS].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
