import { useState } from 'react'
import { ArrowUpRight, Check, Copy, Github, Mail } from 'lucide-react'

import { PROJECTS, SKILLS } from '../data/projects'
import { SITE } from '../data/site'
import Bookshelf from '../components/Bookshelf'
import GameShowcase from '../components/GameShowcase'

const EMAIL = '807273679@qq.com'

/**
 * GitHub 地址从 SITE.socials 取，不在这里再写一份 ——
 * 之前这里和名片卡各写了一份，结果名片卡改了、这里还指着裸的 https://github.com/（等于假链接）。
 * 单一真源 + 一条一致性测试才拦得住这种漂移。
 */
const GITHUB_URL =
  SITE.socials.find((item) => item.key === 'github')?.href || 'https://github.com/nianxiamuma'

/** 展示用：把协议头和末尾斜杠去掉 */
const GITHUB_LABEL = GITHUB_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')

/**
 * 与站点其它区块一致的排题：编号 + 细线 + 英文标签，下面是中文大标题。
 */
function SectionTitle({ index, label, children, note }) {
  return (
    <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] tracking-[0.2em] text-neon-lime/70">{index}</span>
          <span className="h-px w-8 bg-white/15" />
          <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-slate-500">
            {label}
          </span>
        </div>
        <h2 className="mt-6 text-[clamp(1.9rem,4vw,3.4rem)] font-bold leading-[1.06] tracking-tightest text-white">
          {children}
        </h2>
      </div>
      {note ? <p className="max-w-sm text-sm leading-relaxed text-slate-500">{note}</p> : null}
    </header>
  )
}

/**
 * 「关于我」页：页头自我介绍 → 项目网格 → 技能标签云 → 联系方式。
 * 全部为前端假数据，无后端请求，也无外部图片。
 */
