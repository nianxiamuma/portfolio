# 音乐文件夹（占位说明）

把网易云下载好的 mp3 放到本目录（`blog/public/assets/music/`），

然后在 `blog/src/config/musicConfig.ts` 的 `local.playlist` 里补条目：

```ts
local: {
  playlist: [
    // 自带曲（保留）
    { name: "使一颗心免于哀伤", artist: "知更鸟 / HOYO-MiX / Chevy",
      url: "/assets/music/使一颗心免于哀伤-哼唱.mp3",
      cover: "/assets/music/cover/109951169585655912.webp", lrc: "" },
    // 新增：网易云下载的 10 首（示例）
    { name: "A Walk in the Rain", artist: "Yanni",
      url: "/assets/music/a-walk-in-the-rain.mp3", cover: "", lrc: "" },
    // …其余同格式
  ],
},
```

- 文件名建议用英文短横线（避免 URL 编码问题）
- `cover` 留空时播放器显示默认音符图标
- 这些曲子进「LOCAL」来源；播放器右上角按钮可切 LOCAL / NETEASE
