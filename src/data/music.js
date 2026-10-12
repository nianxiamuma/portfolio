/**
 * 背景音乐曲目清单。
 *
 * 约定（见 .gitignore）：**清单进仓库，音频文件不进**。
 * 音频放在 public/music/ 下，本地能听；因为仓库是 public + GitHub Pages，
 * 托管完整录音会触发 DMCA，所以这些文件被 gitignore 挡在仓库外。
 * 公开站点上文件缺失 → 播放器入口自动隐藏（见 Navbar）。
 *
 * 文件名用 ASCII：中文名在 URL 里要编码，不同静态托管对它的处理不一致，避坑。
 */
export const MUSIC_TRACKS = [
  { id: 'love-song', title: 'Love Song', artist: '方大同', file: 'fang-love-song.mp3' },
  { id: 'san-ren-you', title: '三人游', artist: '方大同', file: 'fang-san-ren-you.mp3' },
  { id: 'cai-er-shi-san', title: '才二十三', artist: '方大同', file: 'fang-cai-er-shi-san.mp3' },
  { id: 'te-bie-de-ren', title: '特别的人', artist: '方大同', file: 'fang-te-bie-de-ren.mp3' },
  { id: 'mai-en-li', title: '麦恩莉', artist: '方大同', file: 'fang-mai-en-li.mp3' },
]

/** 有没有歌可放。空清单时整条音乐线隐藏，而不是留一个点了没反应的按钮。 */
export const musicAvailable = () => MUSIC_TRACKS.length > 0

/** 曲目 → 可访问 URL（必须拼部署基路径，否则子路径部署下 404） */
export const trackSrc = (track) =>
  track ? `${import.meta.env.BASE_URL}music/${track.file}` : ''
