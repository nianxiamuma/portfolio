"""把分层贴图合成完整画面：
- 雏田：主图(RGBA) + 眼睛(RGBA)，尺寸相同，直接 alpha 叠加
- 玛琪玛：背景 + 人物/头发/左手/右手（均为 RGB 黑底层），用 screen 混合去掉黑底
"""
import os
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import extract_all as E

STEAM = E.STEAM
OUT = os.path.normpath(os.path.join(E.HERE, '..', '..', 'public', 'wallpapers', 'dice'))


def load_tex(pid, key):
    entries, base, data = E.read_pkg(os.path.join(STEAM, pid, 'scene.pkg'))
    hit = None
    for nm, off, sz in entries:
        if nm.endswith('.tex') and key in nm:
            hit = (nm, off, sz)
            break
    if not hit:
        raise RuntimeError('没找到贴图 ' + key)
    nm, off, sz = hit
    blob = data[base + off:base + off + sz]
    tmp = os.path.join(E.HERE, '_layer.png')
    for sig, ext in ((b'\x89PNG\r\n\x1a\n', '.png'), (b'\xff\xd8\xff', '.jpg')):
        i = blob.find(sig)
        if i > 0:
            p = os.path.join(E.HERE, '_layer' + ext)
            open(p, 'wb').write(blob[i:])
            try:
                im = Image.open(p)
                im.load()
                return im
            except Exception:
                pass
    E.decode_tex_rgba(blob, tmp)
    im = Image.open(tmp)
    im.load()
    return im


def screen(a, b):
    """屏幕混合：黑底不改变底层，适合 Wallpaper Engine 的 additive 人物层。"""
    na = np.asarray(a.convert('RGB')).astype(np.float32)
    nb = np.asarray(b.convert('RGB')).astype(np.float32)
    out = 255.0 - (255.0 - na) * (255.0 - nb) / 255.0
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def save(im, key, quality=86):
    dst = os.path.join(OUT, key + '.jpg')
    im = im.convert('RGB')
    w, h = im.size
    if w / h >= 16 / 9:
        nw, nh = min(1920, w), max(1, round(min(1920, w) * h / w))
    else:
        nh, nw = min(1080, h), max(1, round(min(1080, h) * w / h))
    if (nw, nh) != (w, h):
        im = im.resize((nw, nh), Image.LANCZOS)
    im.save(dst, 'JPEG', quality=quality, optimize=True, progressive=True)
    a = np.asarray(im).astype(np.float32)
    print('%-14s → %dx%d %.2fMB  亮度%.0f 标准差%.0f' % (
        key, nw, nh, os.path.getsize(dst) / 1048576, a.mean(), a.std()))


def hinata():
    main = load_tex('3118949804', 'new_0002_Calque-3').convert('RGBA')
    eyes = load_tex('3118949804', 'eyes').convert('RGBA')
    if eyes.size != main.size:
        eyes = eyes.resize(main.size, Image.LANCZOS)
    out = Image.alpha_composite(main, eyes)
    alpha = np.asarray(out)[:, :, 3]
    print('雏田合成: 透明像素 %.1f%%' % (100 * (alpha < 10).mean()))
    # 仍有透明区域 → 垫深色底，避免转 RGB 后变纯黑块
    bg = Image.new('RGB', out.size, (6, 8, 14))
    bg.paste(out, mask=out.split()[3])
    save(bg, '1-hinata')


def makima():
    base = load_tex('2935530316', '背景').convert('RGB')
    out = base
    for key in ('人物', '头发', '左手', '右手'):
        layer = load_tex('2935530316', key).convert('RGB')
        if layer.size != out.size:
            layer = layer.resize(out.size, Image.LANCZOS)
        out = screen(out, layer)
    save(out, '2-makima')


if __name__ == '__main__':
    which = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if which in ('all', 'hinata'):
        hinata()
    if which in ('all', 'makima'):
        makima()
