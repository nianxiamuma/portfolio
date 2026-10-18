"""批量把 12 个月 × 3 个槽位的壁纸从 Wallpaper Engine 素材里抽出来。

pkg  → 解条目 → 挑主贴图（排除 mask/shine 等辅助贴图）→ 直出 JPEG/PNG → 缩到 1920 宽
video → ffmpeg 取 30% 处一帧 → 缩到 1920 宽

输出：public/wallpapers/month/NN-{hero,story,about}.jpg
"""
import json
import os
import struct
import subprocess
import sys

from PIL import Image

STEAM = os.environ.get('WALLPAPER_WORKSHOP', r'C:/Program Files (x86)/Steam/steamapps/workshop/content/431960')
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', '..', 'public', 'wallpapers', 'month'))
def _ffmpeg():
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return os.environ.get('FFMPEG', 'ffmpeg')


FFMPEG = _ffmpeg()

# 辅助贴图，不是画面主体
AUX = ('mask', 'shine', 'shadow', 'iris', 'foliage', 'glow', 'noise', 'rain', 'snow', 'light')


def read_pkg(path):
    data = open(path, 'rb').read()
    pos = 0

    def u32():
        nonlocal pos
        v = struct.unpack_from('<I', data, pos)[0]
        pos += 4
        return v

    ml = u32()
    pos += ml
    n = u32()
    entries = []
    for _ in range(n):
        plen = u32()
        name = data[pos:pos + plen].decode('utf-8', 'replace')
        pos += plen
        off = u32()
        size = u32()
        entries.append((name, off, size))
    return entries, pos, data


def pick_tex(entries):
    texs = [e for e in entries if e[0].lower().endswith('.tex')]
    main = [e for e in texs if not any(k in e[0].lower() for k in AUX)]
    pool = main or texs
    return max(pool, key=lambda e: e[2]) if pool else None


def decode_tex_rgba(blob, out_path):
    """非 freeImageFormat 的 TEX：TEXB0003 里是 LZ4 压缩的原始像素，自己解出来。"""
    import lz4.block
    i = blob.find(b'TEXB')
    if i < 0:
        raise RuntimeError('没有 TEXB 段')
    q = i + 9
    ver = blob[i + 4:i + 8]
    if ver == b'0002':
        # TEXB0002 没有 fmt 字段：w/h 前移 4 字节，数据起点 q+28
        w, h = struct.unpack_from('<2I', blob, q + 8)
        _is_lz4, dsize, csize = struct.unpack_from('<3I', blob, q + 16)
        fmt, data_off = -1, q + 28
    else:
        # TEXB0003+
        _mip, _w0, fmt, w, h, _mip2, dsize, csize = struct.unpack_from('<8I', blob, q)
        data_off = q + 32
    if not (0 < w <= 16384 and 0 < h <= 16384):
        raise RuntimeError('TEXB 宽高异常 %dx%d (ver=%s)' % (w, h, ver.decode('ascii', 'replace')))
    raw = lz4.block.decompress(blob[data_off:data_off + csize], uncompressed_size=dsize)
    bpp = dsize // (w * h)
    mode = {4: 'RGBA', 3: 'RGB', 2: 'LA', 1: 'L'}.get(bpp)
    if not mode:
        raise RuntimeError('无法识别的像素位宽 bpp=%d (fmt=%d)' % (bpp, fmt))
    Image.frombytes(mode, (w, h), raw).convert('RGB').save(out_path, 'PNG')
    return w, h


def extract_pkg(path):
    entries, base, data = read_pkg(path)
    hit = pick_tex(entries)
    if not hit:
        raise RuntimeError('pkg 里没有贴图')
    name, off, size = hit
    blob = data[base + off: base + off + size]

    # 先按 freeImageFormat 直出；抽出来必须真的能被 PIL 打开，
    # 否则说明魔数是在原始像素里误命中的，改走解码分支
    for sig, ext in ((b'\x89PNG\r\n\x1a\n', '.png'), (b'\xff\xd8\xff', '.jpg')):
        i = blob.find(sig)
        if i > 0:
            tmp = os.path.join(HERE, '_tmp_extract' + ext)
            open(tmp, 'wb').write(blob[i:])
            try:
                Image.open(tmp).verify()
                return tmp, name
            except Exception:
                pass

    tmp = os.path.join(HERE, '_tmp_extract.png')
    w, h = decode_tex_rgba(blob, tmp)
    return tmp, '%s [LZ4 %dx%d]' % (name, w, h)


def video_duration(path):
    r = subprocess.run([FFMPEG, '-hide_banner', '-i', path], capture_output=True, text=True,
                       encoding='utf-8', errors='replace')
    for line in r.stderr.splitlines():
        if 'Duration:' in line:
            t = line.split('Duration:')[1].split(',')[0].strip().split(':')
            return int(t[0]) * 3600 + int(t[1]) * 60 + float(t[2])
    return 0


def extract_video(path):
    dur = video_duration(path)
    ts = min(max(dur * 0.3, 1.0), 30.0) if dur else 3.0
    tmp = os.path.join(HERE, '_tmp_extract.jpg')
    for at in (ts, 0.0):
        r = subprocess.run([FFMPEG, '-hide_banner', '-loglevel', 'error', '-ss', '%.2f' % at,
                            '-i', path, '-frames:v', '1', '-q:v', '2', '-y', tmp],
                           capture_output=True)
        if os.path.exists(tmp) and os.path.getsize(tmp) > 20000:
            return tmp, 'video@%.1fs/%.1fs' % (at, dur)
    raise RuntimeError('抽帧失败（%.1fs）' % dur)


def to_1920(src, dst, quality=86):
    im = Image.open(src)
    if im.mode != 'RGB':
        im = im.convert('RGB')
    w, h = im.size
    if w / h >= 16 / 9:
        nw, nh = 1920, max(1, round(1920 * h / w))
    else:
        nh, nw = 1080, max(1, round(1080 * w / h))
    if (nw, nh) != (w, h):
        im = im.resize((nw, nh), Image.LANCZOS)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    im.save(dst, 'JPEG', quality=quality, optimize=True, progressive=True)
    return nw, nh, os.path.getsize(dst) / 1048576


def main():
    plan = json.load(open(os.path.join(HERE, 'workshop-plan.json'), encoding='utf-8'))
    only = sys.argv[1] if len(sys.argv) > 1 else None
    ok = fail = 0
    for month, girl, slot, pid, kind, main_file, size in plan:
        tag = '%02d-%s' % (month, slot)
        if only and only != tag:
            continue
        dst = os.path.join(OUT, tag + '.jpg')
        try:
            if kind == 'pkg':
                tmp, src_name = extract_pkg(os.path.join(STEAM, pid, 'scene.pkg'))
            elif kind == 'video':
                tmp, src_name = extract_video(os.path.join(STEAM, pid, main_file))
            else:
                raise RuntimeError('未知类型 ' + kind)
            nw, nh, mb = to_1920(tmp, dst)
            print('OK   %-12s %2d月 %-6s  %-42s → %dx%d %.2fMB' % (tag, month, girl, src_name[:42], nw, nh, mb))
            ok += 1
        except Exception as e:
            print('FAIL %-12s %2d月 %-6s  %s' % (tag, month, girl, e))
            fail += 1
    for f in ('_tmp_extract.jpg', '_tmp_extract.png'):
        p = os.path.join(HERE, f)
        if os.path.exists(p):
            os.remove(p)
    print('\n完成 %d，失败 %d' % (ok, fail))


if __name__ == '__main__':
    main()
