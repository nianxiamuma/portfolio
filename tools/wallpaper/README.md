# 壁纸素材处理工具

把本机 Wallpaper Engine 创意工坊的素材，抽成站点能直接用的 1920 宽 JPEG。

## 依赖

```bash
pip install pillow numpy lz4 imageio-ffmpeg
```

- `pillow` / `numpy`：缩放、合成、像素统计
- `lz4`：解 `scene.pkg` 里被 LZ4 压缩的原始像素（TEXB0002 / TEXB0003）
- `imageio-ffmpeg`：视频壁纸抽帧，自带 ffmpeg 可执行文件

## 素材形态与处理方式

| 形态 | 判断 | 处理 |
|---|---|---|
| `scene.pkg` + freeImageFormat 贴图 | 贴图数据区里直接是 JPEG/PNG 字节流 | 按魔数切出来即可 |
| `scene.pkg` + LZ4 压缩原始像素 | 有 `TEXB0002` / `TEXB0003` 段 | 读宽高与压缩前后长度 → LZ4 解压 → `Image.frombytes` |
| 视频壁纸 | 目录里有 `.mp4/.webm/.mov` | ffmpeg 取时长 30% 处一帧 |

**注意**：有些壁纸把人物拆成多层贴图（背景 / 人物 / 头发 / 手…），单抽一层会缺东西；
还有些包的贴图只是着色器的输入色块（整层只有个位数色档），**导不出完整静态画面**。
抽完建议先看 `probe_pkg.py` 的色档数：正常画面通常 > 50，个位数基本是纯色层。

## 脚本

| 文件 | 作用 |
|---|---|
| `scan_workshop.py` | 扫描一批工坊目录，报告每项是 pkg 还是视频、主文件多大 |
| `probe_pkg.py` | 列出 pkg 里主贴图的格式（freeImageFormat / 需要解码）与体积 |
| `extract_all.py` | 批量抽图 → `public/wallpapers/month/NN-{hero,story,about}.jpg` |
| `dice_extract.py` | 抽骰子壁纸池 → `public/wallpapers/dice/<key>.jpg` |
| `compose_layers.py` | 分层贴图的合成实验（alpha 叠加 / screen 去黑底） |
| `make_month_wall.py` | 单张图缩放保存（手动补图时用） |

## 用法

```bash
# 批量抽月份壁纸（PLAN 表在文件顶部，改人物/工坊 id 即可）
python extract_all.py

# 只重抽某一项
python extract_all.py 05-story

# 抽骰子壁纸池
python dice_extract.py
```

工坊根目录默认是
`C:\Program Files (x86)\Steam\steamapps\workshop\content\431960`，
装在别处就设环境变量：

```bash
WALLPAPER_WORKSHOP="D:/Steam/steamapps/workshop/content/431960" python extract_all.py
```

输出目录一律相对本文件定位（`../../public/wallpapers/...`），换机器不用改路径。

## 已知坑

1. **别按文件体积挑主贴图**。有的包最大那张是背景或遮罩，人物在另一层。先看色档数。
2. **分层素材需要合成**：雏田那类「主图 + eyes」要 alpha 叠加；玛琪玛那类「背景 + 人物」若全是 RGB 无透明，多半是着色器输入，静态合成效果不可靠。
3. **preview.gif 只是缩略图**（常见 256×256），放大到 1920 会明显糊，仅作兜底。
4. `Extract` 出来的临时文件写在脚本同目录（`_tmp_extract.*`、`_layer.*`），跑完会自动删部分，残留可直接删。
