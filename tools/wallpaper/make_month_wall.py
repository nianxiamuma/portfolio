"""把解包出的原始壁纸缩成全站统一的 1920x1080 JPEG。

用法：python make_month_wall.py <src> <dst> [quality]
"""
import os
import sys

from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
quality = int(sys.argv[3]) if len(sys.argv) > 3 else 85

im = Image.open(src)
if im.mode != 'RGB':
    im = im.convert('RGB')

# 等比缩放到 1920 宽（横图），竖图按高度贴 1080
w, h = im.size
if w / h >= 16 / 9:
    nw, nh = 1920, max(1, round(1920 * h / w))
else:
    nh, nw = 1080, max(1, round(1080 * w / h))
im = im.resize((nw, nh), Image.LANCZOS)

os.makedirs(os.path.dirname(dst), exist_ok=True)
im.save(dst, 'JPEG', quality=quality, optimize=True, progressive=True)
print('%s -> %s  %dx%d  %.2f MB' % (os.path.basename(src), dst, nw, nh, os.path.getsize(dst) / 1048576))
