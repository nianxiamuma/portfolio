import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

/**
 * 编辑式区块标题：编号 + 英文标签 + 中文大标题 + 说明。
 * 全站统一，保证纵向节奏一致。
 */
export default function SectionHeader({ index, label, title, description, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: EASE }}
      className={className}
    >
      <div className="flex items-center gap-4">
        <span className="font-mono text-[10px] tracking-[0.2em] text-ice-400/70">{index}</span>
        <span className="h-px w-8 bg-white/15" />
        <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-slate-500">
          {label}
        </span>
      </div>

      <h2 className="mt-7 text-[clamp(1.9rem,4vw,3.5rem)] font-bold leading-[1.06] tracking-tightest text-white">
        {title}
      </h2>

      {description ? (
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-500">{description}</p>
      ) : null}
    </motion.div>
  )
}
