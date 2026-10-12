# public/music/ —— 背景音乐（**不进仓库**）

这个目录被 `.gitignore` 排除，音频文件不会提交到公开仓库。

## 为什么

仓库是 **public** 且部署在 **GitHub Pages**，等于公开传播。托管完整录音会触发 DMCA，
可能连仓库一起下架。曲目清单（`src/data/music.js`）进仓库，音频文件不进。

## 怎么放

把音频按 `src/data/music.js` 里 `file` 字段的名字丢进这个目录，例如：

```
public/music/fang-love-song.mp3
public/music/fang-san-ren-you.mp3
public/music/fang-cai-er-shi-san.mp3
public/music/fang-te-bie-de-ren.mp3
public/music/fang-mai-en-li.mp3
```

文件名用 ASCII：中文名在 URL 里要编码，不同静态托管对它的处理不一致。

## 结果

- **本地开发 / 私有部署**：能听。
- **公开站点**：文件缺失。播放器入口在清单为空时整体隐藏，不会留一个点了没反应的按钮。
  （要让线上也能听，得自备已授权音频或改用外部托管 —— 这是需要显式做的决定。）

## 曲目清单为空怎么办

把 `src/data/music.js` 里的 `MUSIC_TRACKS` 清空即可 —— Navbar 的音乐入口会自动消失，
不需要改任何组件代码。
