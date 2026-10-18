"""扫描 12 位女主 × 3 个创意工坊目录，报告每个素材的主文件类型与大小。

用法：python scan_workshop.py
"""
import json
import os

STEAM = r'C:/Program Files (x86)/Steam/steamapps/workshop/content/431960'

# 月份 → (角色, [hero目录, story目录, about目录])，与 src/lib/wallpapers.js 的 MONTH_COVERS 对齐
PLAN = [
    (1, '灰原哀', ['3303378406', '3244439245', '3634147911']),
    (2, '雪之下雪乃', ['3341139160', '3204766006', '3424553152']),
    (3, '樱岛麻衣', ['3338600469', '3631772163', '3479569571']),
    (4, '后藤一里', ['3311132989', '3546682757', '3376638732']),
    (5, '中野三玖', ['3587340938', '3350691368', '3424606328']),
    (6, '栗山未来', ['1275154405', '3080882371', '1980872617']),
    (7, '02', ['3028756322', '3354939387', '3262794021']),
    (8, '远坂凛', ['3733618241', '3326186982', '2832709300']),
    (9, '蕾塞', ['3409806567', '3587512796', '3387842119']),
    (10, '上杉绘梨衣', ['3319326161', '3474321748', '2578984837']),
    (11, '友利奈绪', ['2996811810', '2871553065', '3242737406']),
    (12, '薇尔莉特', ['2511175703', '3142093706', '3373750809']),
]

SLOTS = ['hero', 'story', 'about']


def fmt(mb):
    return '%.1fMB' % mb


def inspect(pid):
    d = os.path.join(STEAM, pid)
    if not os.path.isdir(d):
        return {'pid': pid, 'missing': True, 'files': []}
    files = []
    for name in os.listdir(d):
        p = os.path.join(d, name)
        if not os.path.isfile(p):
            continue
        size = os.path.getsize(p) / 1048576
        files.append((name, size))
    files.sort(key=lambda x: -x[1])
    return {'pid': pid, 'missing': False, 'files': files}


def main():
    rows = []
    for month, girl, pids in PLAN:
        for slot, pid in zip(SLOTS, pids):
            info = inspect(pid)
            if info['missing']:
                kind, main, size = 'MISSING', '-', 0
            else:
                names = [n for n, s in info['files'] if n != 'preview.jpg' and n != 'preview.gif']
                big = info['files'][0] if info['files'] else ('-', 0)
                if any(n == 'scene.pkg' for n in names):
                    kind = 'pkg'
                    main = 'scene.pkg'
                    size = dict(info['files'])['scene.pkg']
                elif any(n.lower().endswith(('.mp4', '.webm', '.mov')) for n in names):
                    vid = [n for n in names if n.lower().endswith(('.mp4', '.webm', '.mov'))][0]
                    kind = 'video'
                    main = vid
                    size = dict(info['files'])[vid]
                else:
                    kind = 'other'
                    main = big[0]
                    size = big[1]
            rows.append((month, girl, slot, pid, kind, main, size))
            print('%2d月 %-6s %-5s %-11s %-7s %-28s %s' % (month, girl, slot, pid, kind, main[:28], fmt(size)))
        print('')

    pkg = sum(1 for r in rows if r[4] == 'pkg')
    vid = sum(1 for r in rows if r[4] == 'video')
    other = sum(1 for r in rows if r[4] == 'other')
    miss = sum(1 for r in rows if r[4] == 'MISSING')
    print('合计 %d 项：pkg=%d video=%d other=%d missing=%d' % (len(rows), pkg, vid, other, miss))
    with open(os.path.join(os.path.dirname(__file__), 'workshop-plan.json'), 'w', encoding='utf-8') as f:
        json.dump(rows, f, ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
