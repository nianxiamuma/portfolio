import { ExternalLink } from 'lucide-react'
import { SITE } from '../data/site'

/**
 * 来源与致谢页（对标 Yuimi Lab 的「许可证与素材」章节）。
 *
 * 数据与站上实际素材一一对应：
 * - Hero 罗盘 wp1~wp4：站长自己提供的图片素材
 * - 场景壁纸 scene/*.jpg：取自本机 Wallpaper Engine 素材，个人非商用展示
 * - 抽奖机壁纸池 oracle/*：取自 wallhaven 公开图库（文件名保留原图 ID 可溯）
 * - 抽奖机纸条：公有领域古诗文，data/oracle.js 已逐条标注出处
 * - 图标 lucide-react、技术栈：开源许可
 *
 * 本站承诺：素材仅用于个人非商用展示；如有版权方提出异议会第一时间撤下。
 */

export const SOURCE_GROUPS = [
  {
    id: 'hero',
    title: '首页壁纸（罗盘 8 张封面）',
    note: '其中 4 张来自站长自己的图片收藏；另外 4 张复用下方的场景壁纸。',
    items: [
      {
        label: '初雪 / 晴空 / 晚风 / 远山',
        detail: 'public/wallpapers/wp1.jpg ~ wp4.jpg —— 站长本人提供的图片素材',
        license: '版权所有 · 仅本站展示',
      },
      {
        label: '晨雾 / 花信 / 远帆 / 孤星',
        detail: '复用场景壁纸 scene-about-2 / scene-glimmer-2 / scene-friends / scene-blog-2（见下一组）',
        license: '同场景壁纸授权',
      },
    ],
  },
  {
    id: 'scene',
    title: '场景壁纸（22 张）',
    note: '取自本机 Wallpaper Engine 创意工坊素材。未能逐张追溯到原作者，故统一按「个人非商用展示」处理。',
    items: [
      {
        label: 'Wallpaper Engine 创意工坊素材',
        detail: 'public/wallpapers/scene/ 全部 22 张，用于各页面的站点级背景层',
        license: '个人非商用展示',
        href: 'https://store.steampowered.com/app/431960/Wallpaper_Engine/',
      },
    ],
  },
  {
    id: 'oracle',
    title: '抽奖机壁纸池（42 张）',
    note: '取自 wallhaven.cc 公开图库；文件名保留了原图 ID，可按 wallhaven.cc/w/{id} 追溯到原图页。',
    items: [
      {
        label: 'wallhaven 公开图库',
        detail: 'public/wallpapers/oracle/ 全部 42 张（wallhaven-*.jpg/png），用于抽奖机壁纸池',
        license: '个人非商用展示 · 按图库惯例署名',
        href: 'https://wallhaven.cc',
      },
    ],
  },
  {
    id: 'slips',
    title: '抽奖机纸条（52 条）',
    note: '抽取时逐条展示出处。',
    items: [
      {
        label: '诗词 / 骈文 / 俳句 / 台词 / 名句',
        detail: '共 52 条，出处见 src/data/oracle.js 的 source 字段',
        license: '诗词与古文为公有领域；现代台词仅展示单句引文',
      },
    ],
  },
  {
    id: 'oss',
    title: '开源依赖与设计参照',
    note: '本站从这些项目与站点借了结构与交互思路，感谢它们。',
    items: [
      {
        label: 'lucide-react（图标）',
        detail: '全站图标',
        license: 'ISC',
        href: 'https://lucide.dev',
      },
      {
        label: 'React · Vite · Tailwind CSS · Framer Motion · GSAP',
        detail: '整站技术栈',
        license: 'MIT',
        href: 'https://github.com/facebook/react',
      },
      {
        label: '设计参照站',
        detail:
          'rainzt.cn「朝朝听雨」、firefly.cuteleaf.cn、taozhiyy.top、Yuimi Lab（Yuimi-chaya.github.io）、imsyy/home、bistutzyy/taozhiyy',
        license: '仅借鉴结构与交互思路，未复制代码与资产',
      },
    ],
  },
]

export default function SourcesPage() {
  return (
    <div className="pt-28 md:pt-32">
      <div className="mx-auto max-w-shell px-6 md:px-10 lg:px-16">
        <header>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.2em] text-neon-lime/70">08</span>
            <span className="h-px w-8 bg-white/15" />
            <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-slate-500">
              Sources &amp; Credits
            </span>
          </div>
          <h1 className="mt-6 text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.04] tracking-tightest text-white">
            来源与
            <span className="bg-gradient-to-r from-neon-lime to-neon-mint bg-clip-text text-transparent">
              致谢
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-500">
            站上素材的出处、授权状态，以及向它们道一声谢。素材仅作个人非商用展示，如有版权方提出异议，会第一时间撤下。
          </p>
        </header>

        <div className="mt-14 flex flex-col gap-12 pb-24">
          {SOURCE_GROUPS.map((group) => (
            <section key={group.id}>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-400">
                {group.title}
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">{group.note}</p>

              <ul className="mt-5 flex flex-col gap-3">
                {group.items.map((item) => (
                  <li
                    key={item.label}
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-colors duration-500 hover:bg-white/[0.04]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-medium text-slate-200">{item.label}</span>
                      <span className="font-mono text-[10px] tracking-[0.12em] text-slate-500">
                        {item.license}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">{item.detail}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-500 transition-colors duration-300 hover:text-neon-lime"
                      >
                        <ExternalLink className="h-3 w-3" />
                        前往原站
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* 站点信息脚注 */}
        <div className="border-t border-white/[0.06] pb-24">
          <p className="font-mono text-[11px] leading-relaxed tracking-[0.1em] text-slate-600">
            {SITE.name} ·
            本页授权边界为站长自律声明，不构成法律意见。条目有误或遗漏时，欢迎通过页脚邮箱或
            GitHub Issue 指出，我会补正。
          </p>
        </div>
      </div>
    </div>
  )
}