export default function AboutSitePage() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard?.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* 剪贴板不可用时静默降级，邮箱仍可点选复制 */
    }
  }

  return (
    <div className="relative">
      {/* 页头 */}
      <section className="relative pb-24 pt-28 lg:pt-36">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-1/4 right-[-10%] h-[46vw] w-[46vw] rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.22),transparent_62%)] blur-[110px]"
        />
        <div className="relative mx-auto max-w-shell px-6 md:px-10 lg:px-16">
          <SectionTitle
            index="01"
            label="About"
            note="这里本来该放一张自拍，想了想还是留白比较好。"
          >
            年下牧马
            <span className="bg-gradient-to-r from-neon-lime to-neon-mint bg-clip-text text-transparent">
              的收藏站
            </span>
          </SectionTitle>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <p className="max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
              白天和代码打交道，晚上和小说、游戏打交道，中间的空隙用来发呆。
              不太擅长介绍自己，也不太回消息——但东西交出去之前会自己先过一遍。
              这个站是我把喜欢的东西摆出来的地方，没有简历，也没有业绩指标。
            </p>

            <dl className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {[
                { k: '身份', v: '年下牧马 · 一个不知名的帅哥' },
                { k: '状态', v: '在线，但不太回消息' },
                { k: '坐标', v: '地球 · 某个角落' },
              ].map((item) => (
                <div key={item.k} className="flex items-center gap-4 py-3">
                  <dt className="w-14 shrink-0 font-mono text-[10px] uppercase tracking-[0.24em] text-slate-600">
                    {item.k}
                  </dt>
                  <dd className="text-xs text-slate-300">{item.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* 项目 */}
      <section className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-shell px-6 md:px-10 lg:px-16">
          <SectionTitle index="02" label="Work" note="自己写着玩的几个，有些还在补。">
            摆出来的
            <span className="bg-gradient-to-r from-neon-violet to-neon-mint bg-clip-text text-transparent">
              项目
            </span>
          </SectionTitle>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((project) => (
              <a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-all duration-500 ease-expo-out hover:-translate-y-1 hover:border-white/[0.16] hover:bg-white/[0.04]"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl opacity-40 transition-opacity duration-500 group-hover:opacity-90"
                  style={{
                    background: `radial-gradient(circle, ${project.accent}66, transparent 68%)`,
                  }}
                />

                <div className="relative flex items-start justify-between gap-4">
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border font-mono text-lg font-bold"
                    style={{
                      borderColor: `${project.accent}4d`,
                      background: `linear-gradient(140deg, ${project.accent}26, transparent 70%)`,
                      color: project.accent,
                    }}
                  >
                    {project.initial}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-slate-600 transition-all duration-500 ease-expo-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                </div>

                <h3 className="relative mt-6 text-base font-semibold text-white">{project.name}</h3>
                <p className="relative mt-2 flex-1 text-xs leading-relaxed text-slate-500">
                  {project.desc}
                </p>

                <div className="relative mt-5 flex flex-wrap gap-1.5 border-t border-white/[0.06] pt-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/[0.08] px-2.5 py-0.5 font-mono text-[10px] tracking-[0.08em] text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 藏书与游戏（原独立「藏书」页并入，见 Wave A #6） */}
      <Bookshelf />
      <GameShowcase />

      {/* 技能 */}
      <section className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-shell px-6 md:px-10 lg:px-16">
          <SectionTitle index="03" label="Skills" note="够用就行，用不上的随时在学。">
            手上这些
            <span className="bg-gradient-to-r from-neon-mint to-neon-lime bg-clip-text text-transparent">
              工具
            </span>
          </SectionTitle>

          <div className="relative mt-14 overflow-hidden rounded-3xl border border-white/[0.07] bg-void-900 p-8 md:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-1/4 -top-1/3 h-[38vw] w-[38vw] rounded-full bg-[radial-gradient(circle,rgba(237,255,102,0.12),transparent_62%)] blur-[100px]"
            />
            <div aria-hidden className="absolute inset-0 bg-grid-faint [background-size:56px_56px] opacity-30" />

            <div className="relative flex flex-wrap gap-2.5">
              {SKILLS.map((skill) => (
                <span
                  key={skill.name}
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs text-slate-300 transition-all duration-500 ease-expo-out hover:text-white"
                  style={{
                    borderColor: `${skill.accent}33`,
                    background: `${skill.accent}0d`,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: skill.accent, boxShadow: `0 0 10px ${skill.accent}` }}
                  />
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 联系 */}
      <section className="relative pb-28 pt-24 lg:pb-36 lg:pt-32">
        <div className="mx-auto max-w-shell px-6 md:px-10 lg:px-16">
          <SectionTitle index="04" label="Contact" note="回得慢，但一定会看。">
            想说的话
            <span className="bg-gradient-to-r from-neon-lime to-neon-violet bg-clip-text text-transparent">
              丢过来
            </span>
          </SectionTitle>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            <button
              type="button"
              onClick={copyEmail}
              className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 py-7 text-left transition-all duration-500 ease-expo-out hover:border-neon-violet/50 hover:bg-white/[0.05]"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.4),transparent_68%)] blur-2xl opacity-50 transition-opacity duration-500 group-hover:opacity-90"
              />
              <Mail className="relative h-5 w-5 shrink-0 text-neon-violet" />
              <span className="relative min-w-0">
                <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600">
                  Email
                </span>
                <span className="mt-2 block truncate font-mono text-sm text-slate-200">
                  {EMAIL}
                </span>
              </span>
              <span className="relative ml-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-neon-lime" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    点击复制
                  </>
                )}
              </span>
            </button>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 py-7 transition-all duration-500 ease-expo-out hover:border-neon-lime/50 hover:bg-white/[0.05]"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(237,255,102,0.35),transparent_68%)] blur-2xl opacity-50 transition-opacity duration-500 group-hover:opacity-90"
              />
              <Github className="relative h-5 w-5 shrink-0 text-neon-lime" />
              <span className="relative min-w-0">
                <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600">
                  GitHub
                </span>
                <span className="mt-2 block truncate font-mono text-sm text-slate-200">
                  {GITHUB_LABEL}
                </span>
              </span>
              <ArrowUpRight className="relative ml-auto h-4 w-4 text-slate-600 transition-all duration-500 ease-expo-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
