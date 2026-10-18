"""抽骰子壁纸池：7 个创意工坊条目 → public/wallpapers/dice/<key>.jpg"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import extract_all as E

STEAM = E.STEAM
OUT = os.path.normpath(os.path.join(E.HERE, '..', '..', 'public', 'wallpapers', 'dice'))

# key: (pid, 主文件名匹配, 类型)
PLAN = [
    ('1-hinata', '3118949804', 'pkg'),
    ('2-makima', '2935530316', 'pkg'),
    ('3-sunset', '3066514640', 'pkg'),
    ('4-saber', '3236073283', 'pkg'),
    ('5-miku', '3804377883', 'video'),
    ('6-miku-b', '2880877046', 'pkg'),
    ('default-sword', '3068206129', 'video'),
]


def video_file(pid):
    d = os.path.join(STEAM, pid)
    for name in os.listdir(d):
        if name.lower().endswith(('.mp4', '.webm', '.mov')):
            return os.path.join(d, name)
    raise RuntimeError('目录里没有视频')


def main():
    ok = fail = 0
    for key, pid, kind in PLAN:
        dst = os.path.join(OUT, key + '.jpg')
        try:
            if kind == 'pkg':
                tmp, src = E.extract_pkg(os.path.join(STEAM, pid, 'scene.pkg'))
            else:
                tmp, src = E.extract_video(video_file(pid))
            nw, nh, mb = E.to_1920(tmp, dst)
            print('OK   %-14s %-11s %-40s → %dx%d %.2fMB' % (key, pid, src[:40], nw, nh, mb))
            ok += 1
        except Exception as e:
            print('FAIL %-14s %-11s %s' % (key, pid, e))
            fail += 1
    print('\n完成 %d，失败 %d' % (ok, fail))


if __name__ == '__main__':
    main()
