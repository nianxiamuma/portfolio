"""探测 30 个 scene.pkg 里主贴图的格式：是能直出的 JPEG/PNG，还是需要解码的 DXT 纹理。

用法：python probe_pkg.py
"""
import json
import os
import struct

STEAM = r'C:/Program Files (x86)/Steam/steamapps/workshop/content/431960'
HERE = os.path.dirname(os.path.abspath(__file__))


def read_pkg(path):
    data = open(path, 'rb').read()
    pos = 0

    def u32():
        nonlocal pos
        v = struct.unpack_from('<I', data, pos)[0]
        pos += 4
        return v

    ml = u32()
    magic = data[pos:pos + ml].decode('ascii', 'replace')
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
    return magic, entries, pos, data


def main():
    plan = json.load(open(os.path.join(HERE, 'workshop-plan.json'), encoding='utf-8'))
    out = []
    for month, girl, slot, pid, kind, main, size in plan:
        if kind != 'pkg':
            continue
        magic, entries, base, data = read_pkg(os.path.join(STEAM, pid, 'scene.pkg'))
        texs = [e for e in entries if e[0].endswith('.tex')]
        if not texs:
            print('%2d月 %-6s %-5s %-11s  无 .tex 条目（%s）' % (month, girl, slot, pid, magic))
            continue
        name, off, sz = max(texs, key=lambda e: e[2])
        blob = data[base + off: base + off + sz]
        jpg = blob.find(b'\xff\xd8\xff')
        png = blob.find(b'\x89PNG\r\n\x1a\n')
        fmt = struct.unpack_from('<I', blob, 18)[0] if len(blob) > 22 else -1
        flags = struct.unpack_from('<I', blob, 22)[0] if len(blob) > 26 else -1
        if png > 0 and (jpg < 0 or png < jpg):
            kind2 = 'PNG'
        elif jpg > 0:
            kind2 = 'JPEG'
        else:
            kind2 = 'NEEDS-DECODE'
        out.append({'month': month, 'girl': girl, 'slot': slot, 'pid': pid,
                    'tex': name, 'size': sz, 'format': fmt, 'flags': flags, 'kind': kind2})
        print('%2d月 %-6s %-5s %-11s %-12s fmt=%-2d flags=0x%04x  %s' % (
            month, girl, slot, pid, kind2, fmt, flags, name[:34]))

    direct = sum(1 for r in out if r['kind'] in ('JPEG', 'PNG'))
    print('\n可直出 %d / %d' % (direct, len(out)))
    json.dump(out, open(os.path.join(HERE, 'pkg-probe.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
